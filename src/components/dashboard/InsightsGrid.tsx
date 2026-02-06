import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils"; // Accessibility utility
import AssignmentIcon from "@mui/icons-material/Assignment";

interface InsightsProps {
  score: number;
  strategy: string;
  notes: string;
  keywords: string[];
  onAddKeyword: (kw: string) => void;
}

export const InsightsGrid: React.FC<InsightsProps> = ({
  score,
  strategy,
  notes,
  keywords,
  onAddKeyword,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* ACCESSIBLE SCORE CARD */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          elevation={0}
          role="region"
          aria-label={`${strategy} match score details`}
          sx={{
            textAlign: "center",
            p: 3,
            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : theme.palette.primary.main,
            color: isDark ? theme.palette.primary.light : theme.palette.primary.contrastText,
            height: "100%",
            borderRadius: 4,
            border: isDark ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : "none",
          }}
        >
          <Typography
            variant="subtitle2"
            id="score-label"
            sx={{
              opacity: isDark ? 1 : 0.8,
              fontWeight: 800,
              letterSpacing: "0.1em",
              fontSize: "0.75rem",
            }}
          >
            {strategy.toUpperCase()} SCORE
          </Typography>

          <Typography
            variant="h2"
            aria-labelledby="score-label"
            sx={{ fontWeight: 900, my: 1.5, fontSize: { xs: "3.5rem", md: "4.5rem" } }}
          >
            {score}%
          </Typography>

          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={score}
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: isDark
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.white, 0.25),
                "& .MuiLinearProgress-bar": {
                  bgcolor: isDark ? theme.palette.primary.main : theme.palette.common.white,
                },
              }}
            />
            {/* CORRECTED: Visually Hidden Accessibility Text */}
            <Box component="span" sx={visuallyHidden}>
              Your resume currently matches {score} percent of the job description requirements.
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* AI INSIGHTS & KEYWORD CLOUD */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card
          variant="outlined"
          sx={{
            height: "100%",
            borderRadius: 4,
            bgcolor: "background.paper",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, fontWeight: 900 }}
            >
              <AssignmentIcon /> AI Insights
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: "text.secondary" }}>
              {notes}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
              {keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onClick={() => onAddKeyword(keyword)}
                  sx={{
                    borderRadius: "8px",
                    fontWeight: 700,
                    bgcolor: isDark
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.primary.main, 0.05),
                    color: isDark ? theme.palette.primary.light : theme.palette.primary.dark,
                    border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)}`,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12),
                    },
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
