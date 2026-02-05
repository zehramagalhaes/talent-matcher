import { z } from "zod";

export const OptimizationSchema = z.object({
  match_score: z.number(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  keywords_to_add: z.array(z.string()),
  scoring_rubric: z.object({
    categories: z.array(
      z.object({
        name: z.string(),
        weight: z.number(),
        score: z.number(),
        notes: z.string().optional().nullable(),
      })
    ),
    overall_notes: z.string(),
  }),
  optimized_resume: z.object({
    name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
    portfolio: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    languages: z.array(z.string()).optional().default([]),
    summary: z.array(z.string()),
    skills: z.array(z.string()),
    experience: z.array(
      z.object({
        heading: z.string(),
        bullets_primary: z.array(z.string()),
        bullets_optional: z.array(z.string()).optional().default([]),
      })
    ),
    education: z.array(z.string()).optional().default([]),
    certifications: z.array(z.string()).optional().default([]),
  }),
});

export type OptimizationResult = z.infer<typeof OptimizationSchema>;
