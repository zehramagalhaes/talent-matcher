/**
 * Returns the base URL for the API based on environment configuration.
 *
 * Priorities:
 * 1. NEXT_PUBLIC_API_BASE_URL environment variable (if defined)
 * 2. In production: Fallback to relative "/api" (safest for generic same-origin setups)
 * 3. In development: Fallback to "http://localhost:3001/api" (default backend port)
 */
export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (process.env.NODE_ENV === "production") {
    // Relative path for production to avoid hardcoded host
    return "/api";
  }

  // Development default
  return "http://localhost:3001/api";
};
