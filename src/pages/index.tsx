import { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, CircularProgress, alpha, useTheme, Fade, Alert, Container } from "@mui/material";
import { useRouter } from "next/router";
import HistoryIcon from "@mui/icons-material/History";

import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useReport } from "@/hooks/useReport";

import MainLayout from "@/components/common/Layout";
import UploadForm from "@/components/forms/UploadForm";
import { AppHeader } from "@/components/common/AppHeader";
import { LanguageDisclaimer } from "@/components/feedbacks/LanguageDisclaimer";
import { UploadFormFooter } from "@/components/forms/UploadFormFooter";

function HomeContent() {
  const theme = useTheme();
  const router = useRouter();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { generateReport, isLoading: isSubmitting } = useReport();

  const [isPending, startTransition] = useTransition();
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  const isEditMode = router.query.edit === "true";
  const isGlobalLoading = isSubmitting || isPending;
  const isFormValid = resumeText.trim().length > 50 && jobDescription.trim().length >= 20;

  useEffect(() => {
    if (!router.isReady) return;
    const hasResult = localStorage.getItem("analysisResult");
    if (hasResult && !isEditMode) {
      router.replace("/report");
    }
  }, [router, isEditMode]);

  const handleSubmit = () => {
    startTransition(async () => {
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobText", jobDescription);

      try {
        const result = await generateReport(resumeText, jobDescription);
        if (result.success) {
          addToast(t("toast.generated_success"), "success", 3000);
          router.push("/report");
        }
      } catch (error) {
        addToast("Failed to process request", "error");
        console.error("Report generation error:", error);
      }
    });
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
        <Fade in={true} timeout={600}>
          <Box>
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

            <AppHeader title={t("app.name")} description={t("app.description")?.split(".")[0]} />

            <LanguageDisclaimer
              title={t("home.disclaimer.title")}
              body={t("home.disclaimer.body")}
            />

            <UploadForm
              onResumeUpload={(_, text) => setResumeText(text)}
              onJobDescriptionChange={setJobDescription}
            />

            <UploadFormFooter
              isValid={isFormValid}
              isLoading={isGlobalLoading}
              onSubmit={handleSubmit}
              submitLabel={t("loading.generate_report")}
              loadingLabel={t("loading.generating")}
              checks={[
                { label: t("home.form.resume_label"), completed: resumeText.length > 50 },
                { label: t("home.form.job_label"), completed: jobDescription.length >= 20 },
              ]}
            />
          </Box>
        </Fade>
      </Container>
    </MainLayout>
  );
}

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
