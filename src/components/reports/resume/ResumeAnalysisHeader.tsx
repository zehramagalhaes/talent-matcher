import React from "react";
import {
  Stack,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Chip,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { ResumeData } from "@/api/analyze/schema";
import { useTranslation } from "@/hooks/useTranslation";

interface HeaderProps {
  strategy: "compact" | "detailed";
  setStrategy: (val: "compact" | "detailed") => void;
  isPreviewMode: boolean;
  onDownload: () => void;
  onReset: () => void;
  compactData: ResumeData;
  detailedData: ResumeData;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  strategy,
  setStrategy,
  isPreviewMode,
  onDownload,
  onReset,
  compactData,
  detailedData,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getBulletCount = (res: ResumeData) => {
    if (!res || !res.experience) return 0;

    return res.experience.reduce(
      (acc, exp) => acc + (exp.bullets_primary?.length || 0) + (exp.bullets_optional?.length || 0),
      0
    );
  };

  return (
    <Box sx={{ mb: 6, width: "100%" }}>
      {/* BRANDING SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="900"
          sx={{
            letterSpacing: "-0.05em",
            mb: 1,
            fontSize: { xs: "2.25rem", md: "3rem" },
            color: "text.primary",
            lineHeight: 1.1,
          }}
        >
          {t("dashboard.header.preview")}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: "800px",
            fontSize: "1.1rem",
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          {t("dashboard.header.description")}
        </Typography>
      </Box>

      {/* CONTROLS BAR */}
      <Paper
        elevation={0}
        sx={{
          p: 1.2,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: "blur(20px)",
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          sx={{ width: { xs: "100%", lg: "auto" } }}
        >
          {/* Strategy Switcher */}
          <ToggleButtonGroup
            value={strategy}
            exclusive
            onChange={(_, v) => v && setStrategy(v)}
            disabled={isPreviewMode}
            sx={{
              bgcolor: alpha(theme.palette.action.disabledBackground, 0.05),
              p: 0.5,
              borderRadius: 3.5,
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: 3,
                fontWeight: 800,
                px: { xs: 2, sm: 4 },
                py: 1,
                textTransform: "none",
                fontSize: "0.875rem",
                color: theme.palette.text.secondary,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.Mui-selected": {
                  bgcolor: theme.palette.background.paper,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.08)}`,
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: theme.palette.background.paper,
                  },
                },
              },
            }}
          >
            <ToggleButton value="compact">
              {t("dashboard.header.strategy.compact")}
              <Chip
                label={getBulletCount(compactData)}
                size="small"
                sx={{
                  ml: 1.5,
                  height: 20,
                  fontWeight: 900,
                  fontSize: "0.7rem",
                  bgcolor:
                    strategy === "compact" ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                  color: strategy === "compact" ? "primary.main" : "inherit",
                  border:
                    strategy === "compact"
                      ? "none"
                      : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                }}
              />
            </ToggleButton>
            <ToggleButton value="detailed">
              {t("dashboard.header.strategy.detailed")}
              <Chip
                label={getBulletCount(detailedData)}
                size="small"
                sx={{
                  ml: 1.5,
                  height: 20,
                  fontWeight: 900,
                  fontSize: "0.7rem",
                  bgcolor:
                    strategy === "detailed"
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                  color: strategy === "detailed" ? "primary.main" : "inherit",
                  border:
                    strategy === "detailed"
                      ? "none"
                      : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                }}
              />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
          {/* Reset Button */}
          <Button
            startIcon={<RestartAltIcon />}
            variant="outlined"
            onClick={onReset}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              borderColor: alpha(theme.palette.divider, 0.2),
              color: "text.secondary",
              "&:hover": {
                borderColor: theme.palette.error.light,
                color: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.main, 0.04),
              },
            }}
          >
            {t("common.discardChanges")}
          </Button>

          {/* Download Button */}
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            onClick={onDownload}
            sx={{
              flex: { xs: 1, sm: "none" },
              px: 5,
              py: 1.5,
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "0.95rem",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 10px 25px -6px ${alpha(theme.palette.primary.main, 0.5)}`,
              "&:hover": {
                transform: "translateY(-2px)",
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 15px 30px -5px ${alpha(theme.palette.primary.main, 0.6)}`,
              },
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {t("common.download")}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
