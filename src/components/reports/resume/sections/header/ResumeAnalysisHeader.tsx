import React, { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import DocxIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "@/hooks/useTranslation";
import { StrategySwitcher } from "./StrategySwitcher";
import { ResumeData } from "@/api/analyze/schema";

export interface ResumeAnalysisHeaderProps {
  strategy: "compact" | "detailed";
  setStrategy: (val: "compact" | "detailed") => void;
  isPreviewMode: boolean;
  onDownload: (format: "pdf" | "docx") => void;
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleFormatSelect = (format: "pdf" | "docx") => {
    onDownload(format);
    handleCloseMenu();
  };

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

          {/* DOWNLOAD DROPDOWN BUTTON */}
          <Button
            id="download-split-button"
            aria-controls={open ? "download-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            onClick={handleOpenMenu}
            startIcon={<DownloadIcon />}
            endIcon={<ExpandMoreIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "14px",
              fontWeight: 900,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 10px 25px -6px ${alpha(theme.palette.primary.main, 0.5)}`,
              "&:hover": { transform: "translateY(-2px)" },
              transition: "transform 0.2s ease",
            }}
          >
            {t("common.download")}
          </Button>

          <Menu
            id="download-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  minWidth: 180,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  border: `1px solid ${theme.palette.divider}`,
                },
              },
            }}
          >
            <MenuItem onClick={() => handleFormatSelect("pdf")} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PdfIcon fontSize="small" sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText
                primary="PDF Document"
                slotProps={{ primary: { sx: { fontWeight: 600, fontSize: "0.9rem" } } }}
              />
            </MenuItem>
            <MenuItem onClick={() => handleFormatSelect("docx")} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <DocxIcon fontSize="small" sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText
                primary="Word Document"
                slotProps={{ primary: { sx: { fontWeight: 600, fontSize: "0.9rem" } } }}
              />
            </MenuItem>
          </Menu>
        </Stack>
      </Paper>
    </Box>
  );
};
