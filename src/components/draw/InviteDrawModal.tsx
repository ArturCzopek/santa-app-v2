import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { ContentCopy, IosShare } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotify } from '../../hooks/useNotify';
import { Draw } from '../../models/Draw';
import { airmailStripes, handFont, tokens } from '../../styles/theme';

interface InviteDrawModalProps {
  open: boolean;
  onClose: () => void;
  draw: Draw;
  // Known only right after the draw is created: it is stored hashed.
  password?: string;
}

const canShare = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

// The invite as a postcard: a ready message with the link, the budget and
// how to join, sent with the phone's share sheet or copied for a group chat.
const InviteDrawModal: React.FC<InviteDrawModalProps> = ({
  open,
  onClose,
  draw,
  password,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();

  const inviteLink = `${import.meta.env.VITE_APP_URL}/#/join/${draw.id}`;
  const message = [
    t('drawPage.inviteModal.message.greeting', { name: draw.drawName }),
    t('drawPage.inviteModal.message.budget', {
      budget: draw.budget,
      currency: draw.currency,
    }),
    t('drawPage.inviteModal.message.link', { link: inviteLink }),
    password
      ? t('drawPage.inviteModal.message.password', { password })
      : t('drawPage.inviteModal.message.passwordSeparately'),
    t('drawPage.inviteModal.message.howToJoin'),
  ].join('\n');

  const copy = async (text: string, copied: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(copied, 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      notify(t('loginPage.inAppBrowser.copyFailed', { url: inviteLink }));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: draw.drawName, text: message });
    } catch (err) {
      // Closing the share sheet is not an error.
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Failed to share:', err);
      copy(message, t('drawPage.inviteModal.messageCopied'));
    }
  };

  const share = canShare();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      // Phones need the room for the whole postcard.
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 2, sm: 4 },
          width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
        },
      }}
    >
      <DialogTitle>
        {password
          ? t('drawPage.inviteModal.titleAfterCreate')
          : t('drawPage.inviteButton')}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>{t('drawPage.inviteModal.description')}</Typography>

        <Box
          sx={{
            p: '6px',
            borderRadius: '10px',
            background: airmailStripes,
          }}
        >
          <Box
            sx={{
              borderRadius: '5px',
              backgroundColor: '#FFFFFF',
              p: { xs: 1.5, sm: 2 },
              overflowWrap: 'anywhere',
            }}
          >
            <Typography
              sx={{ fontFamily: handFont, fontSize: '1.4rem', lineHeight: 1.1 }}
            >
              {t('drawPage.inviteModal.postcardTitle')}
            </Typography>
            <Typography
              component="p"
              variant="body2"
              sx={{ whiteSpace: 'pre-line', mt: 1 }}
            >
              {message}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ color: tokens.amber, fontWeight: 700 }}>
          {password
            ? t('drawPage.inviteModal.passwordOnlyNow')
            : t('drawPage.inviteModal.passwordNotIncluded')}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 0,
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 1,
          '& > :not(style) ~ :not(style)': { ml: 0 },
        }}
      >
        {share ? (
          <Button
            variant="contained"
            startIcon={<IosShare />}
            onClick={handleShare}
          >
            {t('drawPage.inviteModal.share')}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={() =>
              copy(message, t('drawPage.inviteModal.messageCopied'))
            }
          >
            {t('drawPage.inviteModal.copyMessage')}
          </Button>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            startIcon={<ContentCopy />}
            onClick={() =>
              copy(inviteLink, t('drawPage.inviteModal.linkCopied'))
            }
            sx={{ color: tokens.ink, whiteSpace: 'nowrap' }}
          >
            {t('drawPage.inviteModal.copyLink')}
          </Button>
          <Button onClick={onClose} sx={{ color: tokens.ink }}>
            {t('common.close')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDrawModal;
