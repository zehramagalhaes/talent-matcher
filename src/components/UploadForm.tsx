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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from "@mui/icons-material/Check";
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

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_FORMATS = [".pdf", ".doc", ".docx", ".txt"];

  // Zod schema for form validation
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
    defaultValues: { resume: undefined as unknown as File | undefined, jobText: "" },
    mode: "onChange",
  });

  const watchedResume = watch("resume");

  // ✅ Load saved values on mount
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
      const blob = new Blob([savedResume], { type: "text/plain" });
      const file = new File([blob], "resume.txt", { type: "text/plain" });
      onResumeUpload(file);
      setValue("resume", file as unknown as File);
    }
    setIsLoading(false);
  }, [onResumeUpload, onJobDescriptionChange, setValue]);

  const validateResumeFile = (file: File): boolean => {
    setResumeError("");

    if (file.size > MAX_FILE_SIZE) {
      setResumeError(
        `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      );
      return false;
    }

    const fileExtension = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      setResumeError(`Invalid file format. Accepted formats: ${ACCEPTED_FORMATS.join(", ")}`);
      return false;
    }

    return true;
  };

  const validateJobDescription = (text: string): boolean => {
    setJobError("");
    if (!text.trim()) {
      setJobError("Job description is required");
      return false;
    }
    if (text.trim().length < 20) {
      setJobError("Job description must be at least 20 characters long");
      return false;
    }
    return true;
  };

  const handleResumeChange = (file?: File) => {
    if (!file) {
      onResumeUpload(null);
      setValue("resume", undefined as unknown as File);
      return;
    }

    if (validateResumeFile(file)) {
      onResumeUpload(file);
      setValue("resume", file as unknown as File, { shouldValidate: true });
    } else {
      onResumeUpload(null);
      setValue("resume", undefined as unknown as File);
    }
  };

  const handleJobChange = (value: string) => {
    setJobText(value);
    onJobDescriptionChange(value);
    setValue("jobText", value, { shouldValidate: true });
    validateJobDescription(value);
  };

  const handleClearResume = () => {
    setResumeError("");
    onResumeUpload(null);
    setValue("resume", undefined as unknown as File);
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
        <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Resume Upload Section */}
          <Card elevation={1}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                <DescriptionIcon sx={{ color: "primary.main" }} />
                Upload Your Resume
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 2.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
              </Typography>

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: resumeError ? "error.main" : "primary.main",
                  borderRadius: 2,
                  p: { xs: 2.5, sm: 3, md: 4 },
                  textAlign: "center",
                  backgroundColor: resumeError ? "error.50" : "action.hover",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  minHeight: { xs: "140px", sm: "160px", md: "180px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: resumeError ? "error.50" : "action.selected",
                    borderColor: resumeError ? "error.main" : "primary.dark",
                  },
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) =>
                    handleResumeChange(e.target.files ? e.target.files[0] : undefined)
                  }
                />
                <CloudUploadIcon
                  sx={{
                    fontSize: { xs: 40, sm: 48, md: 56 },
                    color: resumeError ? "error.main" : "primary.main",
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{ mb: 0.5, fontWeight: 500, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  Click to upload or drag and drop
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                >
                  Select your resume file
                </Typography>
              </Box>

              {resumeError && (
                <Alert severity="error" sx={{ mt: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  {resumeError}
                </Alert>
              )}

              {watchedResume && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, alignItems: "center", flexWrap: "wrap", gap: 1 }}
                >
                  <Chip
                    icon={<InsertDriveFileIcon />}
                    label={(watchedResume as unknown as File).name}
                    onDelete={() => handleClearResume()}
                    deleteIcon={<DeleteIcon />}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ maxWidth: "calc(100% - 80px)", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ whiteSpace: "nowrap", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                  >
                    {((watchedResume as unknown as File).size / 1024).toFixed(2)} KB
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Job Description Section */}
          <Card elevation={1}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                <WorkIcon sx={{ color: "primary.main" }} />
                Job Description
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Paste the complete job description below
              </Typography>

              <TextField
                label="Enter the job description"
                placeholder="Paste the complete job description here..."
                multiline
                minRows={6}
                maxRows={10}
                fullWidth
                value={jobText}
                onChange={(e) => handleJobChange(e.target.value)}
                error={!!jobError}
                helperText={jobError || `${jobText.length} / 20 characters minimum`}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  },
                }}
              />
              {jobText && !jobError && (
                <FormHelperText
                  sx={{
                    mt: 1,
                    color: "success.main",
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CheckIcon sx={{ fontSize: "1rem" }} />
                  Job description looks good
                </FormHelperText>
              )}
              {jobText && (
                <Box sx={{ mt: 1.5, textAlign: "right" }}>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleClearJob}
                    variant="text"
                    color="inherit"
                    sx={{ textTransform: "uppercase", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
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
