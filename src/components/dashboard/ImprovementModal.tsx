import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslation } from "@/hooks/useTranslation";

interface ModalProps {
  keyword: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ImprovementModal: React.FC<ModalProps> = ({ keyword, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: 6,
          p: 1,
          backdropFilter: "blur(10px)",
          bgcolor: alpha(theme.palette.background.paper, 0.9),
        },
      }}
      open={Boolean(keyword)}
      onClose={onClose}
    >
      <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>
        {t("modal.addSkill.title")}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t("modal.addSkill.body", { keyword: <strong>{keyword}</strong> })}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t("common.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{ borderRadius: 3, px: 3, fontWeight: 800 }}
        >
          {t("common.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
