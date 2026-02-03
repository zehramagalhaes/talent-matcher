import { Stack, Alert, Snackbar } from "@mui/material";
import { useToast } from "../context/ToastContext";

const GlobalToasts: React.FC = () => {
  const { toasts, removeToast } = useToast();

  // Show single toast for simplicity, or use Stack for multiple
  if (toasts.length === 0) return null;

  // For multiple toasts, show them in a stack
  if (toasts.length > 1) {
    return (
      <Stack
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          gap: 1,
          maxWidth: 400,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <Alert
            key={toast.id}
            severity={toast.severity}
            onClose={() => removeToast(toast.id)}
            sx={{
              borderRadius: "24px",
              pointerEvents: "auto",
              boxShadow: 2,
              animation: "slideIn 0.3s ease-in-out",
              "@keyframes slideIn": {
                from: {
                  transform: "translateX(400px)",
                  opacity: 0,
                },
                to: {
                  transform: "translateX(0)",
                  opacity: 1,
                },
              },
            }}
          >
            {toast.message}
          </Alert>
        ))}
      </Stack>
    );
  }

  // Single toast using Snackbar for better appearance
  const toast = toasts[0];
  return (
    <Snackbar
      open={true}
      autoHideDuration={toast.duration || 4000}
      onClose={() => removeToast(toast.id)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={() => removeToast(toast.id)}
        severity={toast.severity}
        sx={{
          borderRadius: "24px",
          boxShadow: 2,
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToasts;
