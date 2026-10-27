import { z } from "zod";

export const ResumeSourceSchema = z.object({
  originalText: z.string().min(1),
  sections: z.array(
    z.object({
      type: z.enum(["experience", "education", "skills", "certifications", "other"]),
      heading: z.string(),
      content: z.string(),
      evidence: z.array(z.string()),
    })
  ),
  unresolvedFields: z.array(
    z.enum([
      "employers",
      "jobTitles",
      "dates",
      "responsibilities",
      "achievements",
      "education",
      "skills",
      "certifications",
    ])
  ),
  facts: z.object({
    employers: z.array(z.string()),
    jobTitles: z.array(z.string()),
    dates: z.array(z.string()),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string()),
    education: z.array(z.string()),
    skills: z.array(z.string()),
    certifications: z.array(z.string()),
  }),
});

export type ResumeSource = z.infer<typeof ResumeSourceSchema>;
