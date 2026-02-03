import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type GenerateResult = {
  success: boolean;
  error?: string;
  details?: { resumeName: string; jobLength: number };
};

const useGenerateReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string>("");

  const generateReport = async (resume: File, jobText: string): Promise<GenerateResult> => {
    setError(null);

    if (!resume) {
      const msg = "Resume is required";
      setError(msg);
      return { success: false, error: msg };
    }

    if (!jobText || jobText.trim().length < 20) {
      const msg = "Job description must be at least 20 characters";
      setError(msg);
      return { success: false, error: msg };
    }

    setIsLoading(true);
    try {
      const resumeText = await resume.text();
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobText", jobText);

      setIsLoading(false);
      return {
        success: true,
        details: { resumeName: resume.name, jobLength: jobText.length },
      };
    } catch (err: any) {
      const msg = err?.message || "Unknown error";
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const analyzeWithAntiGravity = async (resumeText: string, jobDesc: string): Promise<void> => {
    setError(null);

    if (!resumeText || !jobDesc) {
      const msg = "Resume and job description are required";
      setError(msg);
      throw new Error(msg);
    }

    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      if (!apiKey) {
        const msg = "API Key not configured";
        setError(msg);
        throw new Error(msg);
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.0-flash",
        systemInstruction:
          "You are the Anti-Gravity Agent. Your role is to strip away corporate bias and analyze resumes based purely on technical merit and job alignment. Provide a Tech Recruiter persona summary, a compatibility score (0-100), and specific bulleted improvements.",
      });

      const prompt = `JOB DESCRIPTION:
${jobDesc}

RESUME CONTENT:
${resumeText}

Generate:
1. A tech_recruiter.md section describing the ideal persona for this role.
2. A compatibility report with a score (0-100).
3. A refined version of the resume's summary/skills.
4. Specific, actionable improvements for better alignment.`;

      const result = await model.generateContent(prompt);
      const generatedReport = result.response.text();
      setReport(generatedReport);
      localStorage.setItem("analysisReport", generatedReport);

      setIsLoading(false);
    } catch (err: any) {
      const msg = err?.message || "Analysis failed";
      setError(msg);
      setIsLoading(false);
      throw err;
    }
  };

  const downloadReport = (filename: string = "talent_match_analysis.md"): void => {
    if (!report) {
      setError("No report available to download");
      return;
    }

    try {
      const blob = new Blob([report], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      const msg = err?.message || "Download failed";
      setError(msg);
    }
  };

  return {
    generateReport,
    analyzeWithAntiGravity,
    downloadReport,
    isLoading,
    error,
    report,
  } as const;
};

export default useGenerateReport;
