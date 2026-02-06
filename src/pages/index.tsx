import React, { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Divider,
  alpha,
  useTheme,
  Fade,
  Alert,
} from "@mui/material";
import MainLayout from "@/components/reusables/Layout";
import UploadForm from "@/components/UploadForm";
import { useRouter } from "next/router";
import useGenerateReport from "@/hooks/useGenerateReport";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/reusables/LanguageToggle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryIcon from "@mui/icons-material/History";

// 1. Declare as a named function so Turbopack can hoist the reference correctly
function HomeContent() {
  const theme = useTheme();
  const router = useRouter();
  const { addToast } = useToast();
  const { t, locale } = useTranslation();
  const { generateReport, isLoading: isSubmitting } = useGenerateReport();

  const [isPending, startTransition] = useTransition();
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    const hasResult = localStorage.getItem("analysisResult");
    if (hasResult && router.query.edit !== "true") {
      router.replace("/report");
    }
  }, [router, router.isReady, router.query.edit]);

  const isEditMode = router.query.edit === "true";
  const isFormValid = resumeText.trim().length > 50 && jobDescription.trim().length >= 20;

  const handleSubmit = () => {
    startTransition(async () => {
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobText", jobDescription);
      try {
        const result = await generateReport(resumeText, jobDescription, locale);
        if (result.success) {
          addToast(t("toast.generated_success"), "success", 3000);
          router.push("/report");
        } else {
          addToast(`Error: ${result.error}`, "error");
          throw new Error(result.error);
        }
      } catch (error) {
        addToast("Failed to connect to server", "error");
        throw error;
      }
    });
  };

  return (
    <MainLayout>
      <Fade in={true} timeout={600}>
        <Box>
          {/* RECOVERY BANNER */}
          {isEditMode && (
            <Alert
              icon={<HistoryIcon fontSize="inherit" />}
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 3,
                fontWeight: 600,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                bgcolor: alpha(theme.palette.info.main, 0.05),
              }}
            >
              {t("home.editMode.notice")}
            </Alert>
          )}

          {/* HEADER */}
          <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 2 }}>
            <TipsAndUpdatesIcon sx={{ fontSize: "2.5rem", color: "primary.main" }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                TalentMatcher
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
                {t("dashboard.header.description")?.split(".")[0]}
              </Typography>
            </Box>
          </Box>

          {/* DISCLAIMER CARD */}
          <Card
            elevation={0}
            sx={{
              mb: 4,
              p: 1,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
                <Box sx={{ flexShrink: 0 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LanguageIcon fontSize="small" color="primary" /> {t("home.disclaimer.title")}
                  </Typography>
                  <LanguageToggle />
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", md: "block" } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7, fontWeight: 500 }}
                >
                  <strong>Disclaimer:</strong> {t("home.disclaimer.body")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <UploadForm
            onResumeUpload={(_, text) => setResumeText(text)}
            onJobDescriptionChange={setJobDescription}
          />

          {/* STATUS BAR */}
          <Box
            sx={{
              mt: 4,
              p: 2.5,
              borderRadius: 4,
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              bgcolor: alpha(theme.palette.background.paper, 0.3),
              border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 22,
                  color: resumeText.length > 50 ? "success.main" : "action.disabled",
                }}
              />
              <Typography variant="body2" fontWeight={800}>
                {t("home.form.resume_label")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 22,
                  color: jobDescription.length >= 20 ? "success.main" : "action.disabled",
                }}
              />
              <Typography variant="body2" fontWeight={800}>
                {t("home.form.job_label")}
              </Typography>
            </Box>
          </Box>

          {/* ACTION BUTTON */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting || isPending}
              endIcon={
                isSubmitting || isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              sx={{
                px: 6,
                py: 2,
                borderRadius: 4,
                fontWeight: 900,
                textTransform: "none",
                fontSize: "1rem",
                color: "common.white",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              {isSubmitting || isPending ? t("loading.generating") : t("loading.generate_report")}
            </Button>
          </Box>
        </Box>
      </Fade>
    </MainLayout>
  );
}

// 2. Wrap and Export
const Home = dynamic(() => Promise.resolve(HomeContent), {
  ssr: false,
  loading: () => (
    <MainLayout>
      <Box sx={{ p: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    </MainLayout>
  ),
});

export default Home;
