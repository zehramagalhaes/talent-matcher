import { Box, Typography, Button, alpha, useTheme, Card, CardContent } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "@/hooks/useTranslation";

export const NoReportState = ({ onRedirect }: { onRedirect: () => void }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 6, md: 10 },
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 6,
          background: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: "blur(12px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        <CardContent sx={{ py: 5 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              mb: 3,
            }}
          >
            <SearchOffIcon sx={{ fontSize: 60 }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              mb: 2,
              letterSpacing: "-0.02em",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("report.empty.title")}
          </Typography>

          <Typography
            color="textSecondary"
            sx={{
              mb: 4,
              fontWeight: 500,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              px: { md: 4 },
            }}
          >
            {t("report.empty.description")}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onRedirect}
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 4,
              fontWeight: 900,
              px: 5,
              py: 2,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            {t("common.start_fresh")}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
