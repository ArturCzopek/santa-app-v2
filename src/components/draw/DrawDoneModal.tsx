import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { ContentCopy, IosShare } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useShareMessage } from '../../hooks/useShareMessage';
import Postcard from '../common/Postcard';
import { eventSummary } from './EventDetails';
import { postcardActionsSx, postcardDialogSx } from './InviteDrawModal';
import { Draw } from '../../models/Draw';
import { tokens } from '../../styles/theme';

interface DrawDoneModalProps {
  open: boolean;
  onClose: () => void;
  draw: Draw;
}

// Right after the draw the envelopes are ready, but nobody knows it yet.
// The organizer gets a ready message for the group chat, like the invite.
const DrawDoneModal: React.FC<DrawDoneModalProps> = ({
  open,
  onClose,
  draw,
}) => {
  const { t, i18n } = useTranslation();
  const { canShare, share, copy } = useShareMessage();

  const drawLink = `${import.meta.env.VITE_APP_URL}/#/draw/${draw.id ?? ''}`;
  const event = eventSummary(draw.eventDate, draw.eventPlace, i18n.language);
  const postcardTitle = t('drawPage.drawDone.postcardTitle');
  const message = [
    t('drawPage.drawDone.message.done', { name: draw.drawName }),
    t('drawPage.drawDone.message.open', { link: drawLink }),
    t('drawPage.inviteModal.message.budget', {
      budget: draw.budget,
      currency: draw.currency,
    }),
    ...(event
      ? [t('drawPage.inviteModal.message.event', { when: event })]
      : []),
    t('drawPage.drawDone.message.secret'),
  ].join('\n');
  const sentText = `${postcardTitle}\n${message}`;
  const copied = t('drawPage.drawDone.copied');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={postcardDialogSx}
    >
      <DialogTitle>{t('drawPage.drawDone.title')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>{t('drawPage.drawDone.description')}</Typography>
        <Postcard title={postcardTitle} message={message} />
      </DialogContent>
      <DialogActions sx={postcardActionsSx}>
        {canShare ? (
          <Button
            variant="contained"
            startIcon={<IosShare />}
            onClick={() => share(draw.drawName, sentText, copied, drawLink)}
          >
            {t('drawPage.inviteModal.share')}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={() => copy(sentText, copied, drawLink)}
          >
            {t('drawPage.drawDone.copyMessage')}
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: tokens.ink }}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawDoneModal;
