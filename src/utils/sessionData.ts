const SENSITIVE_KEYS = ["resumeName", "resumeText", "resumeStructure", "jobText", "analysisResult"];

export function getSessionData(key: string): string | null {
  if (typeof window === "undefined") return null;
  const current = window.sessionStorage.getItem(key);
  if (current !== null) return current;

  // Move any prior localStorage cache into this tab, then remove the persistent copy.
  const legacy = window.localStorage.getItem(key);
  if (legacy !== null && SENSITIVE_KEYS.includes(key)) {
    window.sessionStorage.setItem(key, legacy);
    window.localStorage.removeItem(key);
    return legacy;
  }
  return null;
}

export function setSessionData(key: string, value: string): void {
  if (typeof window !== "undefined") window.sessionStorage.setItem(key, value);
}

export function removeSessionData(key: string): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(key);
    if (SENSITIVE_KEYS.includes(key)) window.localStorage.removeItem(key);
  }
}

export function clearSensitiveSessionData(): void {
  for (const key of SENSITIVE_KEYS) removeSessionData(key);
}
