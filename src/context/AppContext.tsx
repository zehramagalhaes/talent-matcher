import React, { createContext, useMemo, ReactNode } from "react";
import { getApiBaseUrl } from "@/utils/api";

interface AppContextProps {
  /**
   * The base URL for the API.
   */
  baseUrl: string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Global App Provider for configuration and shared state.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => {
    return {
      baseUrl: getApiBaseUrl(),
    };
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
