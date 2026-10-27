import { z } from "zod";

const ResumeStructure = z.object({
  name: z.string().nullable(),
  title: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  portfolio: z.string().nullable(),
  website: z.string().nullable(),
  languages: z.array(z.string()).default([]),
  summary: z.array(z.string()),
  skills: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
      source_evidence: z.array(z.string()).min(1).optional(),
      item_evidence: z
        .array(
          z.object({
            skill: z.string(),
            evidence: z.array(z.string()).min(1),
          })
        )
        .optional(),
    })
  ),
  experience: z.array(
    z.object({
      heading: z.string(),
      bullets_primary: z.array(z.string()),
      bullets_optional: z.array(z.string()).default([]),
      source_evidence: z.array(z.string()).min(1),
      bullet_evidence: z.array(
        z.object({
          bullet: z.string(),
          evidence: z.array(z.string()).min(1),
        })
      ),
    })
  ),
  education: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
});

export const AnalyzeReportSchema = z.object({
  match_score_compact: z.number().int().min(0).max(100),
  match_score_detailed: z.number().int().min(0).max(100),
  recommended_strategy: z.enum(["compact", "detailed"]),
  strategy_insight: z.string(),
  title_suggestion: z.string().optional(),
  summary_evidence: z.array(z.string()).min(1),
  strengths: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    })
  ),
  gaps: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    })
  ),
  keywords_to_add: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    })
  ),
  matching_plan: z
    .array(
      z.object({
        requirement: z.string(),
        category: z.string(),
        status: z.enum(["supported", "partial", "missing"]),
        evidence: z.array(z.string()),
        rationale: z.string(),
      })
    )
    .min(1),
  section_decisions: z
    .array(
      z.object({
        section: z.string(),
        action: z.enum(["rewrite", "reorder", "retain", "omit"]),
        reason: z.string(),
      })
    )
    .min(1),
  experience_bridge_suggestions: z
    .array(
      z.object({
        context: z.string(),
        instruction: z.string(),
        applied_experience: z.string(),
      })
    )
    .default([]),

  scoring_rubric: z.object({
    overall_notes: z.string(),
  }),
  optimized_versions: z.object({
    compact: ResumeStructure,
    detailed: ResumeStructure,
  }),
});

export type ResumeData = z.infer<typeof ResumeStructure>;
export type AnalyzeReportResult = z.infer<typeof AnalyzeReportSchema>;
