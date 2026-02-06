import { useState } from "react";
import axios from "axios";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";

const useGenerateReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<OptimizationResult | null>(null);

  /**
   * @param resumeText - Raw text extracted from file
   * @param jobDescription - Raw text from the job field
   * @param language - The current locale code (e.g., 'en' or 'pt')
   */
  const generateReport = async (resumeText: string, jobDescription: string, language: string) => {
    setIsLoading(true);
    setError(null); // Reset error state on new attempt

    try {
      // Pass resumeText, jobDescription, and language to the API
      const response = await axios.post("/api/analyze", {
        resumeText,
        jobDescription,
        language,
      });

      const result: OptimizationResult = response.data;

      // 1. Store the actual analysis so the next page can just read it
      localStorage.setItem("analysisResult", JSON.stringify(result));

      // 2. Also store these for the "Recover" feature
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobText", jobDescription);
      localStorage.setItem("selectedLanguage", language); // Persist chosen language

      setReport(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error";

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { generateReport, isLoading, error, report };
};

export default useGenerateReport;
