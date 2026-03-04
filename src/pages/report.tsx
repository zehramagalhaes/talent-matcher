import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Typography, Container, Stack, alpha, useTheme, Fade } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBack from "@mui/icons-material/ArrowBack";

import MainLayout from "@/components/common/Layout";
import { useReport } from "@/hooks/useReport";
import { ReportLoadingState } from "@/components/loadings/ReportLoadingState";
import ErrorCard from "@/components/common/ErrorCard";
import { ResumeAnalysisReport } from "@/components/reports/resume/ResumeAnalysis";
import { ReportActionModal } from "@/components/modals/ReportActionModal";
import ReportSkeleton from "@/components/loadings/ReportSkeletonLoading";
import { NoReportState } from "@/components/feedbacks/NoReportState";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import { DEFAULT_GEMINI_MODEL } from "@/constants";

function ReportContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);

  // --- Dynamic Model State ---
  const [activeModel, setActiveModel] = useState<string>(DEFAULT_GEMINI_MODEL);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedModel = localStorage.getItem("selectedModel");
    if (savedModel) {
      setActiveModel(savedModel);
    }
  }, []);

  const { report, isLoading, error, generateReport } = useReport(true);

  const renderMainContent = () => {
    // Pass the activeModel to the loading state for accurate feedback
    if (isLoading) return <ReportLoadingState model={activeModel} />;

    if (error)
      return (
        <Box sx={{ mt: 3, maxWidth: 600, mx: "auto" }}>
          <ErrorCard message={error} />
          <Button
            fullWidth
            variant="contained"
            startIcon={<RefreshIcon />}
            // Ensure retry uses the active model
            onClick={() => generateReport(undefined, undefined, activeModel)}
            sx={{ mt: 2, borderRadius: 3, fontWeight: 900 }}
          >
            {t("common.retry")}
          </Button>
        </Box>
      );

    if (!report) return <NoReportState onRedirect={() => router.push("/")} />;
    return <ResumeAnalysisReport data={report} />;
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
        <Fade in={true}>
          <Box>
            {/* Action Header */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Button
                startIcon={<ArrowBack />}
                onClick={() => setOpenModal(true)}
                variant="outlined"
                sx={{ fontWeight: 800, borderRadius: 3, textTransform: "none" }}
              >
                {t("common.edit")}
              </Button>

              {/* Dynamic Model Badge */}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  px: 2,
                  py: 0.8,
                  borderRadius: 2,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                {t("report.model_label")?.replace("{model}", activeModel)}
              </Typography>
            </Stack>

            {renderMainContent()}
          </Box>
        </Fade>

        <ReportActionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onRecover={() => router.push("/?edit=true")}
          onFresh={() => {
            // Be careful with localStorage.clear() as it removes the API selection too
            // Perhaps only remove the form data instead:
            localStorage.removeItem("analysisResult");
            localStorage.removeItem("resumeText");
            localStorage.removeItem("jobText");
            localStorage.removeItem("selectedModel");
            router.push("/");
          }}
        />
      </Container>
    </MainLayout>
  );
}

const ReportPage = dynamic(() => Promise.resolve(ReportContent), {
  ssr: false,
  loading: () => (
    <MainLayout>
      <ReportSkeleton />
    </MainLayout>
  ),
});

export default ReportPage;
