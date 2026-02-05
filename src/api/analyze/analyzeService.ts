import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEFAULT_GEMINI_MODEL } from "@/constants";
import { isApiKeyError } from "@/utils/apiUtils";

export const generateAnalysis = async (
  analysisPrompt: string,
  primaryKey?: string,
  fallbackKey?: string
): Promise<string> => {
  const systemInstruction =
    "You are the Anti-Gravity Agent. Your role is to strip away corporate bias and analyze resumes based purely on technical merit and job alignment. Provide a Tech Recruiter persona summary, a compatibility score (0-100), and specific bulleted improvements.";

  const genAI = new GoogleGenerativeAI(primaryKey || fallbackKey!);
  const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL, systemInstruction });

  try {
    const result = await model.generateContent(analysisPrompt);
    return result.response.text();
  } catch (error: unknown) {
    if (
      isApiKeyError(error instanceof Error ? error.message : String(error)) &&
      fallbackKey &&
      primaryKey !== fallbackKey
    ) {
      const fallbackGenAI = new GoogleGenerativeAI(fallbackKey);
      const fallbackModel = fallbackGenAI.getGenerativeModel({
        model: DEFAULT_GEMINI_MODEL,
        systemInstruction,
      });
      const result = await fallbackModel.generateContent(analysisPrompt);
      return result.response.text();
    }
    throw error;
  }
};
