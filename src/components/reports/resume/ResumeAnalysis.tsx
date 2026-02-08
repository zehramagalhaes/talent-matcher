import React from "react";
import { Box, Divider, Chip } from "@mui/material";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { useToast } from "@/context/ToastContext";
import { generateResumePDF } from "@/utils/pdfGenerator";
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

  // Data Sanitization (Memoized internally by component or handled here)
  const categorizedKeywords = sanitizeToCategorized(data.keywords_to_add as unknown[]);
  const safeStrengths = sanitizeToStrings(data.strengths as unknown[]);
  const safeGaps = sanitizeToStrings(data.gaps as unknown[]);

  const handleDownload = () => {
    generateResumePDF(localVersions[strategy], strategy, locale);
    addToast(t("dashboard.actions.downloadSuccess"), "success");
  };

  const onConfirmImprovement = () => {
    confirmSkillImprovement();
    addToast(t("dashboard.actions.improvementAdded"), "success");
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ResumeAnalysisHeader
        strategy={strategy}
        setStrategy={setStrategy}
        isPreviewMode={false}
        onDownload={handleDownload}
        onReset={handleReset}
        compactData={localVersions.compact}
        detailedData={localVersions.detailed}
      />

      <InsightsGrid
        resume={currentResume}
        score={currentScore}
        notes={data.scoring_rubric.overall_notes}
        keywords={categorizedKeywords}
        viewType={strategy}
        onAddKeyword={setPendingImprovement}
      />

      <StrengthsGaps strengths={safeStrengths} gaps={safeGaps} />

      <ExperienceBridge suggestions={data.experience_bridge_suggestions} onAdd={updateExperience} />

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Divider>
          <Chip
            label={t("dashboard.header.preview").toUpperCase()}
            size="small"
            sx={{ fontWeight: "bold", px: 2 }}
          />
        </Divider>
      </Box>

      <OptimizedResume resume={currentResume} />

      <ImprovementModal
        keyword={pendingImprovement}
        onClose={() => setPendingImprovement(null)}
        onConfirm={onConfirmImprovement}
      />
    </Box>
  );
};
