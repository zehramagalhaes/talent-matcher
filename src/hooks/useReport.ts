import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";

export const useReport = (autoHydrate = false) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { t, locale } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalyzeReportResult | null>(null);

  const isInitialMount = useRef(true);

  const generateReport = useCallback(
    async (resumeText?: string, jobDescription?: string, model?: string) => {
      setIsLoading(true);
      setError(null);

      // Scenario: Re-fetching/Hydrating using stored data if args are missing
      const finalResume = resumeText || localStorage.getItem("resumeText");
      const finalJob = jobDescription || localStorage.getItem("jobText");

      if (!finalResume || !finalJob) {
        const msg = t("report.error.missing_data");
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }

      try {
        const response = await axios.post("/api/analyze", {
          resumeText: finalResume,
          jobDescription: finalJob,
          language: locale,
          model, // Optional model override
        });

        const result: AnalyzeReportResult = response.data;

        // Persist everything
        localStorage.setItem("analysisResult", JSON.stringify(result));
        localStorage.setItem("resumeText", finalResume);
        localStorage.setItem("jobText", finalJob);

        setReport(result);
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Unknown error";

        setError(errorMessage);
        addToast(t("report.error.prefix").replace("{message}", errorMessage), "error");
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [locale, t, addToast]
  );

  // Hydration Logic: Runs on the Report page to load from Cache
  useEffect(() => {
    if (autoHydrate && isInitialMount.current && router.isReady) {
      isInitialMount.current = false;
      const cached = localStorage.getItem("analysisResult");

      if (cached) {
        try {
          setReport(JSON.parse(cached));
        } catch {
          localStorage.removeItem("analysisResult");
          generateReport(); // Try to regenerate if cache is corrupt
        }
      } else {
        generateReport(); // No cache, try to generate from text
      }
    }
  }, [autoHydrate, router.isReady, generateReport]);

  return { generateReport, isLoading, error, report, setReport };
};
