import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  inputStyles,
  inputLabelStyles,
  errorStyles,
} from '../../styles/formStyles';
import {
  joinModalDialogStyles,
  joinModalTitleStyles,
  joinModalContentStyles,
  joinModalProceedButtonStyles,
} from '../../styles/joinDrawModalStyles';

interface JoinDrawModalProps {
  open: boolean;
  onClose: () => void;
}

const JoinDrawModal: React.FC<JoinDrawModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [drawCode, setDrawCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinDraw = () => {
    // Basic validation
    if (!drawCode.trim()) {
      setError(t('drawsPage.joinModal.codeRequired'));
      return;
    }

    navigate(`/join/${drawCode.trim()}`);
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
      PaperProps={{
        sx: joinModalDialogStyles,
      }}
    >
      <DialogTitle sx={joinModalTitleStyles}>
        {t('drawsPage.joinButton')}
      </DialogTitle>
      <DialogContent sx={joinModalContentStyles}>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            mb: 2,
          }}
        >
          {t('drawsPage.joinModal.description')}
        </Typography>

        <TextField
          label={t('drawsPage.joinModal.drawCodeLabel')}
          variant="outlined"
          fullWidth
          value={drawCode}
          onChange={(e) => {
            setDrawCode(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
          InputProps={{
            sx: inputStyles(theme),
          }}
          InputLabelProps={{
            sx: inputLabelStyles(theme),
          }}
          sx={errorStyles(theme)}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleJoinDraw}
            sx={joinModalProceedButtonStyles}
          >
            {t('drawsPage.joinModal.proceedButton')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default JoinDrawModal;
