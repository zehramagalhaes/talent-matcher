import React, { useMemo } from "react";
import { Grid, Paper, Typography, Box, useTheme, alpha, Stack } from "@mui/material";
import { useTranslation } from "@/hooks/useTranslation";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ScoreCard } from "@/components/cards/ScoreCard";
import { KeywordChip } from "@/components/chips/KeywordChip";
import { CategorizedKeywords } from "@/models/ResumeAnalysis.models";
import { ResumeData } from "@/api/analyze/schema";

interface InsightsGridProps {
  score: number;
  notes: string;
  keywords: CategorizedKeywords[];
  onAddKeyword: (kw: string) => void;
  viewType: string;
  resume: ResumeData;
}

export const InsightsGrid: React.FC<InsightsGridProps> = ({
  score,
  notes,
  keywords = [],
  onAddKeyword,
  viewType,
  resume,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const existingSkills = useMemo(
    () => resume?.skills?.flatMap((s) => s.items.map((i) => i.toLowerCase())) || [],
    [resume]
  );

  const statusColor =
    score >= 80 ? theme.palette.success : score >= 50 ? theme.palette.warning : theme.palette.error;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <ScoreCard score={score} viewType={viewType.toUpperCase()} status={statusColor} />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 6,
            height: "100%",
            border: "2px solid",
            borderColor: alpha(statusColor.main, 0.2),
            bgcolor: (t) => alpha(statusColor.main, t.palette.mode === "dark" ? 0.05 : 0.02),
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: statusColor.main }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t("dashboard.overallNotes")}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8, fontWeight: 500 }}>
            {notes}
          </Typography>

          <Stack spacing={3}>
            {keywords.map((group, gIdx) => (
              <Box key={group.category || gIdx}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: statusColor.main,
                    fontSize: "0.75rem",
                  }}
                >
                  {group.category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {group.items?.map((kw, iIdx) => (
                    <KeywordChip
                      key={`${gIdx}-${iIdx}`}
                      kw={kw}
                      statusColor={statusColor}
                      onAdd={onAddKeyword}
                      isAdded={existingSkills.includes(kw.toLowerCase())}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};
