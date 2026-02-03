export class GeminiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeCompatibility(resumeText: string, jobText: string) {
    const response = await fetch("https://api.gemini.com/v1/antigravity", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "agent-anti-gravity",
        input: {
          resume: resumeText,
          job: jobText,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    return response.json();
  }
}
