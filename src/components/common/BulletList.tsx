import { Box, Typography } from "@mui/material";

export const BulletList = ({ items }: { items: string[] }) => (
  <Box component="ul" sx={{ pl: 2, m: 0, color: "text.secondary" }}>
    {items.map((text, i) => (
      <Typography component="li" key={i} variant="body2" sx={{ lineHeight: 1.7 }}>
        {text}
      </Typography>
    ))}
  </Box>
);
