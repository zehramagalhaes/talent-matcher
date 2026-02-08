import React, { useState } from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import { useTranslation } from "@/hooks/useTranslation";
import { SuggestionCard } from "@/components/cards/SuggestionCard";
import { ExperienceBridgeSuggestion } from "@/models/ResumeAnalysis.models";

interface ExperienceBridgeProps {
  suggestions: ExperienceBridgeSuggestion[];
  onAdd: (appliedText: string) => void;
}

const ExperienceBridge: React.FC<ExperienceBridgeProps> = ({ suggestions, onAdd }) => {
  const { t } = useTranslation();
  const [addedItems, setAddedItems] = useState<number[]>([]);

  if (!suggestions?.length) return null;

  return (
    <Box sx={{ my: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AssignmentLateIcon sx={{ color: "warning.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t("dashboard.experience.bridge_title")}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t("dashboard.experience.bridge_description")}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {suggestions.map((item, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={idx}>
            <SuggestionCard
              item={item}
              isAdded={addedItems.includes(idx)}
              onAdd={() => {
                onAdd(item.applied_experience);
                setAddedItems((p) => [...p, idx]);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExperienceBridge;
