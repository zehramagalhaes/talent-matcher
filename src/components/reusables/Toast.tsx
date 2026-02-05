import { Snackbar, Alert } from "@mui/material";

export type ToastSeverity = "success" | "error" | "warning" | "info";

interface ToastProps {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ open, message, severity, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Toast;
