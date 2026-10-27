import axiosClient from "@/api/baseApi";
import { AnalyzeReportResult } from "./schema";

export interface AnalyzePayload {
  resumeText: string;
  jobDescription: string;
  language?: string;
  selectedModel?: string;
}

export interface AnalyzeResponse {
  success?: boolean;
  report?: AnalyzeReportResult;
  error?: string;
  message?: string;
  details?: unknown;
}

/**
 * Envia currículo e vaga para a API Route server-side `/api/analyze`.
 * A chave do Gemini é lida exclusivamente no servidor — nunca exposta ao browser.
 */
export const analyzeResume = async (payload: AnalyzePayload): Promise<AnalyzeReportResult> => {
  const { data } = await axiosClient.post<AnalyzeReportResult>("/analyze", payload);
  return data;
};
