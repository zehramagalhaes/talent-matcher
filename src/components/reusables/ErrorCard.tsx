import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Button,
  Tooltip,
  alpha,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface ErrorCardProps {
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const formattedError = {
    status: "Analysis Failed",
    timestamp: new Date().toISOString(),
    details: message,
  };

  const handleCopyError = () => {
    navigator.clipboard.writeText(JSON.stringify(formattedError, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 6,
        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        background: alpha(theme.palette.error.main, 0.02),
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: theme.palette.error.main,
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3} justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                p: 1,
                borderRadius: 2,
                display: "flex",
              }}
            >
              <ErrorOutlineIcon color="error" fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.error.dark }}>
                {t("error.card.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("error.card.subtitle")}
              </Typography>
            </Box>
          </Box>

          <Tooltip title={copied ? t("common.copied") : t("error.card.copy_tooltip")}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyError}
              sx={{ borderRadius: 2, fontWeight: 700, px: 2 }}
            >
              {copied ? t("common.copied") : t("common.copy")}
            </Button>
          </Tooltip>
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 2, fontWeight: 600, color: theme.palette.error.main }}
        >
          {t("error.card.technical_details")}
        </Typography>

        {/* REPLACED SyntaxHighlighter with a native MUI styled Box */}
        <Box
          component="pre"
          sx={{
            margin: 0,
            padding: "20px",
            fontSize: "0.85rem",
            fontFamily: "'Fira Code', 'Roboto Mono', monospace",
            borderRadius: 4,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.black, 0.4)
                : alpha(theme.palette.common.white, 0.8),
            color: theme.palette.text.primary,
            // Styling the JSON keys vs values manually via CSS if needed,
            // but plain text is safer for builds.
            "& .json-key": { color: theme.palette.primary.main },
            "& .json-string": { color: theme.palette.success.main },
          }}
        >
          {JSON.stringify(formattedError, null, 2)}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ErrorCard;
