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

// ---------------------------------------------------------------------------
// Limites de validação de entrada
// ---------------------------------------------------------------------------
const LIMITS = {
  RESUME_MIN: 100, // caracteres mínimos para um currículo legível
  RESUME_MAX: 30_000, // ~15 páginas densas de texto
  JOB_MIN: 50, // caracteres mínimos para uma vaga válida
  JOB_MAX: 10_000, // limite da descrição da vaga
  GEMINI_TIMEOUT_MS: 50_000,
  SUPPORTED_LANGUAGES: ["en", "pt", "es", "fr", "de", "it"] as const,
} as const;

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
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Validação de entradas
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const { resumeText, jobDescription, language, selectedModel } = body;

  if (typeof resumeText !== "string" || resumeText.trim().length < LIMITS.RESUME_MIN) {
    return res.status(400).json({
      error: "Invalid resume",
      message: `Resume must be at least ${LIMITS.RESUME_MIN} characters of readable text.`,
    });
  }

  if (resumeText.length > LIMITS.RESUME_MAX) {
    return res.status(400).json({
      error: "Resume too large",
      message: `Resume must be under ${LIMITS.RESUME_MAX} characters. Please upload a shorter document.`,
    });
  }

  if (typeof jobDescription !== "string" || jobDescription.trim().length < LIMITS.JOB_MIN) {
    return res.status(400).json({
      error: "Invalid job description",
      message: `Job description must be at least ${LIMITS.JOB_MIN} characters.`,
    });
  }

  if (jobDescription.length > LIMITS.JOB_MAX) {
    return res.status(400).json({
      error: "Job description too large",
      message: `Job description must be under ${LIMITS.JOB_MAX} characters.`,
    });
  }

  // Normalizar idioma — fallback seguro para "en"
  const supportedLanguages = LIMITS.SUPPORTED_LANGUAGES as readonly string[];
  const safeLanguage = supportedLanguages.includes(language) ? language : "en";

  // Modelo: valida que é uma string simples (sem injeção de caracteres especiais)
  const safeModel =
    typeof selectedModel === "string" && /^[\w.-]+$/.test(selectedModel)
      ? selectedModel
      : DEFAULT_GEMINI_MODEL;

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
