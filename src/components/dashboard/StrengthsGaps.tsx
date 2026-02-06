import React from "react";
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface StrengthsGapsProps {
  strengths: string[];
  gaps: string[];
}

export const StrengthsGaps: React.FC<StrengthsGapsProps> = ({ strengths, gaps }) => {
  const theme = useTheme(); // Access theme for mode-specific alpha values

  const renderSection = (title: string, items: string[], isStrength: boolean) => {
    const color = isStrength ? theme.palette.success.main : theme.palette.error.main;
    const Icon = isStrength ? CheckCircleIcon : ErrorIcon;

    return (
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: "100%",
            borderRadius: 3,
            border: "1px solid",
            // Subtle theme-aware borders
            borderColor: alpha(color, 0.3),
            // Light tint for background to indicate status without visual noise
            bgcolor: theme.palette.mode === "dark" ? alpha(color, 0.05) : alpha(color, 0.02),
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              borderColor: alpha(color, 0.5),
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: color, // Direct use of theme status colors
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            <Icon fontSize="medium" /> {title}
          </Typography>

          <List sx={{ p: 0 }}>
            {items.map((item, index) => (
              <ListItem
                key={index}
                disableGutters
                sx={{
                  alignItems: "flex-start",
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: alpha(color, 0.6),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: {
                      lineHeight: 1.6,
                      color: "text.primary",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    );
  };

  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      {renderSection("Key Strengths", strengths, true)}
      {renderSection("Identified Gaps", gaps, false)}
    </Grid>
  );
};
