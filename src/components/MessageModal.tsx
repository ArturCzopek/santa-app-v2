import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  AlertColor,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { messageService } from '../services/MessageService';
import { MESSAGE_MAX_LENGTH } from '../models/Message';
import { tokens } from '../styles/theme';

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor,
  });
  const [canSendToday, setCanSendToday] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpening = () => {
    if (!user) return;

    setIsLoading(true);
    setMessage(''); // Reset message when opening modal

    // Check if user has already sent a message today
    messageService
      .canUserSendMessageToday(user.uid)
      .then((canSend) => {
        setCanSendToday(canSend);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error checking message status:', error);
        setCanSendToday(false); // Default to not allowing on error to be safe
        setIsLoading(false);
      });
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || !user) return;

    // Double-check if the user can send a message today
    const canSend = await messageService.canUserSendMessageToday(user.uid);
    if (!canSend) {
      setCanSendToday(false);
      setSnackbar({
        open: true,
        message: t('messages.alreadySentToday'),
        severity: 'warning',
      });
      return;
    }

    setIsSending(true);
    try {
      await messageService.sendMessage({
        userUid: user.uid,
        userName: user.displayName || user.uid,
        message: message.trim(),
      });

      setSnackbar({
        open: true,
        message: t('messages.sendSuccess'),
        severity: 'success',
      });

      setMessage('');
      setCanSendToday(false);

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: t('messages.sendError'),
        severity: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClose = () => {
    setMessage('');
    setSnackbar({
      open: false,
      message: '',
      severity: 'success',
    });
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          transition: { onEnter: handleOpening },

          paper: { component: 'form', onSubmit: handleSendMessage },
        }}
      >
        <DialogTitle>{t('navbar.leaveMessage')}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <DialogContentText sx={{ color: tokens.ink }}>
            {t('messages.description')}
          </DialogContentText>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} aria-label={t('common.loading')} />
            </Box>
          ) : !canSendToday ? (
            <Alert severity="info">{t('messages.alreadySentToday')}</Alert>
          ) : null}

          <TextField
            autoFocus
            margin="dense"
            id="message"
            label={t('messages.messageLabel')}
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending || !canSendToday}
            helperText={`${message.length} / ${MESSAGE_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: MESSAGE_MAX_LENGTH } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={isSending}
            sx={{ color: tokens.ink }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!message.trim() || isSending || !canSendToday}
            startIcon={
              isSending ? <CircularProgress size={24} color="inherit" /> : null
            }
          >
            {t('messages.send')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MessageModal;
