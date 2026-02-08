import { useTranslation } from "@/hooks/useTranslation";
import { Box, CircularProgress, Typography } from "@mui/material";

export const ReportLoadingState = ({ model }: { model: string }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10, gap: 3 }}>
      <CircularProgress size={60} thickness={4} />
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("loading.analyzing_with")?.replace("{model}", model)}
        </Typography>
        <Typography color="textSecondary">{t("loading.wait_message")}</Typography>
      </Box>
    </Box>
  );
};
