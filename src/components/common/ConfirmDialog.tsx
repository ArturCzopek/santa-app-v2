import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../styles/theme';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onClose: () => void;
  // The dialog stays open (with the button disabled) until this settles.
  onConfirm: () => Promise<void>;
}

// "Are you sure?" for actions that cannot be undone.
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  text,
  confirmLabel,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [working, setWorking] = useState(false);

  const handleConfirm = async () => {
    setWorking(true);
    try {
      await onConfirm();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={working ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: tokens.ink }}>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={working} sx={{ color: tokens.ink }}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" disabled={working} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
