import { Controller, Post, Route, Body, SuccessResponse } from 'tsoa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyzeReportSchema, ResumeStructure } from '../schemas/analyzeSchema';
import { buildPrompt } from '../utils/prompt';

interface AnalyzeRequest {
  resumeText: string;
  jobDescription: string;
  language?: string;
  selectedModel?: string;
}

/**
 * Note: AnalyzeResponse matches the structure defined in the Zod schema.
 * Using an explicit interface helps TSOA with metadata generation.
 */
export interface AnalyzeResponse {
  match_score_compact: number;
  match_score_detailed: number;
  recommended_strategy: 'compact' | 'detailed';
  strategy_insight: string;
  title_suggestion?: string;
  strengths: Array<{
    category: string;
    items: string[];
  }>;
  gaps: Array<{
    category: string;
    items: string[];
  }>;
  keywords_to_add: Array<{
    category: string;
    items: string[];
  }>;
  experience_bridge_suggestions: Array<{
    context: string;
    instruction: string;
    applied_experience: string;
  }>;
  scoring_rubric: {
    overall_notes: string;
  };
  optimized_versions: {
    compact: ResumeStructure;
    detailed: ResumeStructure;
  };
}

@Route('api')
export class AnalyzeController extends Controller {
  /**
   * Analyze resume compatibility with job description
   * 
   * Uses AI to analyze how well a resume matches a job description and provides
   * a detailed compatibility report with strengths, gaps, and improvement suggestions.
   * 
   * @param requestBody The resume text, job description, language preference, and model selection
   * @returns Detailed analysis report with match scores and recommendations
   */
  @Post('analyze')
  @SuccessResponse('200', 'Analysis successful')
  async analyzeResume(@Body() requestBody: AnalyzeRequest): Promise<AnalyzeResponse> {
    const { resumeText, jobDescription, language = 'en', selectedModel } = requestBody;

    if (!resumeText || !resumeText.trim()) {
      this.setStatus(400);
      throw { error: 'Validation Error', message: 'resumeText is required' };
    }
    if (!jobDescription || !jobDescription.trim()) {
      this.setStatus(400);
      throw { error: 'Validation Error', message: 'jobDescription is required' };
    }

    try {
      const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ALT || '';
      if (!geminiKey) {
        this.setStatus(500);
        throw { error: 'Configuration Error', message: 'Gemini API key is not configured' };
      }

      const genAI = new GoogleGenerativeAI(geminiKey);
      const modelId = selectedModel || 'gemini-2-5-flash';

      const model = genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const prompt = buildPrompt(resumeText, jobDescription, language);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Sanitize response
      const cleanedJson = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const rawData = JSON.parse(cleanedJson);

      // Validate response
      const validation = AnalyzeReportSchema.safeParse(rawData);
      if (!validation.success) {
        this.setStatus(422);
        throw {
          error: 'AI Response Format Invalid',
          message: 'The AI response does not match expected schema',
          details: validation.error.errors,
        };
      }

      return validation.data as AnalyzeResponse;
    } catch (error) {
      console.error('ANALYSIS_ERROR:', error);
      this.setStatus(500);
      throw {
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }
}
