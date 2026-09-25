import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { ContentCopy, IosShare } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotify } from '../../hooks/useNotify';
import { useShareMessage } from '../../hooks/useShareMessage';
import { drawService } from '../../services/DrawService';
import { eventSummary } from './EventDetails';
import Postcard from '../common/Postcard';
import { Draw } from '../../models/Draw';
import { tokens } from '../../styles/theme';

interface InviteDrawModalProps {
  open: boolean;
  onClose: () => void;
  draw: Draw;
  isOwner: boolean;
  justCreated?: boolean;
}

// Phones need the room for the whole postcard.
export const postcardDialogSx: SxProps<Theme> = {
  '& .MuiDialog-paper': {
    m: { xs: 2, sm: 4 },
    width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
  },
};

export const postcardActionsSx: SxProps<Theme> = {
  px: 3,
  pb: 2,
  pt: 0,
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 1,
  '& > :not(style) ~ :not(style)': { ml: 0 },
};

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
  const { t, i18n } = useTranslation();
  const notify = useNotify();
  const { canShare, share, copy } = useShareMessage();
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
  const event = eventSummary(draw.eventDate, draw.eventPlace, i18n.language);
  const postcardTitle = t('drawPage.inviteModal.postcardTitle');
  const message = [
    t('drawPage.inviteModal.message.greeting', { name: draw.drawName }),
    t('drawPage.inviteModal.message.budget', {
      budget: draw.budget,
      currency: draw.currency,
    }),
    ...(event
      ? [t('drawPage.inviteModal.message.event', { when: event })]
      : []),
    t('drawPage.inviteModal.message.link', { link: inviteLink }),
    ...(inviteKey
      ? []
      : [t('drawPage.inviteModal.message.passwordSeparately')]),
    inviteKey
      ? t('drawPage.inviteModal.message.howToJoin')
      : t('drawPage.inviteModal.message.howToJoinWithPassword'),
  ].join('\n');
  // What is sent is what the postcard shows, greeting included.
  const sentText = `${postcardTitle}\n${message}`;
  const messageCopied = t('drawPage.inviteModal.messageCopied');

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={postcardDialogSx}
    >
      <DialogTitle>
        {justCreated
          ? t('drawPage.inviteModal.titleAfterCreate')
          : t('drawPage.inviteButton')}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>{t('drawPage.inviteModal.description')}</Typography>

        <Postcard title={postcardTitle} message={loading ? null : message} />

        {!loading && (
          <Typography sx={{ color: tokens.amber, fontWeight: 700 }}>
            {inviteKey
              ? t('drawPage.inviteModal.keyWarning')
              : t('drawPage.inviteModal.passwordNotIncluded')}
          </Typography>
        )}

        {/* The password is still needed to start the draw. */}
        {justCreated && isOwner && (
          <Typography sx={{ fontWeight: 700 }}>
            {t('drawPage.inviteModal.passwordReminder')}
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
      <DialogActions sx={postcardActionsSx}>
        {canShare ? (
          <Button
            variant="contained"
            startIcon={<IosShare />}
            disabled={loading}
            onClick={() =>
              share(draw.drawName, sentText, messageCopied, inviteLink)
            }
          >
            {t('drawPage.inviteModal.share')}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            disabled={loading}
            onClick={() => copy(sentText, messageCopied, inviteLink)}
          >
            {t('drawPage.inviteModal.copyMessage')}
          </Button>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            startIcon={<ContentCopy />}
            disabled={loading}
            onClick={() =>
              copy(inviteLink, t('drawPage.inviteModal.linkCopied'), inviteLink)
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
