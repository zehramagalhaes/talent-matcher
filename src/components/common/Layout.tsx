import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ReactNode } from "react";
import { useThemeContext } from "@/context/ThemeContext";

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        // Harmonic Mesh Gradient
        backgroundImage:
          mode === "dark"
            ? `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.dark, 0.15)} 0px, transparent 50%), 
           radial-gradient(at 100% 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 0px, transparent 50%),
           radial-gradient(at 50% 100%, ${alpha(theme.palette.primary.main, 0.05)} 0px, transparent 50%)`
            : `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.light, 0.4)} 0px, transparent 50%),
           radial-gradient(at 100% 100%, ${alpha(theme.palette.secondary.light, 0.2)} 0px, transparent 50%)`,
        backgroundAttachment: "fixed",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(20px)",
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: -1, color: "text.primary" }}
            >
              TALENT
              <Box component="span" sx={{ color: "primary.main" }}>
                MATCHER
              </Box>
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ color: "text.primary" }}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, display: "flex", py: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
