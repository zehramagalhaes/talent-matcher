import { useContext } from "react";
import AppContext from "@/context/AppContext";

/**
 * Custom hook to access the context values provided by AppProvider.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
