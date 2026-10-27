import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyGeminiError,
  parseAnalysisResponse,
} from "../src/api/analyze/responseValidation.ts";
import { buildPrompt, SYSTEM_INSTRUCTION } from "../src/api/prompt.ts";

const resumeText = [
  "Senior Platform Engineer | Northwind Systems | 2021–2024",
  "Built deployment tooling with Kubernetes and Terraform for internal services.",
  "Reduced release steps from 12 to 5 through an automated workflow.",
  "Maintained Go services and PostgreSQL databases.",
  "BSc Computer Science, Example University, 2018",
].join("\n");

const resumeVersion = () => ({
  name: "Mina Example",
  title: "Senior Platform Engineer",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  website: "",
  languages: [],
  summary: ["Platform engineer with Kubernetes, Terraform, Go, and PostgreSQL experience."],
  skills: [
    {
      category: "Platforms",
      items: ["Kubernetes", "Terraform", "Go", "PostgreSQL"],
      source_evidence: [
        "Built deployment tooling with Kubernetes and Terraform for internal services.",
        "Maintained Go services and PostgreSQL databases.",
      ],
      item_evidence: [
        {
          skill: "Kubernetes",
          evidence: [
            "Built deployment tooling with Kubernetes and Terraform for internal services.",
          ],
        },
        {
          skill: "Terraform",
          evidence: [
            "Built deployment tooling with Kubernetes and Terraform for internal services.",
          ],
        },
        { skill: "Go", evidence: ["Maintained Go services and PostgreSQL databases."] },
        { skill: "PostgreSQL", evidence: ["Maintained Go services and PostgreSQL databases."] },
      ],
    },
  ],
  experience: [
    {
      heading: "Senior Platform Engineer | Northwind Systems | 2021–2024",
      bullets_primary: [
        "Built deployment tooling with Kubernetes and Terraform for internal services.",
        "Reduced release steps from 12 to 5 through an automated workflow.",
        "Maintained Go services and PostgreSQL databases.",
      ],
      bullets_optional: [],
      source_evidence: ["Senior Platform Engineer | Northwind Systems | 2021–2024"],
      bullet_evidence: [
        {
          bullet: "Built deployment tooling with Kubernetes and Terraform for internal services.",
          evidence: [
            "Built deployment tooling with Kubernetes and Terraform for internal services.",
          ],
        },
        {
          bullet: "Reduced release steps from 12 to 5 through an automated workflow.",
          evidence: ["Reduced release steps from 12 to 5 through an automated workflow."],
        },
        {
          bullet: "Maintained Go services and PostgreSQL databases.",
          evidence: ["Maintained Go services and PostgreSQL databases."],
        },
      ],
    },
  ],
  education: ["BSc Computer Science, Example University, 2018"],
  certifications: [],
});

const report = () => ({
  match_score_compact: 75,
  match_score_detailed: 80,
  recommended_strategy: "detailed",
  strategy_insight: "The detailed version retains the implementation and release outcome evidence.",
  summary_evidence: [
    "Senior Platform Engineer | Northwind Systems | 2021–2024",
    "Built deployment tooling with Kubernetes and Terraform for internal services.",
    "Maintained Go services and PostgreSQL databases.",
  ],
  strengths: [{ category: "Deployment", items: ["Kubernetes and Terraform deployment tooling"] }],
  gaps: [{ category: "Cloud platform", items: ["No named cloud provider appears in the resume."] }],
  keywords_to_add: [{ category: "Cloud platform", items: ["AWS, if applicable"] }],
  matching_plan: [
    {
      requirement: "Infrastructure automation",
      category: "Required skill",
      status: "supported",
      evidence: ["Built deployment tooling with Kubernetes and Terraform for internal services."],
      rationale: "The resume explicitly names deployment tooling, Kubernetes, and Terraform.",
    },
    {
      requirement: "AWS experience",
      category: "Preferred qualification",
      status: "missing",
      evidence: [],
      rationale: "No AWS experience is stated in the supplied resume.",
    },
  ],
  section_decisions: [
    {
      section: "Summary",
      action: "rewrite",
      reason: "Surface the directly relevant platform tools.",
    },
    { section: "Education", action: "retain", reason: "The existing entry is already concise." },
  ],
  experience_bridge_suggestions: [],
  scoring_rubric: { overall_notes: "Scores reflect stated evidence only." },
  optimized_versions: { compact: resumeVersion(), detailed: resumeVersion() },
});

