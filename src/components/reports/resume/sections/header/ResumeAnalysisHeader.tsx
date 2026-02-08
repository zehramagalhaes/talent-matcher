import React from "react";
import { Stack, Box, Typography, Button, Paper, useTheme, alpha } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTranslation } from "@/hooks/useTranslation";
import { StrategySwitcher } from "./StrategySwitcher";

import { ResumeData } from "@/api/analyze/schema";

export interface ResumeAnalysisHeaderProps {
  strategy: "compact" | "detailed";
  setStrategy: (val: "compact" | "detailed") => void;
  isPreviewMode: boolean;
  onDownload: () => void;
  onReset: () => void;
  compactData: ResumeData;
  detailedData: ResumeData;
}

export const ResumeAnalysisHeader: React.FC<ResumeAnalysisHeaderProps> = ({
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

  return (
    <Box sx={{ mb: 6, width: "100%" }}>
      {/* 1. TITLE SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: "-0.05em", mb: 1 }}>
          {t("dashboard.header.preview")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "800px", fontWeight: 500 }}
        >
          {t("dashboard.header.description")}
        </Typography>
      </Box>

      {/* 2. CONTROLS BAR */}
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
        <StrategySwitcher
          value={strategy}
          onChange={setStrategy}
          compactData={compactData}
          detailedData={detailedData}
          disabled={isPreviewMode}
        />

        <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button
            startIcon={<RestartAltIcon />}
            variant="outlined"
            onClick={onReset}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: alpha(theme.palette.error.main, 0.04),
                borderColor: "error.main",
              },
              transition: "all 0.3s ease",
            }}
          >
            {t("common.discardChanges")}
          </Button>

          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            onClick={onDownload}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: "14px",
              fontWeight: 900,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 10px 25px -6px ${alpha(theme.palette.primary.main, 0.5)}`,
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            {t("common.download")}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
