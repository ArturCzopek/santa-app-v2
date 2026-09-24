import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { tokens } from '../../styles/theme';

interface JoinDrawModalProps {
  open: boolean;
  onClose: () => void;
}

// People paste the whole invite link more often than the bare code. The
// link's key is kept, so they do not need the password.
export const joinPathFrom = (input: string): string | null => {
  const trimmed = input.trim();
  const fromLink = trimmed.match(/\/join\/([^/?#\s]+)(?:\?k=([\w-]+))?/);
  if (fromLink) {
    return `/join/${fromLink[1]}${fromLink[2] ? `?k=${fromLink[2]}` : ''}`;
  }
  return trimmed ? `/join/${trimmed}` : null;
};

const JoinDrawModal: React.FC<JoinDrawModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [drawCode, setDrawCode] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJoinDraw = (event: React.FormEvent) => {
    event.preventDefault();
    const joinPath = joinPathFrom(drawCode);
    if (!joinPath) {
      setError(t('drawsPage.joinModal.codeRequired'));
      inputRef.current?.focus();
      return;
    }

    navigate(joinPath);
    onClose();
  };

  const handleClose = () => {
    setDrawCode('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { component: 'form', onSubmit: handleJoinDraw } }}
    >
      <DialogTitle>{t('drawsPage.joinButton')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DialogContentText sx={{ color: tokens.ink }}>
          {t('drawsPage.joinModal.description')}
        </DialogContentText>

        <TextField
          label={t('drawsPage.joinModal.drawCodeLabel')}
          fullWidth
          autoFocus
          inputRef={inputRef}
          value={drawCode}
          onChange={(e) => {
            setDrawCode(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: tokens.ink }}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained">
          {t('drawsPage.joinModal.proceedButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinDrawModal;
