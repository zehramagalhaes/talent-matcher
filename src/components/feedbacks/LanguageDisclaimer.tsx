import { Card, CardContent, Stack, Box, Typography, Divider, alpha, useTheme } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";

interface LanguageDisclaimerProps {
  title: string;
  body: string;
}

export const LanguageDisclaimer = ({ title, body }: LanguageDisclaimerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        p: 1,
        borderRadius: 4,
        bgcolor: alpha(theme.palette.background.paper, 0.4),
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center">
          <Box sx={{ flexShrink: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight={800}
              sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
            >
              <LanguageIcon fontSize="small" color="primary" /> {title}
            </Typography>
            <LanguageToggle />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.7, fontWeight: 500 }}
          >
            <strong>{t("home.disclaimer.title")}</strong> {body}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
