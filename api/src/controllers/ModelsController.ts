import { Controller, Route } from 'tsoa';

interface Model {
  id: string;
  displayName: string;
}

interface GeminiModel {
  name: string;
  displayName: string;
  supportedMethods?: string[];
  supportedGenerationMethods?: string[];
}

interface ModelsResponse {
  success: boolean;
  models: Model[];
}

@Route('api')
export class ModelsController extends Controller {
  /**
   * Get available AI models
   * 
   * Retrieves a list of available Gemini AI models that are compatible
   * with resume analysis tasks.
   * 
   * @returns List of available models with IDs and display names
   */
  
  async getModels(): Promise<ModelsResponse> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ALT;
    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    if (!apiKey) {
      this.setStatus(500);
      throw { success: false, error: 'API Key missing' };
    }

    try {
      const response = await fetch(`${baseUrl}/models?key=${apiKey}`, { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        this.setStatus(response.status);
        throw { success: false, error: 'Google API Error' };
      }

      const filteredModels = (data.models || [])
        .filter((m: GeminiModel) => {
          const name = m.name?.toLowerCase() || '';
          const displayName = m.displayName?.toLowerCase() || '';

          // MUST support content generation
          const methods = m.supportedMethods || m.supportedGenerationMethods || [];
          const isGenerator = methods.includes('generateContent');

          // TARGET: 2.5 and 3.x series
          const isModern = name.includes('gemini-2.5') || name.includes('gemini-3');

          // EXCLUSION: Block specialized models that fail at resume analysis
          const isSpecialized =
            name.includes('image') ||
            displayName.includes('image') ||
            displayName.includes('banana') ||
            name.includes('tts') ||
            name.includes('computer-use') ||
            name.includes('embedding') ||
            name.includes('custom') ||
            name.includes('lite') ||
            name.includes('vision-only');

          return isGenerator && isModern && !isSpecialized;
        })
        .map((m: GeminiModel) => ({
          id: m.name.split('/').pop() || '',
          displayName: m.displayName,
        }));

      // Sort by intelligence level
      const collator = new Intl.Collator('en', { numeric: true });
      const sortedModels = filteredModels.sort((a: Model, b: Model) =>
        collator.compare(b.displayName, a.displayName)
      );

      return { success: true, models: sortedModels };
    } catch (error) {
      console.error('MODELS_ERROR:', error);
      this.setStatus(500);
      throw {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }
}
