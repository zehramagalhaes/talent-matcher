import { alpha, Box, Typography } from "@mui/material";

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 4 }}>
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 800,
        color: "primary.main",
        borderBottom: "2px solid",
        borderColor: (t) => alpha(t.palette.primary.main, 0.2),
        pb: 0.5,
        mb: 2,
        letterSpacing: 1.5,
        textTransform: "uppercase",
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);
