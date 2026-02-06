import React, { useState } from "react";
import { Box, Divider, Chip, Alert, Grid, Typography, Paper } from "@mui/material";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";
import { useToast } from "@/context/ToastContext";
import { generateResumePDF } from "@/utils/pdfGenerator";
import OptimizedResume from "./OptimizedResume";
import { DashboardHeader } from "./DashboardHeader";
import { InsightsGrid } from "./InsightsGrid";
import { StrengthsGaps } from "./StrengthsGaps";
import { ImprovementModal } from "./ImprovementModal";

interface SkillGroup {
  category: string;
  items: string[];
}

export const OptimizationDashboard: React.FC<{ data: OptimizationResult }> = ({ data }) => {
  const { addToast } = useToast();

  // 1. Manage strategy selection
  const [strategy, setStrategy] = useState<"compact" | "detailed">(data.recommended_strategy);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 2. Maintain a local copy of both versions to allow editing/improvements
  // without triggering the "Effect" render loop.
  const [localVersions, setLocalVersions] = useState({
    compact: data.optimized_versions.compact,
    detailed: data.optimized_versions.detailed,
  });

  // 3. Maintain local scores to reflect improvements
  const [localScores, setLocalScores] = useState({
    compact: data.match_score_compact,
    detailed: data.match_score_detailed,
  });

  const [pendingImprovement, setPendingImprovement] = useState<string | null>(null);

  // 4. Derived State: These variables update automatically when strategy or local state changes
  // This eliminates the need for useEffect
  const currentResume = localVersions[strategy];
  const currentScore = localScores[strategy];

  const confirmImprovement = () => {
    if (!pendingImprovement) return;

    // Update the specific version being viewed
    setLocalVersions((prev) => {
      const activeResume = prev[strategy];
      // Type-safe deep copy of skills
      const newSkills: SkillGroup[] = JSON.parse(JSON.stringify(activeResume.skills || []));

      let targetCat = newSkills.find((s) => s.category === "Additional Skills");

      if (!targetCat) {
        targetCat = { category: "Additional Skills", items: [] };
        newSkills.push(targetCat);
      }

      if (!targetCat.items.includes(pendingImprovement)) {
        targetCat.items.push(pendingImprovement);
      }

      return {
        ...prev,
        [strategy]: { ...activeResume, skills: newSkills },
      };
    });

    // Update score for the current strategy
    setLocalScores((prev) => ({
      ...prev,
      [strategy]: Math.min(prev[strategy] + 2, 100),
    }));

    addToast(`Added ${pendingImprovement}!`, "success");
    setPendingImprovement(null);
  };

  return (
    <Box sx={{ pb: 8 }}>
      <DashboardHeader
        strategy={strategy}
        setStrategy={setStrategy}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        onDownload={() => generateResumePDF(currentResume, strategy)}
        // Pass the local (potentially edited) versions to the header/preview
        compactData={localVersions.compact}
        detailedData={localVersions.detailed}
      />

      {data.title_suggestion && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2, borderLeft: "4px solid #0288d1" }}>
          <strong>Title Suggestion:</strong> {data.title_suggestion}
        </Alert>
      )}

      {!isPreviewMode && (
        <>
          <InsightsGrid
            score={currentScore}
            strategy={strategy}
            notes={data.scoring_rubric.overall_notes}
            keywords={data.keywords_to_add}
            onAddKeyword={setPendingImprovement}
          />
          <StrengthsGaps strengths={data.strengths} gaps={data.gaps} />
          <Divider sx={{ mb: 4 }}>
            <Chip label="RESUME PREVIEW" size="small" />
          </Divider>
          <OptimizedResume resume={currentResume} />
        </>
      )}

      {isPreviewMode && (
        <Grid
          container
          spacing={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 4, overflow: "hidden" }}
        >
          {(["compact", "detailed"] as const).map((key, idx) => (
            <Grid
              key={key}
              size={{ xs: 12, md: 6 }}
              sx={{ borderRight: idx === 0 ? { md: "1px solid" } : "none", borderColor: "divider" }}
            >
              <Box sx={{ p: 1.5, textAlign: "center" }}>
                <Typography variant="overline" fontWeight="900">
                  {key.toUpperCase()} Version
                </Typography>
              </Box>
              <Box
                sx={{
                  p: { xs: 2, md: 4 },
                  height: "75vh",
                  overflowY: "auto",
                  bgcolor: "action.hover",
                }}
              >
                <Paper elevation={4} sx={{ p: 4, minHeight: "100%" }}>
                  <OptimizedResume resume={localVersions[key]} />
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <ImprovementModal
        keyword={pendingImprovement}
        strategy={strategy}
        onClose={() => setPendingImprovement(null)}
        onConfirm={confirmImprovement}
      />
    </Box>
  );
};
