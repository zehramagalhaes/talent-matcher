import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import Layout from "../components/Layout";
import UploadForm from "../components/UploadForm";
import { useRouter } from "next/router";
import useGenerateReport from "../hooks/useGenerateReport";
import { useToast } from "../context/ToastContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import InfoIcon from "@mui/icons-material/Info";

const Home: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const { generateReport, isLoading: isSubmitting } = useGenerateReport();
  const router = useRouter();
  const { addToast } = useToast();

  const isFormValid = !!resume && jobDescription.trim().length >= 20;

  const handleSubmit = async () => {
    // Delegate to hook which handles saving and basic checks
    if (!resume) {
      addToast("Resume Required - Please upload a resume file to proceed.", "error");
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      addToast("Job Description Too Short - Please enter at least 20 characters.", "error");
      return;
    }

    try {
      const result = await generateReport(resume, jobDescription);

      if (result.success) {
        addToast(
          `Form Submitted Successfully! (${result.details?.resumeName} | ${result.details?.jobLength} chars) Generating analysis...`,
          "success",
          3000
        );
        setTimeout(() => {
          router.push("/report");
        }, 500);
      } else {
        addToast(`Failed to Process Resume - ${result.error || "Unknown error"}`, "error");
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Unknown error");
      const errorMsg = errorObj.message;
      addToast(`Failed to Process Resume - ${errorMsg}`, "error");
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, display: "flex", alignItems: "center", gap: 1.5 }}>
        <TipsAndUpdatesIcon
          sx={{ fontSize: { xs: "2rem", sm: "2.25rem", md: "2.5rem" }, color: "primary.main" }}
        />
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 0, fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
        >
          TalentMatcher
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Analyze how well your resume matches the job description
        </Typography>
      </Box>

      <UploadForm onResumeUpload={setResume} onJobDescriptionChange={setJobDescription} />

      {/* Form Status Section */}
      <Card
        elevation={0}
        sx={{
          mt: { xs: 2.5, sm: 3, md: 4 },
          mb: { xs: 2, sm: 2.5, md: 3 },
          backgroundColor: isFormValid ? "success.50" : "info.50",
          border: "1px solid",
          borderColor: isFormValid ? "success.200" : "info.200",
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textTransform: "uppercase",
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                  letterSpacing: "0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: "1rem" }} />
                Form Status
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CheckCircleIcon
                    sx={{
                      color: resume ? "success.main" : "action.disabled",
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" } }}
                  >
                    Resume: {resume ? resume.name : "Pending"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CheckCircleIcon
                    sx={{
                      color:
                        jobDescription.trim().length >= 20 ? "success.main" : "action.disabled",
                      fontSize: { xs: 16, sm: 18, md: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" } }}
                  >
                    Job: {jobDescription.trim().length >= 20 ? "Complete" : "Incomplete"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {!isFormValid && (
        <Alert
          severity="info"
          sx={{
            mb: 2.5,
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "0.95rem" },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          icon={<InfoIcon />}
        >
          Please complete all fields above to generate your report.
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          justifyContent: { xs: "center", sm: "flex-end" },
          mt: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          endIcon={
            isSubmitting ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />
          }
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.25, md: 1.5 },
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            fontWeight: 600,
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            width: { xs: "100%", sm: "auto" },
            "&:hover:not(:disabled)": {
              transform: "translateX(4px)",
            },
          }}
        >
          {isSubmitting ? "Generating..." : "Generate Report"}
        </Button>
      </Box>
    </Layout>
  );
};

export default Home;
