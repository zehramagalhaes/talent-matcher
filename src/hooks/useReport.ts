import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { analyzeResume } from "@/api/analyze/analyzeApi";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getSessionData, removeSessionData, setSessionData } from "@/utils/sessionData";

export const useReport = (autoHydrate = false) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { t, locale } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalyzeReportResult | null>(null);

  const isInitialMount = useRef(true);

  const generateReport = useCallback(
    async (resumeText?: string, jobDescription?: string, selectedModel?: string) => {
      setIsLoading(true);
      setError(null);

      // Cenário: re-fetch / hidratação usando dados armazenados se os args estiverem ausentes
      const finalResume = resumeText || getSessionData("resumeText");
      const finalJob = jobDescription || getSessionData("jobText");

      if (!finalResume || !finalJob) {
        const msg = t("report.error.missing_data");
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }

      try {
        const result = await analyzeResume({
          resumeText: finalResume,
          jobDescription: finalJob,
          language: locale,
          selectedModel,
        });

        // Persiste os dados de entrada e o resultado
        setSessionData("analysisResult", JSON.stringify(result));
        setSessionData("resumeText", finalResume);
        setSessionData("jobText", finalJob);

        setReport(result);
        return { success: true, data: result };
      } catch (err) {
        // Extrai mensagem de erro sem vazar detalhes técnicos internos para o usuário
        let errorMessage = "Erro desconhecido";

        if (axios.isAxiosError(err)) {
          // Prefere a mensagem amigável do servidor, se disponível
          errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        addToast(t("report.error.prefix").replace("{message}", errorMessage), "error");
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [locale, t, addToast]
  );

  // Lógica de hidratação: executa na página de relatório para carregar do cache
  useEffect(() => {
    if (autoHydrate && isInitialMount.current && router.isReady) {
      isInitialMount.current = false;
      const cached = getSessionData("analysisResult");

      if (cached) {
        try {
          setReport(JSON.parse(cached));
        } catch {
          removeSessionData("analysisResult");
          generateReport(); // Tenta regenerar se o cache estiver corrompido
        }
      } else {
        generateReport(); // Sem cache, tenta gerar a partir do texto armazenado
      }
    }
  }, [autoHydrate, router.isReady, generateReport]);

  return { generateReport, isLoading, error, report, setReport };
};
