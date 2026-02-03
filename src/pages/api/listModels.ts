import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json({ availableModels: data.models });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
