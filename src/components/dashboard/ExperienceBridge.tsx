import React, { useState } from "react";
import { Box, Typography, Card, Grid, alpha, useTheme, Button, Stack } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LightbulbIcon from "@mui/icons-material/LightbulbOutlined";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "@/hooks/useTranslation";

interface ExperienceBridgeSuggestion {
  context: string;
  instruction: string;
  applied_experience: string;
}

interface Props {
  suggestions: ExperienceBridgeSuggestion[];
  onAdd: (appliedText: string) => void;
}

const ExperienceBridge: React.FC<Props> = ({ suggestions, onAdd }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [addedItems, setAddedItems] = useState<number[]>([]);

  if (!suggestions || suggestions.length === 0) return null;

  const handleAddAction = (appliedText: string, index: number) => {
    onAdd(appliedText);
    setAddedItems((prev) => [...prev, index]);
  };

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}
        >
          <AssignmentLateIcon sx={{ color: "warning.main", fontSize: 22 }} />
          {t("dashboard.experience.bridge_title")}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t("dashboard.experience.bridge_description")}
        </Typography>
      </Box>

      {/* GRID LAYOUT */}
      <Grid container spacing={2}>
        {suggestions.map((item, index) => {
          const isAdded = addedItems.includes(index);
          const accentColor = isAdded ? theme.palette.success.main : theme.palette.primary.main;

          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: alpha(accentColor, 0.1),
                  bgcolor: isAdded
                    ? alpha(theme.palette.success.main, 0.02)
                    : alpha(theme.palette.background.paper, 0.7),
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: isAdded ? "none" : "translateY(-4px)",
                    boxShadow: `0 12px 24px -10px ${alpha(accentColor, 0.2)}`,
                    borderColor: alpha(accentColor, 0.4),
                  },
                }}
              >
                <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  {/* CONTEXT TAG */}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: accentColor,
                      bgcolor: alpha(accentColor, 0.1),
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      alignSelf: "flex-start",
                      mb: 1.5,
                      fontSize: "0.65rem",
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.context}
                  </Typography>

                  {/* INSTRUCTION */}
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <LightbulbIcon sx={{ fontSize: 16, color: "warning.main", mt: 0.2 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                      {item.instruction}
                    </Typography>
                  </Stack>

                  {/* QUOTE BOX */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.4),
                      border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      mb: 2,
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontStyle: "italic",
                        color: "text.secondary",
                        lineHeight: 1.5,
                        display: "block",
                      }}
                    >
                      &quot;{item.applied_experience}&quot;
                    </Typography>
                  </Box>
                </Box>

                {/* ACTION BUTTON AT BOTTOM */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant={isAdded ? "text" : "contained"}
                    color={isAdded ? "success" : "primary"}
                    startIcon={isAdded ? <CheckIcon /> : <AddCircleOutlineIcon />}
                    disabled={isAdded}
                    onClick={() => handleAddAction(item.applied_experience, index)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 800,
                      py: 1,
                      textTransform: "none",
                      fontSize: "0.75rem",
                      boxShadow: isAdded
                        ? "none"
                        : `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    {isAdded
                      ? t("dashboard.experience.bridge_added_status")
                      : t("dashboard.experience.bridge_add_button")}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ExperienceBridge;
