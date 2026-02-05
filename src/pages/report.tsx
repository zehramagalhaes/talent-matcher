import { useCallback, useEffect, useState } from "react";
import MainLayout from "@/components/reusables/Layout";
import OptimizationDashboard from "@/components/OptimizationDashboard";
import ErrorCard from "@/components/reusables/ErrorCard";
import { useToast } from "@/context/ToastContext";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { analyzeApi } from "@/api/analyze/analyzeApi";
import { DEFAULT_GEMINI_MODEL } from "@/constants";
import { useRouter } from "next/router";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";

const ReportPage: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();

  // State typed specifically for the Zod-inferred object
  const [report, setReport] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const usedModel = DEFAULT_GEMINI_MODEL;

  const fetchReportWithModel = useCallback(
    async (model?: string) => {
      setLoading(true);
      setError(null);

      const savedAnalysis = localStorage.getItem("analysisResult");

      if (savedAnalysis && !model) {
        // If no specific model change requested, use cached
        try {
          const parsed = JSON.parse(savedAnalysis);
          setReport(parsed);
          setLoading(false);
          return; // Exit early, we have the data!
        } catch (e) {
          localStorage.removeItem("analysisResult"); // Corrupt data
          throw e; // Will be caught by outer catch
        }
      }

      // 2. Fallback: If no cached report, check for raw text to generate a new one
      const resumeText = localStorage.getItem("resumeText");
      const jobText = localStorage.getItem("jobText");

      if (!resumeText || !jobText) {
        setError("Missing resume or job description. Please go back and upload your data.");
        setLoading(false);
        return;
      }

      try {
        const response = await analyzeApi(resumeText, jobText, model);
        if (response.success && response.report) {
          setReport(response.report);
          localStorage.setItem("analysisResult", JSON.stringify(response.report));
          addToast("Report generated successfully!", "success", 3000);
        } else {
          throw new Error(response.error || "Failed to generate report");
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        addToast(
          `[${(err as Error)?.name || "Unknown Error"}] Failed to generate report: ${errorMsg}`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    fetchReportWithModel();
  }, [fetchReportWithModel]);

  // FIX: Redirects to home where UploadForm will see the existing localStorage
  const handleRecover = () => {
    setOpenModal(false);
    addToast("Data recovered. You can now edit your submission.", "info");
    router.push("/");
  };

  // FIX: Clears the storage and redirects to home for a clean slate
  const handleNewSubmission = () => {
    localStorage.removeItem("resumeText");
    localStorage.removeItem("jobText");
    // If you store the actual file name/state, clear those too
    localStorage.removeItem("resumeName");

    setOpenModal(false);
    addToast("Storage cleared. Starting a new analysis.", "info");
    router.push("/");
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
        {loading ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10, gap: 3 }}
          >
            <CircularProgress size={60} thickness={4} />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                Analyzing with {usedModel}
              </Typography>
              <Typography color="textSecondary">
                This usually takes about 10-15 seconds...
              </Typography>
            </Box>
          </Box>
        ) : error ? (
          <Box sx={{ mt: 3, maxWidth: 600, mx: "auto" }}>
            <ErrorCard message={error} />
            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => fetchReportWithModel()}
              >
                Retry Analysis
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenModal(true)}
              >
                Go Back / Edit
              </Button>
            </Box>
          </Box>
        ) : (
          report && (
            <>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push("/")}
                  sx={{ fontWeight: "bold" }}
                >
                  Edit Input
                </Button>
                <Typography variant="caption" color="textSecondary">
                  Model: {usedModel}
                </Typography>
              </Box>

              <OptimizationDashboard data={report} />
            </>
          )
        )}
      </Container>

      {/* Resubmission Strategy Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Update Submission</DialogTitle>
        <DialogContent>
          <Typography color="textSecondary">
            Would you like to keep your current text and just make a few edits, or start completely
            fresh with new files?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleNewSubmission} color="inherit" variant="text">
            Start Fresh
          </Button>
          <Button
            onClick={handleRecover}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Edit Current Data
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ReportPage;
