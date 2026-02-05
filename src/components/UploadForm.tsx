import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  FormHelperText,
  Divider,
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
import mammoth from "mammoth";

// Types for extraction
interface TextItem {
  str: string;
}

interface UploadFormProps {
  onResumeUpload: (file: File | null, text: string) => void;
  onJobDescriptionChange: (value: string) => void;
}

const schema = z.object({
  resume: z
    .instanceof(File, { message: "Resume file is required" })
    .refine((f) => f.size <= 5 * 1024 * 1024, "File size exceeds 5MB"),
  jobText: z.string().min(20, "Job description must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const UploadForm: React.FC<UploadFormProps> = ({ onResumeUpload, onJobDescriptionChange }) => {
  const [jobText, setJobText] = useState<string>("");
  const [jobError, setJobError] = useState<string>("");
  const [resumeError, setResumeError] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [resumePreview, setResumePreview] = useState<string>("");

  const ACCEPTED_FORMATS = [".pdf", ".docx", ".txt"];

  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      resume: undefined as unknown as File,
      jobText: "",
    },
    mode: "onChange",
  });

  const watchedResume = watch("resume");

  const validateJobDescription = (text: string): void => {
    if (!text.trim()) {
      setJobError("Job description is required");
    } else if (text.trim().length < 20) {
      setJobError("Job description must be at least 20 characters long");
    } else {
      setJobError("");
    }
  };

  const handleJobChange = (value: string): void => {
    setJobText(value);
    onJobDescriptionChange(value);
    setValue("jobText", value, { shouldValidate: true });
    validateJobDescription(value);
  };

  const extractText = async (file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    try {
      if (extension === "pdf") {
        // 1. Import the library and worker entry point
        const pdfjs = await import("pdfjs-dist");

        // 2. Point to the local worker provided by the package
        // This avoids the CDN and uses your local node_modules version
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();

          text += content.items.map((item) => (item as TextItem).str).join(" ") + "\n";
        }
        return text;
      }

      if (extension === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }

      return await file.text();
    } catch (_err) {
      console.error("Extraction error", _err);
      throw new Error("Failed to read file content.");
    }
  };

  const handleResumeChange = async (file?: File): Promise<void> => {
    if (!file) {
      handleClearResume();
      return;
    }

    setResumeError("");
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!ACCEPTED_FORMATS.includes(ext)) {
      setResumeError(`Format not supported. Use: ${ACCEPTED_FORMATS.join(", ")}`);
      return;
    }

    try {
      setIsExtracting(true);
      const text = await extractText(file);
      setResumePreview(text);
      onResumeUpload(file, text);
      setValue("resume", file, { shouldValidate: true });
    } catch (_err) {
      console.error("File read error:", _err);
      setResumeError("Error reading file content.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClearResume = (): void => {
    setResumePreview("");
    setResumeError("");
    onResumeUpload(null, "");
    setValue("resume", null as unknown as File, { shouldValidate: true });
  };

  const handleClearJob = (): void => {
    setJobText("");
    setJobError("");
    onJobDescriptionChange("");
    setValue("jobText", "");
  };

  const isFileUploaded = watchedResume instanceof File && !isExtracting;

  return (
    <Box sx={{ mt: 1 }}>
      <form onSubmit={handleSubmit(() => {})} noValidate>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            {/* Upload Section */}
            {!isFileUploaded && (
              <Grid
                size={{ xs: 12, md: resumePreview ? 4 : 12 }}
                sx={{ transition: "all 0.4s ease" }}
              >
                <Card elevation={1} sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <DescriptionIcon color="primary" /> Upload Resume
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
                        cursor: isExtracting ? "not-allowed" : "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "action.selected" },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.docx,.txt"
                        disabled={isExtracting}
                        onChange={(e) => handleResumeChange(e.target.files?.[0])}
                      />
                      {isExtracting ? (
                        <CircularProgress size={48} sx={{ mb: 1 }} />
                      ) : (
                        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                      )}
                      <Typography variant="body1" fontWeight={500}>
                        {isExtracting ? "Processing File..." : "Click to upload"}
                      </Typography>
                    </Box>
                    {resumeError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {resumeError}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Preview Section */}
            {resumePreview && (
              <Grid size={{ xs: 12 }} sx={{ transition: "all 0.4s ease" }}>
                <Card
                  elevation={1}
                  sx={{
                    height: "100%",
                    borderColor: "divider",
                  }}
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
                      <VisibilityIcon fontSize="small" /> Content Preview
                    </Typography>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <DescriptionIcon color="primary" /> Uploaded Resume
                      </Typography>
                      <Chip
                        icon={<InsertDriveFileIcon />}
                        label={watchedResume.name}
                        onDelete={handleClearResume}
                        sx={{ my: 2 }}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Box
                      sx={{
                        flexGrow: 1,
                        bgcolor: "background.paper",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        maxHeight: "250px",
                        overflowY: "auto",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {resumePreview}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Job Description Section */}
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
              >
                <WorkIcon color="primary" /> Job Description
              </Typography>
              <TextField
                placeholder="Paste the requirements here..."
                multiline
                minRows={6}
                fullWidth
                value={jobText}
                onChange={(e) => handleJobChange(e.target.value)}
                error={!!jobError}
                helperText={jobError || `${jobText.length} / 20 characters minimum`}
                variant="outlined"
              />
              {jobText.trim().length >= 20 && !jobError && (
                <FormHelperText
                  sx={{
                    mt: 1,
                    color: "success.main",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
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