test("validates a specific tailored report while preserving source facts and outcomes", () => {
  const result = parseAnalysisResponse(JSON.stringify(report()), resumeText);
  assert.equal(result.success, true);
  assert.equal(result.data.optimized_versions.detailed.experience[0].bullets_primary.length, 3);
  assert.match(result.data.optimized_versions.detailed.experience[0].bullets_primary[1], /12 to 5/);
  assert.equal(result.data.matching_plan[1].status, "missing");
  assert.deepEqual(result.data.matching_plan[1].evidence, []);
});

test("rejects fabricated or mismatched citations", () => {
  const invalidCitation = report();
  invalidCitation.matching_plan[0].evidence = ["Led a 20-person AWS migration."];
  assert.deepEqual(parseAnalysisResponse(JSON.stringify(invalidCitation), resumeText), {
    success: false,
    reason: "invalid_evidence",
  });

  const missingEvidence = report();
  missingEvidence.matching_plan[1].evidence = ["AWS migration"];
  assert.deepEqual(parseAnalysisResponse(JSON.stringify(missingEvidence), resumeText), {
    success: false,
    reason: "invalid_evidence",
  });

  const unsupportedBullet = report();
  unsupportedBullet.optimized_versions.detailed.experience[0].bullet_evidence[1].evidence = [
    "Managed a 20-person AWS migration.",
  ];
  assert.equal(
    parseAnalysisResponse(JSON.stringify(unsupportedBullet), resumeText).reason,
    "invalid_evidence"
  );

  const unsupportedSkill = report();
  unsupportedSkill.optimized_versions.compact.skills[0].item_evidence[0].evidence = [
    "Expert-level AWS architecture",
  ];
  assert.equal(
    parseAnalysisResponse(JSON.stringify(unsupportedSkill), resumeText).reason,
    "invalid_evidence"
  );
});

test("rejects malformed JSON, out-of-range scores, and missing plan fields", () => {
  assert.equal(parseAnalysisResponse("not json", resumeText).reason, "invalid_json");
  const badScore = report();
  badScore.match_score_detailed = 120;
  assert.equal(
    parseAnalysisResponse(JSON.stringify(badScore), resumeText).reason,
    "invalid_schema"
  );
  const noPlan = report();
  delete noPlan.matching_plan;
  assert.equal(parseAnalysisResponse(JSON.stringify(noPlan), resumeText).reason, "invalid_schema");
});

test("keeps trusted workflow instructions separate from untrusted document input", () => {
  const userPrompt = buildPrompt(resumeText, "Must have AWS and Kubernetes experience", "en");
  assert.match(SYSTEM_INSTRUCTION, /complete in this order/);
  assert.match(SYSTEM_INSTRUCTION, /exact, verbatim resume excerpts/);
  assert.equal(SYSTEM_INSTRUCTION.includes(resumeText), false);
  assert.match(userPrompt, /<<<RESUME_CONTENT_START>>>/);
  assert.match(userPrompt, /<<<JOB_DESCRIPTION_START>>>/);
  assert.equal(userPrompt.includes("You are a professional resume specialist"), false);
});

test("maps provider rate limits and timeouts to safe retryable responses", () => {
  assert.equal(classifyGeminiError({ status: 429 }).status, 503);
  assert.equal(classifyGeminiError(new Error("Request timed out")).status, 504);
  assert.equal(classifyGeminiError(new Error("Request aborted when fetching")).status, 504);
  assert.doesNotMatch(classifyGeminiError({ status: 429 }).message, /API key|quota/i);
});
