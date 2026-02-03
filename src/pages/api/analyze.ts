import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ===== Error Constants =====
const ERROR_TYPES = {
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  INVALID_RESUME: "INVALID_RESUME",
  INVALID_JOB_DESC: "INVALID_JOB_DESC",
  API_KEY_MISSING: "API_KEY_MISSING",
  API_KEY_INVALID: "API_KEY_INVALID",
  ANALYSIS_FAILED: "ANALYSIS_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

const ERROR_MESSAGES = {
  [ERROR_TYPES.METHOD_NOT_ALLOWED]: "Only POST requests are allowed",
  [ERROR_TYPES.INVALID_RESUME]: "Resume content is required and must be a string",
  [ERROR_TYPES.INVALID_JOB_DESC]: "Job description is required and must be a string",
  [ERROR_TYPES.API_KEY_MISSING]:
    "API Key not configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_ALT environment variable",
  [ERROR_TYPES.API_KEY_INVALID]: "API key is invalid or expired",
  [ERROR_TYPES.ANALYSIS_FAILED]: "Failed to generate analysis",
  [ERROR_TYPES.INTERNAL_ERROR]: "Internal server error",
} as const;

const HTTP_STATUS_CODES = {
  [ERROR_TYPES.METHOD_NOT_ALLOWED]: 405,
  [ERROR_TYPES.INVALID_RESUME]: 400,
  [ERROR_TYPES.INVALID_JOB_DESC]: 400,
  [ERROR_TYPES.API_KEY_MISSING]: 500,
  [ERROR_TYPES.API_KEY_INVALID]: 500,
  [ERROR_TYPES.ANALYSIS_FAILED]: 500,
  [ERROR_TYPES.INTERNAL_ERROR]: 500,
} as const;

type AnalysisResult = {
  success: boolean;
  report?: string;
  usedModel?: string;
  error?: string;
};

// ===== Helper Functions =====

/**
 * Check if an error is API key related
 */
const isApiKeyError = (errorMessage: string): boolean => {
  const apiKeyErrorPatterns = [
    "API_KEY_INVALID",
    "API key expired",
    "Invalid API Key",
    "401",
    "403",
  ];
  return apiKeyErrorPatterns.some((pattern) => errorMessage.includes(pattern));
};

/**
 * Get the appropriate error response
 */
const createErrorResponse = (errorType: keyof typeof ERROR_TYPES): AnalysisResult => {
  return {
    success: false,
    error: ERROR_MESSAGES[errorType],
  };
};

/**
 * Validate request method
 */
const validateMethod = (method: string | undefined): boolean => {
  return method === "POST";
};

/**
 * Validate and extract resume and job description from request body
 */
const validateInputs = (body: any): { resume: string; jobDesc: string } | null => {
  const { resume, jobDescription, job, jobText } = body;

  // Validate resume
  if (!resume || typeof resume !== "string") {
    return null;
  }

  // Accept multiple parameter names for job description
  const jobDesc = jobDescription || job || jobText;
  if (!jobDesc || typeof jobDesc !== "string") {
    return null;
  }

  return { resume, jobDesc };
};

/**
 * Generate analysis with fallback key support
 */
const generateAnalysis = async (
  analysisPrompt: string,
  primaryKey: string | undefined,
  fallbackKey: string | undefined
): Promise<string> => {
  const genAI = new GoogleGenerativeAI(primaryKey || fallbackKey!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "You are the Anti-Gravity Agent. Your role is to strip away corporate bias and analyze resumes based purely on technical merit and job alignment. Provide a Tech Recruiter persona summary, a compatibility score (0-100), and specific bulleted improvements.",
  });

  try {
    const result = await model.generateContent(analysisPrompt);
    return result.response.text();
  } catch (error: unknown) {
    const errorMessage = (error as any)?.message || "";

    // Check if we should retry with fallback key
    if (isApiKeyError(errorMessage) && fallbackKey && primaryKey !== fallbackKey) {
      console.warn("Primary API key failed, retrying with fallback key...", errorMessage);
      const fallbackGenAI = new GoogleGenerativeAI(fallbackKey);
      const fallbackModel = fallbackGenAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction:
          "You are the Anti-Gravity Agent. Your role is to strip away corporate bias and analyze resumes based purely on technical merit and job alignment. Provide a Tech Recruiter persona summary, a compatibility score (0-100), and specific bulleted improvements.",
      });

      const result = await fallbackModel.generateContent(analysisPrompt);
      return result.response.text();
    }

    throw error;
  }
};

