import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  showSantaModalDialogStyles,
  showSantaModalTitleStyles,
  showSantaModalButtonContainerStyles,
  showSantaModalCloseButtonStyles,
} from '../styles/showSantaModalStyles';
import YouTubeEmbed from './YouTubeEmbed';

const SANTA_VIDEOS = ['fGRQJ_ZKvvU', 'LPGTkkUx63M', 'z59gAXZ0ksQ'];

interface ShowSantaModalProps {
  open: boolean;
  onClose: () => void;
}

const ShowSantaModal: React.FC<ShowSantaModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [videoId, setVideoId] = useState<string>('');

  useEffect(() => {
    if (open) {
      // Select a random video from the list when modal opens
      const randomIndex = Math.floor(Math.random() * SANTA_VIDEOS.length);
      setVideoId(SANTA_VIDEOS[randomIndex]);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: showSantaModalDialogStyles,
      }}
    >
      <DialogTitle sx={showSantaModalTitleStyles}>
        {t('santaModal.title')} 🎅
      </DialogTitle>
      <DialogContent>
        {videoId && <YouTubeEmbed videoId={videoId} />}

        <Box sx={showSantaModalButtonContainerStyles}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={showSantaModalCloseButtonStyles(theme)}
          >
            {t('common.close')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShowSantaModal;