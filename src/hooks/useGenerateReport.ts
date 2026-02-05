import { useState } from "react";

import axios from "axios";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";
import { AnalyzeResponse } from "@/api/analyze/analyzeApi";

const useGenerateReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<OptimizationResult | null>(null);

  const generateReport = async (resumeText: string, jobDescription: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/analyze", { resumeText, jobDescription });
      const result: AnalyzeResponse = response.data;

      // Store the actual analysis so the next page can just read it
      localStorage.setItem("analysisResult", JSON.stringify(result));

      // Also store these for the "Recover" feature
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobText", jobDescription);

      setReport(result.report || null);
      return { success: true, data: result };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { generateReport, isLoading, error, report };
};

export default useGenerateReport;
