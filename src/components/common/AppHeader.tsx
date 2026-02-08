import { Box, Typography } from "@mui/material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export const AppHeader = ({ title, description }: AppHeaderProps) => (
  <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 2 }}>
    <TipsAndUpdatesIcon sx={{ fontSize: "2.5rem", color: "primary.main" }} />
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
          {description}
        </Typography>
      )}
    </Box>
  </Box>
);
