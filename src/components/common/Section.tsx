import React from "react";
import { Box, Typography, alpha } from "@mui/material";
import { GEN_CONFIG } from "@/utils/generate/resumeGenerator.utils";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="overline"
        sx={{
          display: "block",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          color: "primary.main",
          mb: 0.5,
        }}
      >
        {title.toUpperCase()}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "1px",
          bgcolor: alpha(`#${GEN_CONFIG.COLORS.DIVIDER}`, 0.6),
          mb: 2.5,
        }}
      />

      <Box sx={{ px: 0.5 }}>{children}</Box>
    </Box>
  );
};
