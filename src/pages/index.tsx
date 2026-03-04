import { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  CircularProgress,
  alpha,
  useTheme,
  Fade,
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import HistoryIcon from "@mui/icons-material/History";
import TuneIcon from "@mui/icons-material/Tune";

import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useReport } from "@/hooks/useReport";

import MainLayout from "@/components/common/Layout";
import UploadForm from "@/components/forms/UploadForm";
import { AppHeader } from "@/components/common/AppHeader";
import { LanguageDisclaimer } from "@/components/feedbacks/LanguageDisclaimer";
import { UploadFormFooter } from "@/components/forms/UploadFormFooter";

import { fetchAvailableModels } from "@/api/models/gemini/geminiModelsApi";
import { DEFAULT_GEMINI_MODEL } from "@/constants";
import { GeminiModelOption } from "@/api/models/gemini/geminiModels.types";

function HomeContent() {
  const theme = useTheme();
  const router = useRouter();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { generateReport, isLoading: isSubmitting } = useReport();

  const [isPending, startTransition] = useTransition();
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  // --- State for Dynamic Model Selection ---
  const [models, setModels] = useState<GeminiModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_GEMINI_MODEL);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  const isEditMode = router.query.edit === "true";
  const isGlobalLoading = isSubmitting || isPending;
  const isFormValid = resumeText.trim().length > 50 && jobDescription.trim().length >= 20;

  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      const response = await fetchAvailableModels();

      if (isMounted && response.success) {
        setModels(response.models);

        // 1. Check if user has a preference saved in this browser
        const savedModel = localStorage.getItem("selectedModel");

        // 2. Verify if the saved preference (or the default) actually exists in the API list
        const modelExists = (id: string) => response.models.some((m) => m.id === id);

        if (savedModel && modelExists(savedModel)) {
          // Keep user's manual selection
          setSelectedModel(savedModel);
        } else if (modelExists(DEFAULT_GEMINI_MODEL)) {
          // Force your specific DEFAULT_GEMINI_MODEL constant
          setSelectedModel(DEFAULT_GEMINI_MODEL);
        } else if (response.models.length > 0) {
          // Emergency fallback: only if the default constant isn't in the API list
          setSelectedModel(response.models[0].id);
        }
      }

      if (isMounted) setIsLoadingModels(false);
    };

    loadModels();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Redirection logic
  useEffect(() => {
    if (!router.isReady) return;
    const hasResult = localStorage.getItem("analysisResult");
    if (hasResult && !isEditMode) {
      router.replace("/report");
    }
  }, [router, isEditMode]);

  const handleSubmit = () => {
    startTransition(async () => {
      // Save preferences
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobText", jobDescription);
      localStorage.setItem("selectedModel", selectedModel);

      try {
        const result = await generateReport(resumeText, jobDescription, selectedModel);
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

            {/* AI Engine Selection UI */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
              }}
            >
              {isLoadingModels ? (
                <Skeleton
                  variant="rectangular"
                  sx={{ borderRadius: 2, width: { xs: "100%", sm: 240 }, height: 40 }}
                />
              ) : (
                <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 240 } }}>
                  <InputLabel id="model-select-label">{t("common.model")}</InputLabel>
                  <Select
                    labelId="model-select-label"
                    value={selectedModel}
                    label={t("common.model")}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={isGlobalLoading}
                    IconComponent={TuneIcon}
                    sx={{
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: "blur(8px)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.divider, 0.1),
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    {models.length > 0 ? (
                      models.map((model) => (
                        <MenuItem key={model.id} value={model.id}>
                          {model.displayName}
                        </MenuItem>
                      ))
                    ) : (
                      // This ensures that even if the API is slow, the DEFAULT_GEMINI_MODEL
                      // is a valid value for the Select component to render
                      <MenuItem value={DEFAULT_GEMINI_MODEL}>
                        {DEFAULT_GEMINI_MODEL.includes("flash")
                          ? "Gemini 3 Flash (Default)"
                          : "Default Engine"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}
            </Box>

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
