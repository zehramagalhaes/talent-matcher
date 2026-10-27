import { SchemaType, type ResponseSchema } from "@google/generative-ai";

const stringSchema: ResponseSchema = { type: SchemaType.STRING };
const numberSchema: ResponseSchema = { type: SchemaType.NUMBER };
const arraySchema = (items: ResponseSchema): ResponseSchema => ({ type: SchemaType.ARRAY, items });
const objectSchema = (
  properties: Record<string, ResponseSchema>,
  required = Object.keys(properties)
): ResponseSchema => ({ type: SchemaType.OBJECT, properties, required });

const categorizedItems = objectSchema({
  category: stringSchema,
  items: arraySchema(stringSchema),
});

const resumeStructure = objectSchema({
  name: stringSchema,
  title: stringSchema,
  email: stringSchema,
  phone: stringSchema,
  location: stringSchema,
  linkedin: stringSchema,
  github: stringSchema,
  portfolio: stringSchema,
  website: stringSchema,
  languages: arraySchema(stringSchema),
  summary: arraySchema(stringSchema),
  skills: arraySchema(
    objectSchema({
      category: stringSchema,
      items: arraySchema(stringSchema),
      source_evidence: arraySchema(stringSchema),
      item_evidence: arraySchema(
        objectSchema({
          skill: stringSchema,
          evidence: arraySchema(stringSchema),
        })
      ),
    })
  ),
  experience: arraySchema(
    objectSchema({
      heading: stringSchema,
      bullets_primary: arraySchema(stringSchema),
      bullets_optional: arraySchema(stringSchema),
      source_evidence: arraySchema(stringSchema),
      bullet_evidence: arraySchema(
        objectSchema({
          bullet: stringSchema,
          evidence: arraySchema(stringSchema),
        })
      ),
    })
  ),
  education: arraySchema(stringSchema),
  certifications: arraySchema(stringSchema),
});

export const GEMINI_ANALYSIS_RESPONSE_SCHEMA: ResponseSchema = objectSchema(
  {
    match_score_compact: numberSchema,
    match_score_detailed: numberSchema,
    recommended_strategy: stringSchema,
    strategy_insight: stringSchema,
    title_suggestion: stringSchema,
    summary_evidence: arraySchema(stringSchema),
    strengths: arraySchema(categorizedItems),
    gaps: arraySchema(categorizedItems),
    keywords_to_add: arraySchema(categorizedItems),
    matching_plan: arraySchema(
      objectSchema({
        requirement: stringSchema,
        category: stringSchema,
        status: stringSchema,
        evidence: arraySchema(stringSchema),
        rationale: stringSchema,
      })
    ),
    section_decisions: arraySchema(
      objectSchema({
        section: stringSchema,
        action: stringSchema,
        reason: stringSchema,
      })
    ),
    experience_bridge_suggestions: arraySchema(
      objectSchema({
        context: stringSchema,
        instruction: stringSchema,
        applied_experience: stringSchema,
      })
    ),
    scoring_rubric: objectSchema({ overall_notes: stringSchema }),
    optimized_versions: objectSchema({
      compact: resumeStructure,
      detailed: resumeStructure,
    }),
  },
  [
    "match_score_compact",
    "match_score_detailed",
    "recommended_strategy",
    "strategy_insight",
    "summary_evidence",
    "strengths",
    "gaps",
    "keywords_to_add",
    "matching_plan",
    "section_decisions",
    "experience_bridge_suggestions",
    "scoring_rubric",
    "optimized_versions",
  ]
);
