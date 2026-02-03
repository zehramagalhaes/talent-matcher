import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  FormHelperText,
  Divider,
  Grid,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface UploadFormProps {
  onResumeUpload: (file: File | null) => void;
  onJobDescriptionChange: (value: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onResumeUpload, onJobDescriptionChange }) => {
  const [jobText, setJobText] = useState("");
  const [jobError, setJobError] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumePreview, setResumePreview] = useState<string>("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_FORMATS = [".pdf", ".doc", ".docx", ".txt"];

  const schema = z.object({
    resume: z
      .any()
      .refine((f: any) => f instanceof File, "Resume file is required")
      .refine((f: any) => (f && f.size <= MAX_FILE_SIZE) || !f, "File size exceeds 5MB"),
    jobText: z.string().min(20, "Job description must be at least 20 characters"),
  });

  type FormValues = z.infer<typeof schema>;

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { resume: undefined as any, jobText: "" },
    mode: "onChange",
  });

  const watchedResume = watch("resume");

  useEffect(() => {
    setIsLoading(true);
    const savedJob = localStorage.getItem("jobText");
    if (savedJob) {
      setJobText(savedJob);
      onJobDescriptionChange(savedJob);
      setValue("jobText", savedJob);
    }
    const savedResume = localStorage.getItem("resumeText");
    if (savedResume) {
      setResumePreview(savedResume);
      const blob = new Blob([savedResume], { type: "text/plain" });
      const file = new File([blob], "resume.txt", { type: "text/plain" });
      onResumeUpload(file);
      setValue("resume", file);
    }
    setIsLoading(false);
  }, [onResumeUpload, onJobDescriptionChange, setValue]);

  const handleResumeChange = async (file?: File) => {
    if (!file) {
      handleClearResume();
      return;
    }

    setResumeError("");
    const fileExtension = "." + (file.name.split(".").pop() || "").toLowerCase();

    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      setResumeError(`Invalid format. Accepted: ${ACCEPTED_FORMATS.join(", ")}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError("File size exceeds 5MB");
      return;
    }

    // Extraction logic for preview
    if (file.type === "text/plain" || fileExtension === ".txt") {
      const text = await file.text();
      setResumePreview(text);
    } else {
      // Placeholder for PDF/DOCX until extraction library is added
      setResumePreview(`[Content extracted from ${file.name}]\n\nProcessing text conversion...`);
    }

    onResumeUpload(file);
    setValue("resume", file, { shouldValidate: true });
  };

  const handleJobChange = (value: string) => {
    setJobText(value);
    onJobDescriptionChange(value);
    setValue("jobText", value, { shouldValidate: true });
    if (value.length < 20) {
      setJobError("Job description must be at least 20 characters");
    } else {
      setJobError("");
    }
  };

  const handleClearResume = () => {
    setResumePreview("");
    setResumeError("");
    onResumeUpload(null);
    setValue("resume", undefined as any);
  };

  const handleClearJob = () => {
    setJobText("");
    setJobError("");
    onJobDescriptionChange("");
    setValue("jobText", "");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <form onSubmit={handleSubmit(() => {})} noValidate>
        <Stack spacing={3}>
          {/* Resume Section with Grid2 Side-by-Side */}
          <Grid container spacing={2}>
            <Grid
              size={{ xs: 12, md: resumePreview ? 6 : 12 }}
              sx={{ transition: "all 0.3s ease" }}
            >
              <Card elevation={1} sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DescriptionIcon color="primary" /> Upload Your Resume
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    PDF, DOCX, or TXT (Max 5MB)
                  </Typography>

                  <Box
                    component="label"
                    sx={{
                      border: "2px dashed",
                      borderColor: resumeError ? "error.main" : "primary.main",
                      borderRadius: 2,
                      p: 4,
                      textAlign: "center",
                      backgroundColor: "action.hover",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "action.selected" },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleResumeChange(e.target.files?.[0])}
                    />
                    <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                    <Typography variant="body1" fontWeight={500}>
                      Select Resume
                    </Typography>
                  </Box>

                  {watchedResume && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: "center" }}>
                      <Chip
                        icon={<InsertDriveFileIcon />}
                        label={(watchedResume as File).name}
                        onDelete={handleClearResume}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  )}
                  {resumeError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {resumeError}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* PREVIEW COLUMN */}
            {resumePreview && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  elevation={1}
                  sx={{ height: "100%", backgroundColor: "#fafafa", border: "1px solid #e0e0e0" }}
                >
                  <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <VisibilityIcon fontSize="small" /> Extracted Text Preview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        flexGrow: 1,
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid #eee",
                        maxHeight: "280px",
                        overflowY: "auto",
                        fontSize: "0.8rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        color: "text.primary",
                      }}
                    >
                      {resumePreview}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Job Description Card */}
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
              >
                <WorkIcon color="primary" /> Job Description
              </Typography>
              <TextField
                label="Enter the job description"
                placeholder="Paste requirements here..."
                multiline
                minRows={6}
                fullWidth
                value={jobText}
                onChange={(e) => handleJobChange(e.target.value)}
                error={!!jobError}
                helperText={jobError || `${jobText.length} / 20 characters minimum`}
                variant="outlined"
              />
              {jobText && !jobError && (
                <FormHelperText
                  sx={{
                    color: "success.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  <CheckIcon sx={{ fontSize: "1rem" }} /> Valid description
                </FormHelperText>
              )}
              {jobText && (
                <Box sx={{ mt: 1, textAlign: "right" }}>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleClearJob}
                    color="inherit"
                  >
                    Clear
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      </form>
    </Box>
  );
};

export default UploadForm;
