import type { NextApiRequest, NextApiResponse } from "next";
import {
  GoogleGenerativeAI,
  GoogleGenerativeAIAbortError,
  GoogleGenerativeAIFetchError,
  GoogleGenerativeAIResponseError,
} from "@google/generative-ai";
import { classifyGeminiError, parseAnalysisResponse } from "@/api/analyze/responseValidation";
import { GEMINI_ANALYSIS_RESPONSE_SCHEMA } from "@/api/analyze/geminiResponseSchema";
import { buildPrompt, SYSTEM_INSTRUCTION } from "@/api/prompt";
import { DEFAULT_GEMINI_MODEL } from "@/constants";
import { AnalyzeRequestSchema, REQUEST_LIMITS } from "@/api/analyze/requestSchema";
import { getClientRateLimitKey, isRateLimited } from "@/api/security/rateLimit";
import { readJsonBody } from "@/api/security/readJsonBody";

// ---------------------------------------------------------------------------
// Limites de validação de entrada
// ---------------------------------------------------------------------------
const LIMITS = {
  GEMINI_TIMEOUT_MS: 50_000,
} as const;

const MAX_REQUEST_BYTES = 256 * 1024;
export const config = { api: { bodyParser: false }, maxDuration: 60 };

// ---------------------------------------------------------------------------
// Inicialização do cliente Gemini (server-side only)
// A chave é lida exclusivamente de variável de ambiente sem prefixo NEXT_PUBLIC_.
// ---------------------------------------------------------------------------
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ALT;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  return new GoogleGenerativeAI(apiKey);
}

// ---------------------------------------------------------------------------
// Handler principal
// ---------------------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Método
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed", message: "Use POST for analysis." });
  }

  const contentType = req.headers["content-type"] || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return res
      .status(415)
      .json({ error: "Unsupported media type", message: "Send a JSON request." });
  }

  const key = getClientRateLimitKey(req.headers, req.socket.remoteAddress || "unknown");
  if (isRateLimited(`analyze:${key}`, 5, 15 * 60_000)) {
    res.setHeader("Retry-After", "900");
    return res
      .status(429)
      .json({ error: "Rate limit exceeded", message: "Please try again later." });
  }

  const declaredLength = Number(req.headers["content-length"] || 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return res
      .status(413)
      .json({ error: "Request too large", message: "The request exceeds the allowed size." });
  }
  const requestBody = await readJsonBody(req, MAX_REQUEST_BYTES);
  if (!requestBody.success) {
    return res.status(requestBody.status).json({
      error: requestBody.status === 413 ? "Request too large" : "Invalid JSON",
      message:
        requestBody.status === 413
          ? "The request exceeds the allowed size."
          : "Send a valid JSON request.",
    });
  }

  const parsedRequest = AnalyzeRequestSchema.safeParse(requestBody.data);
  if (!parsedRequest.success) {
    const resumeTooLarge =
      typeof (requestBody.data as { resumeText?: unknown } | null)?.resumeText === "string" &&
      (requestBody.data as { resumeText: string }).resumeText.length > REQUEST_LIMITS.resumeMax;
    const jobTooLarge =
      typeof (requestBody.data as { jobDescription?: unknown } | null)?.jobDescription ===
        "string" &&
      (requestBody.data as { jobDescription: string }).jobDescription.length >
        REQUEST_LIMITS.jobMax;
    return res.status(400).json({
      error: resumeTooLarge || jobTooLarge ? "Input too large" : "Invalid request",
      message: resumeTooLarge
        ? `Resume must be at most ${REQUEST_LIMITS.resumeMax} characters.`
        : jobTooLarge
          ? `Job description must be at most ${REQUEST_LIMITS.jobMax} characters.`
          : `Provide readable resume text (at least ${REQUEST_LIMITS.resumeMin} characters) and a job description (at least ${REQUEST_LIMITS.jobMin} characters).`,
    });
  }

  const { resumeText, jobDescription } = parsedRequest.data;
  const safeLanguage = parsedRequest.data.language || "en";
  const safeModel = parsedRequest.data.selectedModel || DEFAULT_GEMINI_MODEL;

  try {
    const genAI = getGeminiClient();

    const model = genAI.getGenerativeModel({
      model: safeModel,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        // Força saída JSON — elimina a necessidade de regex de sanitização
        responseMimeType: "application/json",
        responseSchema: GEMINI_ANALYSIS_RESPONSE_SCHEMA,
        // Temperatura baixa: mais determinístico, menos "criativo" = menos alucinações
        temperature: 0.2,
        // Top-P conservador para manter consistência
        topP: 0.85,
      },
    });

    const prompt = buildPrompt(resumeText.trim(), jobDescription.trim(), safeLanguage);

    const result = await model.generateContent(prompt, { timeout: LIMITS.GEMINI_TIMEOUT_MS });
    const responseText = result.response.text();
    const validation = parseAnalysisResponse(responseText, resumeText);

    if (!validation.success) {
      console.error("[analyze] Response validation failed:", validation.reason);
      return res.status(422).json({
        error: "Analysis failed",
        message: "The AI response could not be verified against the resume. Please try again.",
      });
    }

    return res.status(200).json(validation.data);
  } catch (error: unknown) {
    // Distingue erros de configuração de erros de runtime
    if (error instanceof Error && error.message === "GEMINI_API_KEY not configured") {
      // Log interno — mensagem genérica ao usuário
      console.error("[analyze] GEMINI_API_KEY is not set in environment variables.");
      return res.status(500).json({
        error: "Service unavailable",
        message: "The analysis service is not configured. Please contact the administrator.",
      });
    }

    if (
      error instanceof GoogleGenerativeAIFetchError ||
      error instanceof GoogleGenerativeAIAbortError ||
      error instanceof GoogleGenerativeAIResponseError
    ) {
      const classified = classifyGeminiError(error);
      console.error("[analyze] Gemini request failed:", classified.error);
      return res.status(classified.status).json({
        error: classified.error,
        message: classified.message,
      });
    }

    console.error("[analyze] Unexpected analysis failure.");
    return res.status(503).json({
      error: "Analysis unavailable",
      message: "The analysis could not be completed. Please try again.",
    });
  }
}
