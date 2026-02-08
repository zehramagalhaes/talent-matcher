import { Box, Button, CircularProgress, Typography, alpha, useTheme, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface StatusCheck {
  label: string;
  completed: boolean;
}

interface UploadFormFooterProps {
  checks: StatusCheck[];
  onSubmit: () => void;
  isLoading: boolean;
  isValid: boolean;
  submitLabel: string;
  loadingLabel: string;
}

export const UploadFormFooter = ({
  checks,
  onSubmit,
  isLoading,
  isValid,
  submitLabel,
  loadingLabel,
}: UploadFormFooterProps) => {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      sx={{
        mt: 4,
        p: { xs: 2, md: 3 },
        borderRadius: 5,
        bgcolor: alpha(theme.palette.background.paper, 0.3),
        border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
      }}
    >
      {/* STATUS INDICATORS */}
      <Stack direction="row" spacing={4} sx={{ px: 1 }}>
        {checks.map((check, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 22,
                color: check.completed ? "success.main" : "action.disabled",
                transition: "all 0.3s ease",
              }}
            />
            <Typography
              variant="body2"
              fontWeight={800}
              color={check.completed ? "textPrimary" : "textSecondary"}
            >
              {check.label}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* ACTION BUTTON */}
      <Button
        variant="contained"
        size="large"
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
        sx={{
          px: 6,
          py: 1.5,
          borderRadius: 4,
          fontWeight: 900,
          textTransform: "none",
          fontSize: "1rem",
          color: "common.white",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
          },
          "&.Mui-disabled": {
            color: alpha(theme.palette.common.white, 0.5),
            background: alpha(theme.palette.primary.main, 0.3),
          },
        }}
      >
        {isLoading ? loadingLabel : submitLabel}
      </Button>
    </Stack>
  );
};
