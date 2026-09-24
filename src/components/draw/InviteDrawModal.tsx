import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from '@mui/material';
import { ContentCopy, IosShare } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotify } from '../../hooks/useNotify';
import { drawService } from '../../services/DrawService';
import { Draw } from '../../models/Draw';
import { airmailStripes, handFont, tokens } from '../../styles/theme';

interface InviteDrawModalProps {
  open: boolean;
  onClose: () => void;
  draw: Draw;
  isOwner: boolean;
  justCreated?: boolean;
}

const canShare = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

// The invite as a postcard: a ready message with the link, the budget and
// how to join, sent with the phone's share sheet or copied for a group chat.
// The link carries a key that lets people in without the password.
const InviteDrawModal: React.FC<InviteDrawModalProps> = ({
  open,
  onClose,
  draw,
  isOwner,
  justCreated = false,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();
  const drawId = draw.id ?? '';
  // undefined while loading; null when there is no key (and we cannot make one).
  const [inviteKey, setInviteKey] = useState<string | null | undefined>();
  const [confirmRenew, setConfirmRenew] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const canMakeKey = isOwner && draw.status === 'WAITING_FOR_DRAW';

  useEffect(() => {
    if (!open || !drawId) return;
    let cancelled = false;

    (async () => {
      try {
        let key = await drawService.getInviteKey(drawId);
        // Draws from before invite links get one the first time it is needed.
        if (!key && canMakeKey) key = await drawService.renewInviteKey(drawId);
        if (!cancelled) setInviteKey(key);
      } catch (err) {
        console.error('Error loading the invite key:', err);
        if (!cancelled) setInviteKey(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, drawId, canMakeKey]);

  const handleRenew = async () => {
    setRenewing(true);
    try {
      setInviteKey(await drawService.renewInviteKey(drawId));
      notify(t('drawPage.inviteModal.renewed'), 'success');
    } catch (err) {
      console.error('Error renewing the invite key:', err);
      notify(t('drawPage.inviteModal.renewFailed'));
    } finally {
      setRenewing(false);
      setConfirmRenew(false);
    }
  };

  const handleClose = () => {
    setConfirmRenew(false);
    onClose();
  };

  const loading = inviteKey === undefined;
  const inviteLink = `${import.meta.env.VITE_APP_URL}/#/join/${drawId}${
    inviteKey ? `?k=${inviteKey}` : ''
  }`;
  const message = [
    t('drawPage.inviteModal.message.greeting', { name: draw.drawName }),
    t('drawPage.inviteModal.message.budget', {
      budget: draw.budget,
      currency: draw.currency,
    }),
    t('drawPage.inviteModal.message.link', { link: inviteLink }),
    ...(inviteKey
      ? []
      : [t('drawPage.inviteModal.message.passwordSeparately')]),
    inviteKey
      ? t('drawPage.inviteModal.message.howToJoin')
      : t('drawPage.inviteModal.message.howToJoinWithPassword'),
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
      onClose={handleClose}
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
        {justCreated
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
            {loading ? (
              <Box aria-hidden sx={{ mt: 1 }}>
                <Skeleton />
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            ) : (
              <Typography
                component="p"
                variant="body2"
                sx={{ whiteSpace: 'pre-line', mt: 1 }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Box>

        {!loading && (
          <Typography sx={{ color: tokens.amber, fontWeight: 700 }}>
            {inviteKey
              ? t('drawPage.inviteModal.keyWarning')
              : t('drawPage.inviteModal.passwordNotIncluded')}
          </Typography>
        )}

        {inviteKey && canMakeKey && (
          <Box>
            {confirmRenew ? (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('drawPage.inviteModal.renewConfirm')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    disabled={renewing}
                    onClick={handleRenew}
                    sx={{ color: tokens.ink }}
                  >
                    {t('drawPage.inviteModal.renewButton')}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setConfirmRenew(false)}
                    sx={{ color: tokens.ink }}
                  >
                    {t('common.cancel')}
                  </Button>
                </Box>
              </>
            ) : (
              <Button
                size="small"
                onClick={() => setConfirmRenew(true)}
                sx={{ color: tokens.ink, px: 0, textDecoration: 'underline' }}
              >
                {t('drawPage.inviteModal.renewLink')}
              </Button>
            )}
          </Box>
        )}
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
            disabled={loading}
            onClick={handleShare}
          >
            {t('drawPage.inviteModal.share')}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            disabled={loading}
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
            disabled={loading}
            onClick={() =>
              copy(inviteLink, t('drawPage.inviteModal.linkCopied'))
            }
            sx={{ color: tokens.ink, whiteSpace: 'nowrap' }}
          >
            {t('drawPage.inviteModal.copyLink')}
          </Button>
          <Button onClick={handleClose} sx={{ color: tokens.ink }}>
            {t('common.close')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDrawModal;
