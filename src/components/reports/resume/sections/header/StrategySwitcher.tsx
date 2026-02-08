import { ToggleButtonGroup, ToggleButton, Chip, alpha, useTheme } from "@mui/material";
import { ResumeData } from "@/api/analyze/schema";

export interface StrategySwitcherProps {
  value: "compact" | "detailed";
  onChange: (val: "compact" | "detailed") => void;
  compactData: ResumeData;
  detailedData: ResumeData;
  disabled?: boolean;
}

const getBulletCount = (res: ResumeData) => {
  if (!res?.experience) return 0;
  return res.experience.reduce(
    (acc, exp) => acc + (exp.bullets_primary?.length || 0) + (exp.bullets_optional?.length || 0),
    0
  );
};

export const StrategySwitcher = ({
  value,
  onChange,
  compactData,
  detailedData,
  disabled,
}: StrategySwitcherProps) => {
  const theme = useTheme();

  const renderOption = (strategy: "compact" | "detailed", label: string, data: ResumeData) => (
    <ToggleButton value={strategy}>
      {label}
      <Chip
        label={getBulletCount(data)}
        size="small"
        sx={{
          ml: 1.5,
          height: 20,
          fontWeight: 900,
          fontSize: "0.7rem",
          bgcolor: value === strategy ? alpha(theme.palette.primary.main, 0.1) : "transparent",
          color: value === strategy ? "primary.main" : "inherit",
          border: value === strategy ? "none" : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      />
    </ToggleButton>
  );

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, v) => v && onChange(v)}
      disabled={disabled}
      sx={{
        bgcolor: alpha(theme.palette.action.disabledBackground, 0.05),
        p: 0.5,
        borderRadius: 3.5,
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: 3,
          fontWeight: 800,
          px: { xs: 2, sm: 4 },
          py: 1,
          textTransform: "none",
          transition: "all 0.25s ease",
          "&.Mui-selected": {
            bgcolor: "background.paper",
            boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.08)}`,
            color: "primary.main",
          },
        },
      }}
    >
      {renderOption("compact", "Compact", compactData)}
      {renderOption("detailed", "Detailed", detailedData)}
    </ToggleButtonGroup>
  );
};
