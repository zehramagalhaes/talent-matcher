import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/router";
import { extractTextFromFile } from "@/utils/fileUtils";

// Helper for clean state initialization
const getInitialState = (key: string, isEditMode: boolean) => {
  if (typeof window !== "undefined" && isEditMode) {
    return localStorage.getItem(key) || "";
  }
  return "";
};

interface UploadFormProps {
  onResumeUpload: (file: File | null, text: string) => void;
  onJobDescriptionChange: (value: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResumeUpload, onJobDescriptionChange }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const router = useRouter();

  const isEditMode = router.query.edit === "true";

  const [resumeName, setResumeName] = useState(() => getInitialState("resumeName", isEditMode));
  const [preview, setPreview] = useState(() => getInitialState("resumeText", isEditMode));
  const [jobText, setJobText] = useState(() => getInitialState("jobText", isEditMode));
  const [isExtracting, setIsExtracting] = useState(false);

  const recoveryRef = useRef({ onResumeUpload, onJobDescriptionChange, preview, jobText });

  // Update the ref values on every render so the effect always has the "latest"
  useEffect(() => {
    recoveryRef.current = { onResumeUpload, onJobDescriptionChange, preview, jobText };
  });

  // Notify parent component of recovered data on mount/mode change
  useEffect(() => {
    if (isEditMode) {
      const { onResumeUpload, onJobDescriptionChange, preview, jobText } = recoveryRef.current;
      if (preview) onResumeUpload(null, preview);
      if (jobText) onJobDescriptionChange(jobText);
    }
  }, [isEditMode]); // Only re-run if the edit mode itself changes

  const handleResumeChange = async (file: File) => {
    if (!file) return;

    try {
      setIsExtracting(true);
      const text = await extractTextFromFile(file);

      setPreview(text);
      setResumeName(file.name);

      localStorage.setItem("resumeText", text);
      localStorage.setItem("resumeName", file.name);

      onResumeUpload(file, text);
      addToast(t("form.upload.success"), "success");
    } catch (error) {
      addToast(t("form.resume.error.read"), "error");
      throw error; // Re-throw for potential higher-level handling/logging
    } finally {
      setIsExtracting(false);
    }
  };

  const handleJobChange = (val: string) => {
    setJobText(val);
    localStorage.setItem("jobText", val);
    onJobDescriptionChange(val);
  };

  const handleClearResume = () => {
    setResumeName("");
    setPreview("");
    localStorage.removeItem("resumeName");
    localStorage.removeItem("resumeText");
    onResumeUpload(null, "");
  };

  return (
    <Stack spacing={3}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 800, display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <DescriptionIcon color="primary" /> {t("form.resume.label")}
          </Typography>

          {!resumeName ? (
            <Box
              component="label"
              sx={{
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: 3,
                p: 5,
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "0.2s",
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
              }}
            >
              <input
                type="file"
                hidden
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleResumeChange(e.target.files[0])}
              />
              {isExtracting ? (
                <CircularProgress size={40} />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              )}
              <Typography variant="body1" fontWeight={700}>
                {isExtracting ? t("form.resume.processing") : t("form.resume.click_to_upload")}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Chip
                  label={resumeName}
                  onDelete={handleClearResume}
                  color="primary"
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  <VisibilityIcon fontSize="inherit" /> {t("form.resume.preview")}
                </Typography>
              </Stack>
              <Box
                sx={{
                  bgcolor: alpha(theme.palette.common.black, 0.03),
                  p: 2,
                  borderRadius: 2,
                  maxHeight: 150,
                  overflowY: "auto",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                }}
              >
                {preview}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 800, display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <WorkIcon color="primary" /> {t("form.job.label")}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder={t("form.job.placeholder")}
            value={jobText}
            onChange={(e) => handleJobChange(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
              },
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UploadForm;
