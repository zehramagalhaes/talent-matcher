import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ReportViewer from "../components/ReportViewer";
import ErrorCard from "../components/ErrorCard";
import { useToast } from "../context/ToastContext";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";

const ReportPage: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToast();
  const [report, setReport] = useState<string>("Generating report...");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetchReportWithModel = async (model?: string) => {
    setLoading(true);
    setError(null);

    const resumeText = localStorage.getItem("resumeText") || "";
    const jobText = localStorage.getItem("jobText") || "";

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText, job: jobText, preferredModel: model }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || "Failed to generate report";
        throw new Error(`[${res.status}] ${errorMsg}`);
      }

      const data = await res.json();
      setReport(data.report || JSON.stringify(data, null, 2));
      setAvailableModels(data.availableModels || []);
      setUsedModel(data.usedModel || model);

      // Show success toast only if this is a retry or model change
      if (model || error) {
        const modelDisplay = data.usedModel || model || "Default";
        addToast(
          `Analysis Complete! (Model: ${modelDisplay}) - Report ready for review`,
          "success"
        );
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Unknown error occurred";
      setError(errorMsg);
      setReport("");
      addToast(`Analysis Failed - ${errorMsg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportWithModel();
  }, []);

  const handleRecover = () => {
    // ✅ Do NOT clear localStorage, just close modal and redirect
    setOpenModal(false);
    addToast("Previous Data Recovered - Ready to edit your submission", "info");
    window.location.href = "/"; // UploadForm will auto-fill from saved values
  };

  const handleNewSubmission = () => {
    // ✅ Clear saved values and redirect to form
    localStorage.removeItem("resumeText");
    localStorage.removeItem("jobText");
    setOpenModal(false);
    addToast("Starting Fresh - All previous data cleared", "info");
    window.location.href = "/";
  };

  return (
    <Layout>
      {loading && <CircularProgress color="primary" />}
      {!loading && !error && <ReportViewer report={report} />}
      {error && (
        <Box sx={{ mt: 3 }}>
          <ErrorCard message={error} />

          {/* Recovery actions */}
          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={() => fetchReportWithModel()}
            >
              Retry Default Model
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => setOpenModal(true)}
            >
              Re-submit Form
            </Button>
          </Box>

          {/* Model selector */}
          {availableModels.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.info.light
                      : theme.palette.error.main,
                }}
              >
                Try another model:
              </Typography>
              <Select
                value={usedModel || ""}
                onChange={(e) => fetchReportWithModel(e.target.value)}
                sx={{
                  mt: 1,
                  minWidth: 220,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              >
                {availableModels.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {/* Modal for resubmission */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Resubmit Form</DialogTitle>
            <DialogContent>
              <Typography>
                Would you like to recover your previously submitted resume and job description, or
                start a new submission?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleRecover} color="primary" variant="contained">
                Recover Previous Data
              </Button>
              <Button onClick={handleNewSubmission} color="secondary" variant="outlined">
                Start New Submission
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Layout>
  );
};

export default ReportPage;
