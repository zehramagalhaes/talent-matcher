import React from "react";
import { Box, Typography, Card, alpha, useTheme, Button, Stack } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import LightbulbIcon from "@mui/icons-material/LightbulbOutlined";
import { ExperienceBridgeSuggestion } from "@/models/ResumeAnalysis.models";
import { useTranslation } from "@/hooks/useTranslation";

interface SuggestionCardProps {
  item: ExperienceBridgeSuggestion;
  isAdded: boolean;
  onAdd: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ item, isAdded, onAdd }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const accent = isAdded ? theme.palette.success.main : theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(accent, 0.1),
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: isAdded
          ? alpha(theme.palette.success.main, 0.02)
          : alpha(theme.palette.background.paper, 0.7),
        "&:hover": {
          transform: isAdded ? "none" : "translateY(-4px)",
          boxShadow: `0 12px 24px -10px ${alpha(accent, 0.3)}`,
          borderColor: alpha(accent, 0.5),
          // Target the button inside the card on card hover
          "& .MuiButton-root": !isAdded
            ? {
                bgcolor: accent,
                color: "#fff",
                "& .MuiButton-startIcon": {
                  color: "inherit",
                },
              }
            : {},
        },
      }}
    >
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            color: accent,
            bgcolor: alpha(accent, 0.1),
            px: 1,
            py: 0.3,
            borderRadius: 1,
            mb: 1.5,
            display: "inline-block",
            fontSize: "0.65rem",
            letterSpacing: 0.5,
          }}
        >
          {item.context}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 16, color: "warning.main", mt: 0.2 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {item.instruction}
          </Typography>
        </Stack>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            fontStyle: "italic",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 1.5 }}
          >
            &quot;{item.applied_experience}&quot;
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          size="small"
          variant={isAdded ? "text" : "contained"}
          color={isAdded ? "success" : "primary"}
          startIcon={isAdded ? <CheckIcon /> : <AddCircleOutlineIcon />}
          disabled={isAdded}
          onClick={onAdd}
          sx={{
            borderRadius: 2,
            fontWeight: 800,
            py: 1,
            textTransform: "none",
            fontSize: "0.75rem",
            transition: "0.2s",
            // Initial icon state
            "& .MuiButton-startIcon": {
              transition: "0.2s",
            },
          }}
        >
          {isAdded
            ? t("dashboard.experience.bridge_added_status")
            : t("dashboard.experience.bridge_add_button")}
        </Button>
      </Box>
    </Card>
  );
};
