import React from "react";
import { Grid, Paper, Typography, Box, Chip, useTheme, alpha, Stack } from "@mui/material";
import { useTranslation } from "@/hooks/useTranslation";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ResumeData } from "@/api/analyze/schema";

interface CategorizedKeywords {
  category: string;
  items: string[];
}

interface InsightsProps {
  score: number;
  notes: string;
  keywords: CategorizedKeywords[];
  onAddKeyword: (kw: string) => void;
  viewType: string;
  resume: ResumeData;
}

export const InsightsGrid: React.FC<InsightsProps> = ({
  score,
  notes,
  keywords = [], // Default value to prevent .map errors
  onAddKeyword,
  viewType,
  resume,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Safely extract existing skills
  const existingSkills = React.useMemo(
    () => resume?.skills?.flatMap((s) => s.items.map((i) => i.toLowerCase())) || [],
    [resume?.skills]
  );

  const getScoreStatus = () => {
    if (score >= 80) return theme.palette.success;
    if (score >= 50) return theme.palette.warning;
    return theme.palette.error;
  };

  const statusColor = getScoreStatus();
  const vibrantGradient = `linear-gradient(135deg, ${statusColor.main} 0%, ${statusColor.dark} 100%)`;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* SCORE CARD */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            textAlign: "center",
            background: vibrantGradient,
            color: statusColor.contrastText,
            borderRadius: 6,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 12px 30px ${alpha(statusColor.main, 0.4)}`,
          }}
        >
          <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.9, letterSpacing: 2 }}>
            {viewType.toUpperCase()}
          </Typography>
          <Typography variant="h1" sx={{ fontWeight: 900, my: 1, fontSize: "4.5rem" }}>
            {score}%
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 10,
              bgcolor: alpha("#fff", 0.2),
              borderRadius: 5,
              mt: 2,
              maxWidth: 200,
            }}
          >
            <Box
              sx={{
                width: `${score}%`,
                height: "100%",
                bgcolor: statusColor.contrastText,
                borderRadius: 5,
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* AI INSIGHTS & CATEGORIZED KEYWORDS */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 6,
            height: "100%",
            border: "2px solid",
            borderColor: alpha(statusColor.main, 0.2),
            bgcolor: isDarkMode ? alpha(statusColor.main, 0.05) : alpha(statusColor.main, 0.02),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: statusColor.main }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: isDarkMode ? statusColor.light : statusColor.dark }}
            >
              {t("dashboard.overallNotes")}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8, fontWeight: 500 }}>
            {notes}
          </Typography>

          <Stack spacing={3}>
            {/* Guard against non-array keywords */}
            {Array.isArray(keywords) &&
              keywords.map((group, gIdx) => (
                <Box key={group.category || gIdx}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: statusColor.main,
                      fontSize: "0.75rem",
                    }}
                  >
                    {group.category}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {group.items?.map((kw, iIdx) => {
                      const isAdded = existingSkills.includes(kw.toLowerCase());
                      return (
                        <Chip
                          key={`${gIdx}-${iIdx}`}
                          label={kw}
                          onClick={isAdded ? undefined : () => onAddKeyword(kw)}
                          icon={isAdded ? <CheckCircleIcon /> : <AddCircleOutlineIcon />}
                          disabled={isAdded}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            bgcolor: isAdded
                              ? alpha(theme.palette.action.disabled, 0.1)
                              : alpha(statusColor.main, isDarkMode ? 0.2 : 0.1),
                            color: isAdded ? "text.disabled" : "inherit",
                            border: `1px solid ${alpha(statusColor.main, 0.3)}`,
                            "&:hover": !isAdded ? { bgcolor: statusColor.main, color: "#fff" } : {},
                            transition: "0.2s",
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};
