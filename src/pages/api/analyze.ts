import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalyzeReportSchema } from "@/api/analyze/schema";
import { buildPrompt } from "@/api/prompt";
import { DEFAULT_GEMINI_MODEL } from "@/constants";

// ---------------------------------------------------------------------------
// Limites de validação de entrada
// ---------------------------------------------------------------------------
const LIMITS = {
  RESUME_MIN: 100, // caracteres mínimos para um currículo legível
  RESUME_MAX: 30_000, // ~15 páginas densas de texto
  JOB_MIN: 50, // caracteres mínimos para uma vaga válida
  JOB_MAX: 10_000, // limite da descrição da vaga
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
  const { resumeText, jobDescription, language, selectedModel } = req.body;

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
      generationConfig: {
        // Força saída JSON — elimina a necessidade de regex de sanitização
        responseMimeType: "application/json",
        // Temperatura baixa: mais determinístico, menos "criativo" = menos alucinações
        temperature: 0.2,
        // Top-P conservador para manter consistência
        topP: 0.85,
      },
    });

    const prompt = buildPrompt(resumeText.trim(), jobDescription.trim(), safeLanguage);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON — com responseMimeType: "application/json" o modelo retorna JSON puro
    // mas mantemos um try/catch robusto para casos edge
    let rawData: unknown;
    try {
      rawData = JSON.parse(responseText);
    } catch {
      // Log técnico interno (nunca exposto ao usuário)
      console.error("[analyze] JSON parse failed. Response length:", responseText.length);
      return res.status(422).json({
        error: "Analysis failed",
        message: "The AI returned an unprocessable response. Please try again.",
      });
    }

    // Validação com Zod
    const validation = AnalyzeReportSchema.safeParse(rawData);

    if (!validation.success) {
      // Log detalhado para debugging interno — não exposto ao usuário
      console.error("[analyze] Zod validation failed:", JSON.stringify(validation.error.format()));
      return res.status(422).json({
        error: "Analysis failed",
        message: "The AI response did not match the expected format. Please try again.",
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

    // Erros da API Gemini (rate limit, quota, modelo inválido, etc.)
    const isGeminiError =
      error instanceof Error &&
      (error.message.includes("quota") ||
        error.message.includes("rate") ||
        error.message.includes("API key") ||
        error.message.includes("not found"));

    if (isGeminiError) {
      console.error("[analyze] Gemini API error:", (error as Error).message);
      return res.status(503).json({
        error: "Service temporarily unavailable",
        message: "The AI service is temporarily unavailable. Please try again in a few moments.",
      });
    }

    // Erro genérico — log interno completo, mensagem genérica ao usuário
    console.error("[analyze] Unexpected error:", error);
    return res.status(500).json({
      error: "Internal error",
      message: "An unexpected error occurred. Please try again.",
    });
  }
}
