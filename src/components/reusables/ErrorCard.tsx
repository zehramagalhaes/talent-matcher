import { Card, CardContent, Typography, Box, useTheme, Button, Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface ErrorCardProps {
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const formattedError = {
    error: message,
  };

  // Pick syntax highlighting style based on theme mode
  const syntaxStyle = theme.palette.mode === "dark" ? atomDark : prism;

  const handleCopyError = () => {
    navigator.clipboard.writeText(JSON.stringify(formattedError, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      sx={{
        mt: 3,
        boxShadow: 3,
        border: `1px solid ${theme.palette.error.main}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2} justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <ErrorOutlineIcon color="error" fontSize="large" />
            <Typography variant="h6" color="error">
              Compatibility Report
            </Typography>
          </Box>
          <Tooltip title={copied ? "Copied!" : "Copy error details"}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyError}
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </Tooltip>
        </Box>

        <SyntaxHighlighter
          language="json"
          style={syntaxStyle}
          customStyle={{
            borderRadius: "8px",
            padding: "16px",
            fontSize: "0.9rem",
            backgroundColor: theme.palette.background.default,
            overflow: "auto",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {JSON.stringify(formattedError, null, 2)}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
};

export default ErrorCard;
