import React, { useState } from "react";
import { Box, Typography, Grid2 as Grid, Stack } from "@mui/material";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import { useTranslation } from "@/hooks/useTranslation";
import { SuggestionCard } from "@/components/cards/SuggestionCard"; // Updated below
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
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Box sx={{ color: "warning.main", display: "flex", alignItems: "center" }}>
          <AssignmentLateIcon />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, fontSize: "1.1rem" }}>
          {t("dashboard.experience.bridge_title").toUpperCase()}
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
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
