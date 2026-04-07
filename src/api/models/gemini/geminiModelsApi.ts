import { GeminiModelOption } from "./geminiModels.types";

export interface FetchModelsResponse {
  success: boolean;
  models: GeminiModelOption[];
  error?: string;
}

export const fetchAvailableModels = async (): Promise<FetchModelsResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
    const response = await fetch(`${baseUrl}/models?t=${Date.now()}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to fetch models");
    }

    return {
      success: true,
      models: data.models || [],
    };
  } catch (error: unknown) {
    return { success: false, models: [], error: (error as Error).message };
  }
};
