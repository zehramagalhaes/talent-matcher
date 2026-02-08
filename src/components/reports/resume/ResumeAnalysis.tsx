import React, { useState } from "react";
import { Box, Divider, Chip } from "@mui/material";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { useToast } from "@/context/ToastContext";
import { generateResumePDF } from "@/utils/pdfGenerator";

import OptimizedResume from "@/components/reports/resume/sections/OptimizedResume";
import { ResumeAnalysisHeader } from "@/components/reports/resume/sections/header/ResumeAnalysisHeader";
import { InsightsGrid } from "@/components/reports/resume/sections/InsightsGrid";
import { StrengthsGaps } from "@/components/reports/resume/sections/StrengthsGaps";
import { ImprovementModal } from "@/components/modals/ImprovementModal";
import { useTranslation } from "@/hooks/useTranslation";
import ExperienceBridge from "@/components/reports/resume/sections/ExperienceBridge";
import { sanitizeToCategorized, sanitizeToStrings, SkillGroup } from "@/utils/dashboardUtils";

export const ResumeAnalysisReport: React.FC<{ data: AnalyzeReportResult }> = ({ data }) => {
  const { addToast } = useToast();
  const { t, locale } = useTranslation();

  // State Management
  const [strategy, setStrategy] = useState<"compact" | "detailed">(data.recommended_strategy);
  const [localVersions, setLocalVersions] = useState({
    compact: data.optimized_versions.compact,
    detailed: data.optimized_versions.detailed,
  });
  const [localScores, setLocalScores] = useState({
    compact: data.match_score_compact,
    detailed: data.match_score_detailed,
  });
  const [pendingImprovement, setPendingImprovement] = useState<string | null>(null);

  // Derived Values
  const currentResume = localVersions[strategy];
  const currentScore = localScores[strategy];

  // Logic: InsightsGrid wants objects, StrengthsGaps wants strings.
  const categorizedKeywords = sanitizeToCategorized(data.keywords_to_add as unknown[]);
  const safeStrengths = sanitizeToStrings(data.strengths as unknown[]);
  const safeGaps = sanitizeToStrings(data.gaps as unknown[]);

  // --- Handlers ---
  const handleDownload = () => {
    generateResumePDF(localVersions[strategy], strategy, locale);
    addToast(t("common.download"), "info");
  };

  const handleReset = () => {
    setLocalVersions({
      compact: data.optimized_versions.compact,
      detailed: data.optimized_versions.detailed,
    });
    setLocalScores({
      compact: data.match_score_compact,
      detailed: data.match_score_detailed,
    });
  };

  const handleExperienceImprovement = (fullText: string) => {
    let suggestion = fullText;
    const addIndex = fullText.indexOf("add: ");
    if (addIndex !== -1) suggestion = fullText.substring(addIndex + 5);
    suggestion = suggestion.replace(/^['"]|['"]$/g, "").trim();

    setLocalVersions((prev) => {
      const activeResume = prev[strategy];
      const newExperience = JSON.parse(JSON.stringify(activeResume.experience || []));
      if (newExperience.length > 0) {
        if (!newExperience[0].bullets_primary.includes(suggestion)) {
          newExperience[0].bullets_primary.unshift(suggestion);
        }
      }
      return { ...prev, [strategy]: { ...activeResume, experience: newExperience } };
    });
    setLocalScores((prev) => ({ ...prev, [strategy]: Math.min(prev[strategy] + 5, 100) }));
  };

  const confirmImprovement = () => {
    if (!pendingImprovement) return;
    setLocalVersions((prev) => {
      const activeResume = prev[strategy];
      const newSkills = JSON.parse(JSON.stringify(activeResume.skills || []));
      let targetGroup = newSkills.find((group: SkillGroup) =>
        group.category.toLowerCase().match(/skill|technology|tools/)
      );
      if (!targetGroup && newSkills.length > 0) targetGroup = newSkills[0];
      if (!targetGroup) {
        targetGroup = { category: t("common.status"), items: [] };
        newSkills.push(targetGroup);
      }
      if (!targetGroup.items.includes(pendingImprovement))
        targetGroup.items.push(pendingImprovement);
      return { ...prev, [strategy]: { ...activeResume, skills: newSkills } };
    });
    setLocalScores((prev) => ({ ...prev, [strategy]: Math.min(prev[strategy] + 2, 100) }));
    addToast(t("common.confirm"), "success");
    setPendingImprovement(null);
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
        keywords={categorizedKeywords} // Matches the expected SkillGroup[] (CategorizedKeywords[])
        viewType={strategy}
        onAddKeyword={(kw) => setPendingImprovement(kw)}
      />

      <StrengthsGaps strengths={safeStrengths} gaps={safeGaps} />

      <ExperienceBridge
        suggestions={data.experience_bridge_suggestions}
        onAdd={handleExperienceImprovement}
      />

      <Box sx={{ textAlign: "center", mb: 4, position: "relative" }}>
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
        onConfirm={confirmImprovement}
      />
    </Box>
  );
};
