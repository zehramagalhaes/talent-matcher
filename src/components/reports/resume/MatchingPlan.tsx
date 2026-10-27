import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKeys } from "@/locales/translations";

const statusColor = {
  supported: "success",
  partial: "warning",
  missing: "error",
} as const;

export const MatchingPlan: React.FC<{ data: AnalyzeReportResult }> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={800}>{t("dashboard.matchingPlan.title")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {(data.matching_plan || []).map((item, index) => (
            <Box key={`${item.requirement}-${index}`}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip
                  size="small"
                  color={statusColor[item.status]}
                  label={t(`dashboard.matchingPlan.${item.status}` as TranslationKeys)}
                />
                <Typography fontWeight={700}>{item.requirement}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.category}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {item.rationale}
              </Typography>
              {item.evidence.map((excerpt, evidenceIndex) => (
                <Typography
                  key={`${index}-${evidenceIndex}`}
                  variant="body2"
                  sx={{ mt: 0.5, pl: 2 }}
                >
                  “{excerpt}”
                </Typography>
              ))}
            </Box>
          ))}
          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              {t("dashboard.matchingPlan.sections")}
            </Typography>
            {(data.section_decisions || []).map((decision, index) => (
              <Typography key={`${decision.section}-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                <strong>{decision.section}</strong> ·{" "}
                {t(`dashboard.matchingPlan.${decision.action}` as TranslationKeys)} —{" "}
                {decision.reason}
              </Typography>
            ))}
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
