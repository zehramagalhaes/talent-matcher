// ===== Error Constants =====
export const ERROR_TYPES = {
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  INVALID_RESUME: "INVALID_RESUME",
  INVALID_JOB_DESC: "INVALID_JOB_DESC",
  API_KEY_MISSING: "API_KEY_MISSING",
  API_KEY_INVALID: "API_KEY_INVALID",
  ANALYSIS_FAILED: "ANALYSIS_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const ERROR_MESSAGES = {
  [ERROR_TYPES.METHOD_NOT_ALLOWED]: "Only POST requests are allowed",
  [ERROR_TYPES.INVALID_RESUME]: "Resume content is required and must be a string",
  [ERROR_TYPES.INVALID_JOB_DESC]: "Job description is required and must be a string",
  [ERROR_TYPES.API_KEY_MISSING]:
    "API Key not configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_ALT environment variable",
  [ERROR_TYPES.API_KEY_INVALID]: "API key is invalid or expired",
  [ERROR_TYPES.ANALYSIS_FAILED]: "Failed to generate analysis",
  [ERROR_TYPES.INTERNAL_ERROR]: "Internal server error",
} as const;

export const HTTP_STATUS_CODES = {
  [ERROR_TYPES.METHOD_NOT_ALLOWED]: 405,
  [ERROR_TYPES.INVALID_RESUME]: 400,
  [ERROR_TYPES.INVALID_JOB_DESC]: 400,
  [ERROR_TYPES.API_KEY_MISSING]: 500,
  [ERROR_TYPES.API_KEY_INVALID]: 500,
  [ERROR_TYPES.ANALYSIS_FAILED]: 500,
  [ERROR_TYPES.INTERNAL_ERROR]: 500,
} as const;
