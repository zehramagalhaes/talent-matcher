import type { NextApiRequest, NextApiResponse } from "next";
import {
  GeminiApiModel,
  GeminiListModelsResponse,
  GeminiModelOption,
} from "@/api/models/gemini/geminiModels.types";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  // Force bypass of Next.js 15+ 304 Caching
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (!apiKey) {
    return res.status(500).json({ success: false, error: "API Key missing" });
  }

  try {
    const response = await fetch(`${baseUrl}/models?key=${apiKey}`, { cache: "no-store" });
    const data: GeminiListModelsResponse = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: "Google API Error" });
    }

    const filteredModels: GeminiModelOption[] = (data.models || [])
      .filter((m: GeminiApiModel) => {
        const name = m.name?.toLowerCase() || "";
        const displayName = m.displayName?.toLowerCase() || "";

        // 1. MUST support content generation
        const methods = m.supportedMethods || m.supportedGenerationMethods || [];
        const isGenerator = methods.includes("generateContent");

        // 2. TARGET: 2.5 and 3.x series
        const isModern = name.includes("gemini-2.5") || name.includes("gemini-3");

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
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}
