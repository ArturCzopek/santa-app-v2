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
import { PasswordUtils } from '../../services/PasswordUtils';

interface StartDrawModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  drawPassword: string;
}

const StartDrawModal: React.FC<StartDrawModalProps> = ({
  open,
  onClose,
  onConfirm,
  drawPassword,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirm = () => {
    // Basic validation
    if (!password) {
      setError(t('createPage.validation.passwordRequired'));
      return;
    }

    if (password.length < 4) {
      setError(t('createPage.validation.passwordTooShort'));
      return;
    }

    // Verify password
    if (!PasswordUtils.comparePasswords(password, drawPassword)) {
      setError(t('drawPage.startDraw.incorrectPassword'));
      return;
    }

    // Clear any previous errors
    setError('');

    // Call the confirm handler
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
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 43, 0, 0.9)',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
        {t('drawPage.startDrawButton')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            mb: 2,
          }}
        >
          {t('drawPage.startDraw.confirmationText')}
        </DialogContentText>

        <Box sx={{ width: '100%' }}>
          <TextField
            label={t('createPage.password')}
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
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
            }}
            InputLabelProps={{
              sx: inputLabelStyles(theme),
            }}
            sx={errorStyles(theme)}
          />
        </Box>

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
            onClick={handleConfirm}
            variant="contained"
            color="error"
            sx={{
              backgroundColor: '#D32F2F',
              '&:hover': {
                backgroundColor: '#B71C1C',
              },
            }}
          >
            {t('drawPage.startDraw.drawButton')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StartDrawModal;
