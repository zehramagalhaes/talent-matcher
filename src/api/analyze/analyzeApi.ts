import axiosClient from "@/api/baseApi";
import { AnalyzeReportResult } from "./schema";

export type AnalyzeResponse = {
  success: boolean;
  report?: AnalyzeReportResult;
  usedModel?: string;
  availableModels?: string[];
  error?: string;
};

export const analyzeApi = async (
  resume: string,
  job: string,
  preferredModel?: string
): Promise<AnalyzeResponse> => {
  const { data } = await axiosClient.post<AnalyzeResponse>("/analyze", {
    resume,
    job,
    preferredModel,
  });
  return data;
};
