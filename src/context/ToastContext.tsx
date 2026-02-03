import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, severity: ToastSeverity, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, severity: ToastSeverity, duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, message, severity, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);

        return () => clearTimeout(timer);
      }
    },
    [removeToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
