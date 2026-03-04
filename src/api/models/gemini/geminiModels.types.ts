/**
 * Official Gemini API Model structure as of March 2026.
 * Represents the raw response from the Google Generative AI Discovery API.
 */
export interface GeminiApiModel {
  name: string;
  version: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedMethods: string[];
  supportedGenerationMethods?: string[];
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiListModelsResponse {
  models: GeminiApiModel[];
}

/**
 * The cleaned-up structure we send to our Frontend.
 */
export interface GeminiModelOption {
  id: string;
  displayName: string;
}
