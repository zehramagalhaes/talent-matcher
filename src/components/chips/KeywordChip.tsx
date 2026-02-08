import { AddCircleOutline, CheckCircle } from "@mui/icons-material";
import { alpha, Chip } from "@mui/material";
import { PaletteColor } from "@mui/material/styles";

interface KeywordChipProps {
  kw: string;
  isAdded: boolean;
  onAdd: (kw: string) => void;
  statusColor: PaletteColor;
}

export const KeywordChip = ({ kw, isAdded, onAdd, statusColor }: KeywordChipProps) => (
  <Chip
    label={kw}
    onClick={isAdded ? undefined : () => onAdd(kw)}
    icon={isAdded ? <CheckCircle /> : <AddCircleOutline />}
    disabled={isAdded}
    sx={{
      borderRadius: 2,
      fontWeight: 700,
      transition: "0.2s",
      bgcolor: (t) =>
        isAdded
          ? alpha(t.palette.action.disabled, 0.1)
          : alpha(statusColor.main, t.palette.mode === "dark" ? 0.2 : 0.1),
      border: `1px solid ${alpha(statusColor.main, 0.3)}`,
      // Ensure the icon initially takes the status color
      "& .MuiChip-icon": {
        color: isAdded ? "inherit" : statusColor.main,
        transition: "0.2s",
      },
      "&:hover": !isAdded
        ? {
            bgcolor: statusColor.main,
            color: "#fff",
            // Force the icon to inherit the white text color on hover
            "& .MuiChip-icon": {
              color: "inherit",
            },
          }
        : {},
    }}
  />
);
