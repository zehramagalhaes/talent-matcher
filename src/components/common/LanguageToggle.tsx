import React from "react";
import { ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";
import { useTranslation } from "@/hooks/useTranslation";
import { Locale } from "@/locales/translations";

export const LanguageToggle: React.FC = () => {
  const { locale, setLocale } = useTranslation();

  const handleLanguageChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLocale: Locale | null
  ) => {
    if (newLocale !== null) {
      setLocale(newLocale);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: "bold", color: "text.secondary", textTransform: "uppercase" }}
      >
        Language
      </Typography>
      <ToggleButtonGroup
        value={locale}
        exclusive
        onChange={handleLanguageChange}
        size="small"
        sx={{
          height: 32,
          "& .MuiToggleButton-root": {
            px: 2,
            fontWeight: "bold",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
          },
        }}
      >
        <ToggleButton value="pt">PT</ToggleButton>
        <ToggleButton value="en">EN</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
