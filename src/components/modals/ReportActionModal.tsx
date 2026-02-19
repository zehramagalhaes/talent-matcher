import { useTranslation } from "@/hooks/useTranslation";
import {
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";

interface ReportActionModalProps {
  open: boolean;
  onClose: () => void;
  onRecover: () => void;
  onFresh: () => void;
}

export const ReportActionModal = ({
  open,
  onClose,
  onRecover,
  onFresh,
}: ReportActionModalProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 6,
            p: 1,
            backdropFilter: "blur(10px)",
            bgcolor: alpha(theme.palette.background.paper, 0.9),
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>
        {t("modal.update_submission.title")}
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{t("modal.update_submission.description")}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onFresh} color="inherit" sx={{ fontWeight: 800 }}>
          {t("common.start_fresh")}
        </Button>
        <Button onClick={onRecover} variant="contained" sx={{ borderRadius: 3, fontWeight: 900 }}>
          {t("common.edit_current")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
