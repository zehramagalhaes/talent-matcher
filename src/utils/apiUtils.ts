// ===== Helper Functions =====

import { ERROR_MESSAGES, ERROR_TYPES } from "@/constants/errors";

type ErrorResponse = {
  success: boolean;
  error: string;
};

/**
 * Check if an error is API key related
 */
export const isApiKeyError = (errorMessage: string): boolean => {
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
export const createErrorResponse = (errorType: keyof typeof ERROR_TYPES): ErrorResponse => {
  return {
    success: false,
    error: ERROR_MESSAGES[errorType],
  };
};

/**
 * Validate request method
 */
export const validateMethod = (method: string | undefined): boolean => {
  return method === "POST";
};
