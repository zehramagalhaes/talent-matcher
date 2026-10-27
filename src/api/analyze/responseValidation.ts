import { AnalyzeReportSchema, type AnalyzeReportResult } from "./schema.ts";

export type AnalysisResponseResult =
  | { success: true; data: AnalyzeReportResult }
  | { success: false; reason: "invalid_json" | "invalid_schema" | "invalid_evidence" };

export const parseAnalysisResponse = (
  responseText: string,
  resumeText: string
): AnalysisResponseResult => {
  let rawData: unknown;
  try {
    rawData = JSON.parse(responseText);
  } catch {
    return { success: false, reason: "invalid_json" };
  }

  const parsed = AnalyzeReportSchema.safeParse(rawData);
  if (!parsed.success) return { success: false, reason: "invalid_schema" };

  const report = parsed.data;
  const experienceEvidence = [
    report.optimized_versions.compact,
    report.optimized_versions.detailed,
  ].flatMap((version) =>
    version.experience.flatMap((experience) => {
      const bullets = [...experience.bullets_primary, ...experience.bullets_optional];
      if (bullets.length !== experience.bullet_evidence.length) return ["invalid"];
      if (bullets.some((bullet, index) => experience.bullet_evidence[index]?.bullet !== bullet)) {
        return ["invalid"];
      }
      return [
        ...experience.source_evidence,
        ...experience.bullet_evidence.flatMap((item) => item.evidence),
      ];
    })
  );
  const skillEvidence = [
    report.optimized_versions.compact,
    report.optimized_versions.detailed,
  ].flatMap((version) =>
    version.skills.flatMap((group) => {
      const itemEvidence = group.item_evidence || [];
      if (!group.source_evidence?.length || group.items.length !== itemEvidence.length) {
        return ["invalid"];
      }
      if (group.items.some((skill, index) => itemEvidence[index]?.skill !== skill)) {
        return ["invalid"];
      }
      return [...group.source_evidence, ...itemEvidence.flatMap((item) => item.evidence)];
    })
  );
  const planEvidence = report.matching_plan.flatMap((item) => {
    if (item.status === "missing") return item.evidence.length ? ["invalid"] : [];
    if (!item.evidence.length) return ["invalid"];
    return item.evidence;
  });

  if (
    ![...experienceEvidence, ...skillEvidence, ...planEvidence, ...report.summary_evidence].every(
      (excerpt) => resumeText.includes(excerpt)
    )
  ) {
    return { success: false, reason: "invalid_evidence" };
  }

  return { success: true, data: report };
};

export const classifyGeminiError = (
  error: unknown
): { status: 503 | 504; error: string; message: string } => {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status?: unknown }).status)
      : undefined;
  const name = error instanceof Error ? error.name : "";

  if (
    name.includes("Abort") ||
    /abort|timeout|timed out/i.test(error instanceof Error ? error.message : "")
  ) {
    return {
      status: 504,
      error: "Analysis timed out",
      message: "The analysis took too long. Please try again.",
    };
  }

  if (status === 429 || (status !== undefined && status >= 500)) {
    return {
      status: 503,
      error: "Service temporarily unavailable",
      message: "The AI service is temporarily unavailable. Please try again in a few moments.",
    };
  }

  return {
    status: 503,
    error: "Analysis unavailable",
    message: "The analysis could not be completed. Please try again.",
  };
};
