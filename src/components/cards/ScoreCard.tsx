import { Box, Paper, Typography } from "@mui/material";
import { alpha, PaletteColor } from "@mui/material/styles";

export interface ScoreCardProps {
  score: number;
  viewType: string;
  status: PaletteColor;
}

export const ScoreCard = ({ score, viewType, status }: ScoreCardProps) => (
  <Paper
    elevation={8}
    sx={{
      p: 4,
      textAlign: "center",
      borderRadius: 6,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: status.contrastText,
      background: `linear-gradient(135deg, ${status.main} 0%, ${status.dark} 100%)`,
      boxShadow: `0 12px 30px ${alpha(status.main, 0.4)}`,
    }}
  >
    <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.9, letterSpacing: 2 }}>
      {viewType}
    </Typography>
    <Typography variant="h1" sx={{ fontWeight: 900, my: 1, fontSize: "4.5rem" }}>
      {score}%
    </Typography>
    <Box
      sx={{
        width: "100%",
        height: 10,
        bgcolor: alpha("#fff", 0.2),
        borderRadius: 5,
        mt: 2,
        maxWidth: 200,
      }}
    >
      <Box sx={{ width: `${score}%`, height: "100%", bgcolor: "currentColor", borderRadius: 5 }} />
    </Box>
  </Paper>
);
