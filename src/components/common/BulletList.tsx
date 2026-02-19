import React from "react";
import { Box, Typography } from "@mui/material";

interface BulletListProps {
  items: string[];
}

export const BulletList: React.FC<BulletListProps> = ({ items }) => {
  return (
    <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
      {items.map((item, index) => (
        <Box
          key={index}
          component="li"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 0.8,
          }}
        >
          <Typography
            component="span"
            sx={{
              mr: 1.5,
              color: "primary.text",
              fontWeight: "bold",
              fontSize: "1.1rem",
              lineHeight: 1.4,
              userSelect: "none",
            }}
          >
            •
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
