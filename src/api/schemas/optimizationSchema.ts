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
    })
  ),
  experience: z.array(
    z.object({
      heading: z.string(),
      bullets_primary: z.array(z.string()),
      bullets_optional: z.array(z.string()).default([]),
    })
  ),
  education: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
});

export const OptimizationSchema = z.object({
  match_score_compact: z.number(),
  match_score_detailed: z.number(),
  recommended_strategy: z.enum(["compact", "detailed"]),
  strategy_insight: z.string(),
  title_suggestion: z.string().optional(),
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
export type OptimizationResult = z.infer<typeof OptimizationSchema>;
