import React from "react";
import { Grid2 as Grid, Typography, Box, Paper, useTheme, alpha } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTranslation } from "@/hooks/useTranslation";

interface StrengthsGapsProps {
  strengths: string[];
  gaps: string[];
}

export const StrengthsGaps: React.FC<StrengthsGapsProps> = ({ strengths, gaps }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // High-contrast colors for text and icons
  const successColor = isDarkMode ? theme.palette.success.light : theme.palette.success.dark;
  const errorColor = isDarkMode ? theme.palette.error.light : theme.palette.error.dark;

  const ListItem = ({ text, color }: { text: string; color: string }) => (
    <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "flex-start" }}>
      <Box
        sx={{
          minWidth: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: color,
          mt: 0.9,
          boxShadow: `0 0 8px ${alpha(color, 0.5)}`, // Adds a small "glow" to the bullet
        }}
      />
      <Typography variant="body2" sx={{ lineHeight: 1.5, fontWeight: 500 }}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      {/* Strengths Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            height: "100%",
            border: "1px solid",
            borderColor: alpha(successColor, 0.3),
            bgcolor: isDarkMode ? alpha(successColor, 0.05) : alpha(successColor, 0.02), // Subtle tint
            borderTop: `6px solid ${successColor}`, // Thicker accent for more color
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" }, // Interactive feel
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: successColor,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            <CheckCircleOutlineIcon /> {t("dashboard.strengths")}
          </Typography>

          <Box>
            {strengths.map((s, i) => (
              <ListItem key={i} text={s} color={successColor} />
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Gaps Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            height: "100%",
            border: "1px solid",
            borderColor: alpha(errorColor, 0.3),
            bgcolor: isDarkMode ? alpha(errorColor, 0.05) : alpha(errorColor, 0.02), // Subtle tint
            borderTop: `6px solid ${errorColor}`,
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)" },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: errorColor,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            <ErrorOutlineIcon /> {t("dashboard.gaps")}
          </Typography>

          <Box>
            {gaps.map((g, i) => (
              <ListItem key={i} text={g} color={errorColor} />
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
