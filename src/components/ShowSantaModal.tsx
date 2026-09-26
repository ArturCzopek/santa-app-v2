import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import YouTubeEmbed from './YouTubeEmbed';

const SANTA_VIDEOS = ['fGRQJ_ZKvvU', 'LPGTkkUx63M', 'z59gAXZ0ksQ'];

interface ShowSantaModalProps {
  open: boolean;
  onClose: () => void;
}

const ShowSantaModal: React.FC<ShowSantaModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [videoId, setVideoId] = useState<string>('');

  // Select a random video from the list when modal opens
  const handleOpening = () => {
    const randomIndex = Math.floor(Math.random() * SANTA_VIDEOS.length);
    setVideoId(SANTA_VIDEOS[randomIndex]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ transition: { onEnter: handleOpening } }}
    >
      <DialogTitle>{t('santaModal.title')} 🎅</DialogTitle>
      <DialogContent>
        {videoId && <YouTubeEmbed videoId={videoId} />}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowSantaModal;
