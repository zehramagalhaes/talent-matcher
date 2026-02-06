import React from "react";
import { Modal, Backdrop, Fade, Box, Stack, Typography, Button } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

interface Props {
  keyword: string | null;
  strategy: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ImprovementModal: React.FC<Props> = ({ keyword, strategy, onClose, onConfirm }) => (
  <Modal open={!!keyword} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
    <Fade in={!!keyword}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <AutoFixHighIcon color="secondary" sx={{ fontSize: 40 }} />
          <Typography variant="h6" fontWeight="bold">
            Apply to {strategy} Resume?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adding <strong>{keyword}</strong> will tailor your skills section and increase the match
            score for this version.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ width: "100%", mt: 2 }}>
            <Button fullWidth variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button fullWidth variant="contained" onClick={onConfirm}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Fade>
  </Modal>
);
