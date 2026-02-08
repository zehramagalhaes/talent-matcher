import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalyzeReportSchema } from "@/api/analyze/schema";
import { buildPrompt } from "@/api/prompt";
import { DEFAULT_GEMINI_MODEL } from "@/constants";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  // Destructure language from the body (passed from your useTranslation/Home state)
  const { resumeText, jobDescription, language } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: DEFAULT_GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Pass the language to the prompt builder
    const prompt = buildPrompt(resumeText, jobDescription, language || "en");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 1. Robust Sanitization
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 2. Parse JSON
    const rawData = JSON.parse(cleanedJson);

    // 3. Validation with Hallucination Check
    const validation = AnalyzeReportSchema.safeParse(rawData);

    if (!validation.success) {
      console.error("ZOD_VALIDATION_FAILURE:", validation.error.format());
      return res.status(422).json({
        error: "AI Response Format Invalid",
        message: "The AI hallucinated or missed required fields.",
        details: validation.error.errors,
      });
    }

    return res.status(200).json(validation.data);
  } catch (error: unknown) {
    console.error("CRITICAL_API_ERROR:", error);
    return res.status(500).json({
      error: "Analysis failed",
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
