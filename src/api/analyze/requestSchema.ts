import { z } from "zod";

export const REQUEST_LIMITS = {
  resumeMin: 100,
  resumeMax: 30_000,
  jobMin: 50,
  jobMax: 10_000,
  modelMax: 80,
} as const;

const supportedLanguages = ["en", "pt", "es", "fr", "de", "it"] as const;

export function isSupportedGeminiModelId(value: string): boolean {
  return (
    value.length <= REQUEST_LIMITS.modelMax &&
    /^gemini-(?:2\.5|3)(?:-[a-z0-9]+)*$/i.test(value) &&
    !/(?:image|banana|tts|computer-use|embedding|custom|lite|vision-only)/i.test(value)
  );
}

export const AnalyzeRequestSchema = z
  .object({
    resumeText: z.string().trim().min(REQUEST_LIMITS.resumeMin).max(REQUEST_LIMITS.resumeMax),
    jobDescription: z.string().trim().min(REQUEST_LIMITS.jobMin).max(REQUEST_LIMITS.jobMax),
    language: z.enum(supportedLanguages).optional(),
    selectedModel: z.string().refine(isSupportedGeminiModelId).optional(),
  })
  .strict();

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
