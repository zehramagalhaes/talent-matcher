import type { NextApiRequest, NextApiResponse } from "next";
import {
  GeminiApiModel,
  GeminiListModelsResponse,
  GeminiModelOption,
} from "@/api/models/gemini/geminiModels.types";
import { isSupportedGeminiModelId } from "@/api/analyze/requestSchema";
import { getClientRateLimitKey, isRateLimited } from "@/api/security/rateLimit";

const MODELS_TIMEOUT_MS = 8_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ALT;
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  // Force bypass of Next.js 15+ 304 Caching
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const key = getClientRateLimitKey(req.headers, req.socket.remoteAddress || "unknown");
  if (isRateLimited(`models:${key}`, 30, 60_000)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ success: false, error: "Rate limit exceeded" });
  }

  if (!apiKey) {
    return res.status(503).json({ success: false, error: "Service unavailable" });
  }

  try {
    const response = await fetch(`${baseUrl}/models`, {
      cache: "no-store",
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(MODELS_TIMEOUT_MS),
    });
    const data: GeminiListModelsResponse = await response.json();

    if (!response.ok) {
      return res.status(response.status === 429 ? 503 : 502).json({
        success: false,
        error: "Model list unavailable",
      });
    }

    const filteredModels: GeminiModelOption[] = (data.models || [])
      .filter((m: GeminiApiModel) => {
        const name = m.name?.toLowerCase() || "";
        const displayName = m.displayName?.toLowerCase() || "";

        // 1. MUST support content generation
        const methods = m.supportedMethods || m.supportedGenerationMethods || [];
        const isGenerator = methods.includes("generateContent");

        // 2. TARGET: 2.5 and 3.x series
        const id = m.name?.split("/").pop() || "";
        const isModern = isSupportedGeminiModelId(id);

        // 3. EXCLUSION: Block specialized engines that fail at resume analysis
        // We block "image" and "banana" because they are for visuals/pixels.
        // We block "tts", "computer-use", "lite", "custom", "vision-only", and "embedding".
        const isSpecialized =
          name.includes("image") ||
          displayName.includes("image") ||
          displayName.includes("banana") ||
          name.includes("tts") ||
          name.includes("computer-use") ||
          name.includes("embedding") ||
          name.includes("custom") ||
          name.includes("lite") ||
          name.includes("vision-only");

        return isGenerator && isModern && !isSpecialized;
      })
      .map((m: GeminiApiModel) => ({
        id: m.name.split("/").pop() || "",
        displayName: m.displayName,
      }));

    // Sort to put the most intelligent models (3.1 Pro) at the top
    const collator = new Intl.Collator("en", { numeric: true });
    const sortedModels = filteredModels.sort((a, b) =>
      collator.compare(b.displayName, a.displayName)
    );

    return res.status(200).json({ success: true, models: sortedModels });
  } catch (error: unknown) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      error: timedOut ? "Model list timed out" : "Model list unavailable",
    });
  }
}
