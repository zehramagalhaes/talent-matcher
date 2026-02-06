import { useCallback, useEffect, useState, useRef, useTransition } from "react";
import dynamic from "next/dynamic";
import MainLayout from "@/components/reusables/Layout";
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
  alpha,
  useTheme,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import { analyzeApi } from "@/api/analyze/analyzeApi";
import { DEFAULT_GEMINI_MODEL } from "@/constants";
import { useRouter } from "next/router";
import { useTranslation } from "@/hooks/useTranslation";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";
import { OptimizationDashboard } from "@/components/dashboard/OptimizationDashboard";
import ReportSkeleton from "@/components/loadings/ReportSkeletonLoading";

const ReportContent: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [report, setReport] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isInitialMount = useRef(true);
  const [isPending, startTransition] = useTransition();
  const usedModel = DEFAULT_GEMINI_MODEL;

  const fetchReportWithModel = useCallback(
    async (model?: string) => {
      setLoading(true);
      setError(null);

      const savedAnalysis = localStorage.getItem("analysisResult");

      if (savedAnalysis && !model) {
        try {
          const parsed = JSON.parse(savedAnalysis);
          startTransition(() => {
            setReport(parsed);
            setLoading(false);
          });
          return;
        } catch (e) {
          localStorage.removeItem("analysisResult");
          addToast(t("report.error.cache_failed"), "warning");
          throw new Error(e instanceof Error ? e.message : t("report.error.cache_failed"));
        }
      }

      const resumeText = localStorage.getItem("resumeText");
      const jobText = localStorage.getItem("jobText");

      if (!resumeText || !jobText) {
        startTransition(() => {
          setError(t("report.error.missing_data"));
          setLoading(false);
        });
        return;
      }

      try {
        const response = await analyzeApi(resumeText, jobText, model);
        startTransition(() => {
          if (response.success && response.report) {
            setReport(response.report);
            localStorage.setItem("analysisResult", JSON.stringify(response.report));
            addToast(t("toast.generated_success"), "success", 3000);
          } else {
            throw new Error(response.error || t("report.error.gen_failed"));
          }
        });
      } catch (err: unknown) {
        startTransition(() => {
          const errorMsg = err instanceof Error ? err.message : String(err);
          setError(errorMsg);
          addToast(t("report.error.prefix").replace("{message}", errorMsg), "error");
        });
      } finally {
        startTransition(() => {
          setLoading(false);
        });
      }
    },
    [addToast, t]
  );

  useEffect(() => {
    if (isInitialMount.current && router.isReady) {
      isInitialMount.current = false;
      fetchReportWithModel();
    }
  }, [fetchReportWithModel, router.isReady]);

  const handleRecover = async () => {
    setOpenModal(false);
    localStorage.removeItem("analysisResult");
    addToast(t("toast.data_recovered"), "info");
    setTimeout(() => {
      router.push("/?edit=true");
    }, 150);
  };

  const handleNewSubmission = () => {
    localStorage.removeItem("analysisResult");
    localStorage.removeItem("resumeText");
    localStorage.removeItem("jobText");
    localStorage.removeItem("resumeName");
    setOpenModal(false);
    addToast(t("toast.starting_fresh"), "info");
    router.replace("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
      {loading || isPending ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10, gap: 3 }}
        >
          <CircularProgress size={60} thickness={4} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {t("loading.analyzing_with")?.replace("{model}", usedModel)}
            </Typography>
            <Typography color="textSecondary">{t("loading.wait_message")}</Typography>
          </Box>
        </Box>
      ) : error ? (
        <Box sx={{ mt: 3, maxWidth: 600, mx: "auto" }}>
          <ErrorCard message={error} />
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => fetchReportWithModel()}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
            >
              {t("common.retry")}
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setOpenModal(true)}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
            >
              {t("common.edit")}
            </Button>
          </Stack>
        </Box>
      ) : (
        report && (
          <>
            <Box
              sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Button
                startIcon={<EditIcon />}
                onClick={() => setOpenModal(true)}
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  px: 3,
                  textTransform: "none",
                }}
              >
                {t("common.edit")}
              </Button>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  bgcolor: alpha(theme.palette.divider, 0.1),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {t("report.model_label")?.replace("{model}", usedModel)}
              </Typography>
            </Box>
            <OptimizationDashboard data={report} />
          </>
        )
      )}

      {/* MODAL (Always Client-Side) */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        slotProps={{ paper: { sx: { borderRadius: 5, p: 2, backgroundImage: "none" } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>
          {t("modal.update_submission.title")}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
            {t("modal.update_submission.description")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleNewSubmission}
            color="inherit"
            sx={{ fontWeight: 800, textTransform: "none" }}
          >
            {t("common.start_fresh")}
          </Button>
          <Button
            onClick={handleRecover}
            variant="contained"
            sx={{ borderRadius: 3, fontWeight: 900, px: 4, textTransform: "none" }}
          >
            {t("common.edit_current")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// --- FINAL EXPORT WITH NO SSR ---
const ReportPage = dynamic(() => Promise.resolve(ReportContent), {
  ssr: false,
  loading: () => (
    <MainLayout>
      <ReportSkeleton />
    </MainLayout>
  ),
});

export default ReportPage;
