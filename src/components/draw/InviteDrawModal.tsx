import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotify } from '../../hooks/useNotify';
import { tokens } from '../../styles/theme';

interface InviteDrawModalProps {
  open: boolean;
  onClose: () => void;
  drawId: string;
}

const InviteDrawModal: React.FC<InviteDrawModalProps> = ({
  open,
  onClose,
  drawId,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();

  const APP_URL = import.meta.env.VITE_APP_URL;
  const inviteLink = `${APP_URL}/#/join/${drawId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      notify(t('drawPage.inviteModal.linkCopied'), 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      notify(t('loginPage.inAppBrowser.copyFailed', { url: inviteLink }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('drawPage.inviteButton')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DialogContentText sx={{ color: tokens.ink }}>
          {t('drawPage.inviteModal.descriptionPart1')}
        </DialogContentText>

        <TextField
          fullWidth
          label={t('drawPage.inviteModal.linkLabel')}
          value={inviteLink}
          slotProps={{ input: { readOnly: true } }}
          onFocus={(e) => e.target.select()}
        />

        <DialogContentText sx={{ color: tokens.amber, fontWeight: 700 }}>
          {t('drawPage.inviteModal.descriptionPart2')}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: tokens.ink }}>
          {t('common.close')}
        </Button>
        <Button
          variant="contained"
          startIcon={<ContentCopy />}
          onClick={handleCopyLink}
        >
          {t('drawPage.inviteModal.copyLink')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDrawModal;
