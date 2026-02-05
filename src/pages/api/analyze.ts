import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OptimizationSchema } from "@/api/schemas/optimizationSchema";
import { buildPrompt } from "@/api/prompt";
import { DEFAULT_GEMINI_MODEL } from "@/constants";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { resumeText, jobDescription } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: DEFAULT_GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = buildPrompt(resumeText, jobDescription);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 1. Sanitize: Remove markdown triple backticks if present
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 2. Parse
    const rawData = JSON.parse(cleanedJson);

    // 3. Validate with Zod
    const validatedData = OptimizationSchema.parse(rawData);

    return res.status(200).json(validatedData);
  } catch (error: unknown) {
    // Check terminal for this specific log to see which field failed validation
    console.error("DEBUG_API_ERROR:", error);

    return res.status(500).json({
      error: "Analysis failed",
      message: error instanceof Error ? error.message : String(error),
      // Optional: send Zod errors to help debugging
      details: (error instanceof Error && (error as Error).stack) ?? null,
    });
  }
}
