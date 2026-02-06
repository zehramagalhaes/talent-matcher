import React, { useState } from "react";
import { Box, Typography, Card, Stack, alpha, useTheme, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/LightbulbOutlined";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  suggestions: { context: string; suggestion: string }[];
  onAdd: (suggestion: string) => void;
}

const ExperienceBridge: React.FC<Props> = ({ suggestions, onAdd }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [addedItems, setAddedItems] = useState<number[]>([]);

  if (!suggestions || suggestions.length === 0) return null;

  const handleAddAction = (suggestion: string, index: number) => {
    onAdd(suggestion);
    setAddedItems((prev) => [...prev, index]);
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1 }}
      >
        <AssignmentLateIcon color="warning" />
        {t("dashboard.experience.bridge_title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("dashboard.experience.bridge_description")}
      </Typography>

      <Stack spacing={2}>
        {suggestions.map((item, index) => {
          const isAdded = addedItems.includes(index);
          return (
            <Card
              key={index}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                borderLeft: `4px solid`,
                borderColor: isAdded ? "success.main" : "warning.main",
                bgcolor: isAdded
                  ? alpha(theme.palette.success.main, 0.05)
                  : alpha(theme.palette.warning.main, 0.05),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: isAdded ? "success.dark" : "warning.dark",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  {t("dashboard.experience.bridge_focus_area").replace("{context}", item.context)}
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <LightbulbIcon
                    sx={{ fontSize: 18, mt: 0.3, color: isAdded ? "success.main" : "warning.main" }}
                  />
                  <Typography variant="body2" sx={{ fontStyle: "italic", lineHeight: 1.6 }}>
                    &quot;{item.suggestion}&quot;
                  </Typography>
                </Box>
              </Box>

              <Button
                size="small"
                variant={isAdded ? "text" : "outlined"}
                color={isAdded ? "success" : "warning"}
                startIcon={isAdded ? <CheckIcon /> : <AddCircleOutlineIcon />}
                disabled={isAdded}
                onClick={() => handleAddAction(item.suggestion, index)}
                sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {isAdded
                  ? t("dashboard.experience.bridge_added_status")
                  : t("dashboard.experience.bridge_add_button")}
              </Button>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ExperienceBridge;
