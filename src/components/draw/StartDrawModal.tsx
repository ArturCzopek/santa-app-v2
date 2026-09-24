import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  inputStyles,
  inputLabelStyles,
  errorStyles,
} from '../../styles/formStyles';
import { drawService } from '../../services/DrawService';
import {
  startDrawModalDialogStyles,
  startDrawModalTitleStyles,
  startDrawModalDescriptionStyles,
  startDrawModalInputContainerStyles,
  startDrawModalButtonContainerStyles,
  startDrawModalCancelButtonStyles,
  startDrawModalConfirmButtonStyles,
} from '../../styles/startDrawModalStyles';

interface StartDrawModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  drawId: string;
}

const StartDrawModal: React.FC<StartDrawModalProps> = ({
  open,
  onClose,
  onConfirm,
  drawId,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirm = async () => {
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
    // Reset state when closing
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: startDrawModalDialogStyles,
        },
      }}
    >
      <DialogTitle sx={startDrawModalTitleStyles}>
        {t('drawPage.startDrawButton')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={startDrawModalDescriptionStyles}>
          {t('drawPage.startDraw.confirmationText')}
        </DialogContentText>

        <Box sx={startDrawModalInputContainerStyles}>
          <TextField
            label={t('createPage.password')}
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            sx={errorStyles(theme)}
            slotProps={{
              input: {
                sx: inputStyles(theme),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },

              inputLabel: {
                sx: inputLabelStyles(theme),
              },
            }}
          />
        </Box>

        <Box sx={startDrawModalButtonContainerStyles}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={startDrawModalCancelButtonStyles}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isChecking}
            variant="contained"
            color="error"
            sx={startDrawModalConfirmButtonStyles}
          >
            {t('drawPage.startDraw.drawButton')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StartDrawModal;
