import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { drawService } from '../../services/DrawService';
import PasswordField from '../form/PasswordField';
import { tokens } from '../../styles/theme';

interface StartDrawModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  drawId: string;
  // People who have not written their letter yet.
  withoutWish?: string[];
}

const StartDrawModal: React.FC<StartDrawModalProps> = ({
  open,
  onClose,
  onConfirm,
  drawId,
  withoutWish = [],
}) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password) {
      setError(t('createPage.validation.passwordRequired'));
      return;
    }

    setIsChecking(true);
    try {
      if (!(await drawService.isDrawPasswordValid(drawId, password))) {
        setError(t('drawPage.startDraw.incorrectPassword'));
        return;
      }
    } finally {
      setIsChecking(false);
    }

    setError('');
    onConfirm();
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { component: 'form', onSubmit: handleConfirm } }}
    >
      <DialogTitle>{t('drawPage.startDrawButton')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DialogContentText sx={{ color: tokens.ink }}>
          {t('drawPage.startDraw.confirmationText')}
        </DialogContentText>

        {withoutWish.length > 0 && (
          <DialogContentText sx={{ color: tokens.amber, fontWeight: 700 }}>
            {t('drawPage.startDraw.withoutWish', {
              count: withoutWish.length,
              names: withoutWish.join(', '),
            })}
          </DialogContentText>
        )}

        <PasswordField
          label={t('createPage.password')}
          value={password}
          onChange={(value) => {
            setPassword(value);
            setError('');
          }}
          error={error}
          autoFocus
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: tokens.ink }}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isChecking} variant="contained">
          {t('drawPage.startDraw.drawButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartDrawModal;
