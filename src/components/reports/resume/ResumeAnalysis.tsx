import React from "react";
import { Box, Divider, Chip, Stack, Container } from "@mui/material";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { useToast } from "@/context/ToastContext";
import { generateResumePDF } from "@/utils/generate/pdfGenerator";
import { generateResumeDocx } from "@/utils/generate/docxGenerator";
import { useTranslation } from "@/hooks/useTranslation";
import { sanitizeToCategorized, sanitizeToStrings } from "@/utils/dashboardUtils";

import { OptimizedResume } from "@/components/reports/resume/sections/OptimizedResume";
import { ResumeAnalysisHeader } from "@/components/reports/resume/sections/header/ResumeAnalysisHeader";
import { InsightsGrid } from "@/components/reports/resume/sections/InsightsGrid";
import { StrengthsGaps } from "@/components/reports/resume/sections/StrengthsGaps";
import ExperienceBridge from "@/components/reports/resume/sections/ExperienceBridge";
import { ImprovementModal } from "@/components/modals/ImprovementModal";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";

export const ResumeAnalysisReport: React.FC<{ data: AnalyzeReportResult }> = ({ data }) => {
  const { addToast } = useToast();
  const { t, locale } = useTranslation();
  const {
    strategy,
    setStrategy,
    currentResume,
    currentScore,
    localVersions,
    pendingImprovement,
    setPendingImprovement,
    handleReset,
    updateExperience,
    confirmSkillImprovement,
  } = useResumeAnalysis(data);

  const categorizedKeywords = sanitizeToCategorized(data.keywords_to_add as unknown[]);
  const safeStrengths = sanitizeToStrings(data.strengths as unknown[]);
  const safeGaps = sanitizeToStrings(data.gaps as unknown[]);

  const handleDownload = async (format: "pdf" | "docx") => {
    try {
      if (format === "pdf") {
        generateResumePDF(localVersions[strategy], strategy, locale);
      } else {
        await generateResumeDocx(localVersions[strategy], strategy, locale);
      }
      addToast(t("dashboard.actions.downloadSuccess"), "success");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 10 }}>
      {/* TIER 1: Navigation & Global Actions */}
      <ResumeAnalysisHeader
        strategy={strategy}
        setStrategy={setStrategy}
        isPreviewMode={false}
        onDownload={handleDownload}
        onReset={handleReset}
        compactData={localVersions.compact}
        detailedData={localVersions.detailed}
      />

      <Stack spacing={6} sx={{ mt: 4 }}>
        {/* TIER 2: High-Level Insights (Score + Notes) */}
        <InsightsGrid
          resume={currentResume}
          score={currentScore}
          notes={data.scoring_rubric.overall_notes}
          keywords={categorizedKeywords}
          viewType={strategy}
          onAddKeyword={setPendingImprovement}
        />

        {/* TIER 3: Detailed Feedback (Strengths vs Gaps) */}
        <StrengthsGaps strengths={safeStrengths} gaps={safeGaps} />

        {/* TIER 4: Actionable Improvements */}
        <ExperienceBridge
          suggestions={data.experience_bridge_suggestions}
          onAdd={updateExperience}
        />

        {/* TIER 5: Final Document Preview */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 6 }}>
            <Chip
              label={t("dashboard.header.preview").toUpperCase()}
              size="small"
              sx={{
                fontWeight: "900",
                px: 3,
                letterSpacing: 1.5,
              }}
            />
          </Divider>

          <OptimizedResume resume={currentResume} />
        </Box>
      </Stack>

      <ImprovementModal
        keyword={pendingImprovement}
        onClose={() => setPendingImprovement(null)}
        onConfirm={confirmSkillImprovement}
      />
    </Container>
  );
};
