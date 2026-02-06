import React from "react";
import {
  Stack,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ResumeData } from "@/api/schemas/optimizationSchema";

interface HeaderProps {
  strategy: "compact" | "detailed";
  setStrategy: (val: "compact" | "detailed") => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  onDownload: () => void;
  compactData: ResumeData;
  detailedData: ResumeData;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  strategy,
  setStrategy,
  isPreviewMode,
  setIsPreviewMode,
  onDownload,
  compactData,
  detailedData,
}) => {
  const theme = useTheme();

  // FIX: Define the helper inside the component scope
  const getBulletCount = (res: ResumeData) =>
    res.experience.reduce(
      (acc, exp) => acc + exp.bullets_primary.length + (exp.bullets_optional?.length || 0),
      0
    );

  return (
    <Box sx={{ mb: 6, width: "100%" }}>
      {/* BRANDING SECTION: Improved Readability */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="900"
          sx={{
            letterSpacing: "-0.04em",
            mb: 1,
            fontSize: { xs: "2.25rem", md: "3rem" },
            color: "text.primary",
            lineHeight: 1.1,
          }}
        >
          Analysis Results
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: "700px",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          Review and compare your tailored resume versions. Choose the <strong>Compact</strong>{" "}
          layout for a high-impact overview or the <strong>Detailed</strong> layout for a
          comprehensive career history.
        </Typography>
      </Box>

      {/* CONTROLS BAR: Hierarchy and Responsiveness */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup
            value={strategy}
            exclusive
            onChange={(_, v) => v && setStrategy(v)}
            size="medium"
            disabled={isPreviewMode}
            sx={{ bgcolor: theme.palette.mode === "dark" ? "action.hover" : "white" }}
          >
            <ToggleButton
              value="compact"
              sx={{ px: { xs: 2, sm: 4 }, textTransform: "none", fontWeight: 700 }}
            >
              Compact{" "}
              <Chip label={getBulletCount(compactData)} size="small" sx={{ ml: 1, height: 20 }} />
            </ToggleButton>
            <ToggleButton
              value="detailed"
              sx={{ px: { xs: 2, sm: 4 }, textTransform: "none", fontWeight: 700 }}
            >
              Detailed{" "}
              <Chip label={getBulletCount(detailedData)} size="small" sx={{ ml: 1, height: 20 }} />
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

          <FormControlLabel
            control={
              <Switch
                checked={isPreviewMode}
                onChange={(e) => setIsPreviewMode(e.target.checked)}
                color="secondary"
              />
            }
            label={
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Compare
              </Typography>
            }
            labelPlacement="start"
            sx={{ m: 0 }}
          />
        </Stack>

        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={onDownload}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            boxShadow:
              theme.palette.mode === "light" ? "0 4px 14px 0 rgba(0,118,255,0.39)" : "none",
          }}
        >
          Download PDF
        </Button>
      </Paper>
    </Box>
  );
};