// ===== Main Handler =====
export default async function handler(req: NextApiRequest, res: NextApiResponse<AnalysisResult>) {
  let errorType: keyof typeof ERROR_TYPES | null = null;

  try {
    // Validate HTTP method
    if (!validateMethod(req.method)) {
      errorType = ERROR_TYPES.METHOD_NOT_ALLOWED;
      return res.status(HTTP_STATUS_CODES[errorType]).json(createErrorResponse(errorType));
    }

    // Validate inputs
    const inputs = validateInputs(req.body);
    if (!inputs) {
      const missingResume = !req.body.resume || typeof req.body.resume !== "string";
      errorType = missingResume ? ERROR_TYPES.INVALID_RESUME : ERROR_TYPES.INVALID_JOB_DESC;
      console.error(`Validation failed - ${errorType}:`, {
        hasResume: !!req.body.resume,
        bodyKeys: Object.keys(req.body),
      });
      return res.status(HTTP_STATUS_CODES[errorType]).json(createErrorResponse(errorType));
    }

    const { resume, jobDesc } = inputs;

    // Validate API keys
    const primaryApiKey = process.env.GEMINI_API_KEY;
    const fallbackApiKey = process.env.GEMINI_API_KEY_ALT;

    if (!primaryApiKey && !fallbackApiKey) {
      errorType = ERROR_TYPES.API_KEY_MISSING;
      console.error(`${errorType}: No Gemini API keys configured`);
      console.error(
        "Available GEMINI env vars:",
        Object.keys(process.env).filter((k) => k.includes("GEMINI"))
      );
      return res.status(HTTP_STATUS_CODES[errorType]).json(createErrorResponse(errorType));
    }

    // Build analysis prompt
    const analysisPrompt = `You are an expert technical recruiter analyzing a resume against a job description.

JOB DESCRIPTION:
${jobDesc}

RESUME CONTENT:
${resume}

Provide a detailed analysis with the following sections:

1. **TECH RECRUITER PERSONA** - Describe the ideal candidate persona for this role based purely on technical requirements.

2. **COMPATIBILITY SCORE** - Provide a score from 0-100 indicating how well the resume matches the job description. Consider:
   - Technical skills alignment
   - Experience level match
   - Educational requirements
   - Job-specific knowledge

3. **STRENGTHS** - Bulleted list of resume strengths that align with the job requirements.

4. **GAPS & IMPROVEMENTS** - Specific, actionable improvements to better align the resume with the job requirements:
   - Missing technical skills to highlight or develop
   - Experience gaps
   - Certifications or credentials to pursue
   - Suggested resume wording improvements

5. **REFINED SUMMARY** - Provide an improved resume summary/objective that better positions the candidate for this role.

Format your response as clear, structured markdown.`;

    // Generate analysis
    const analysisText = await generateAnalysis(analysisPrompt, primaryApiKey, fallbackApiKey);

    if (!analysisText) {
      errorType = ERROR_TYPES.ANALYSIS_FAILED;
      return res.status(HTTP_STATUS_CODES[errorType]).json(createErrorResponse(errorType));
    }

    // Success response
    return res.status(200).json({
      success: true,
      report: analysisText,
      usedModel: "gemini-2.0-flash",
    });
  } catch (error: any) {
    // Determine error type from exception
    const errorMessage = error?.message || "";

    switch (true) {
      case isApiKeyError(errorMessage):
        errorType = ERROR_TYPES.API_KEY_INVALID;
        console.error(`${errorType}:`, errorMessage);
        break;
      case errorMessage.includes("analysis") || errorMessage.includes("generate"):
        errorType = ERROR_TYPES.ANALYSIS_FAILED;
        console.error(`${errorType}:`, errorMessage);
        break;
      default:
        errorType = ERROR_TYPES.INTERNAL_ERROR;
        console.error(`${errorType}:`, errorMessage);
    }

    return res.status(HTTP_STATUS_CODES[errorType]).json({
      success: false,
      error: ERROR_MESSAGES[errorType],
    });
  }
}
