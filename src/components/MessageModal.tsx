import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  messageModalDialogStyles,
  messageModalTitleStyles,
  messageModalDescriptionStyles,
  messageModalInputContainerStyles,
  messageModalButtonContainerStyles,
  messageModalCancelButtonStyles,
  messageModalSendButtonStyles,
} from '../styles/messageModalStyles';
import { AlertColor } from '@mui/material/Alert/Alert';
import { useAuth } from '../hooks/useAuth';
import { messageService } from '../services/MessageService';

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

  useEffect(() => {
    if (open && user) {
      setIsLoading(true);
      setMessage(''); // Reset message when opening modal

      // Check if user has already sent a message today
      messageService
        .canUserSendMessageToday(user.uid)
        .then((canSend) => {
          console.log(`User can send message today: ${canSend}`);
          setCanSendToday(canSend);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error checking message status:', error);
          setCanSendToday(false); // Default to not allowing on error to be safe
          setIsLoading(false);
        });
    }
  }, [open, user]);

  const handleSendMessage = async () => {
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
        date: new Date(),
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
        PaperProps={{
          sx: messageModalDialogStyles,
        }}
      >
        <DialogTitle sx={messageModalTitleStyles}>
          {t('navbar.leaveMessage')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={messageModalDescriptionStyles}>
            {t('messages.description')}
          </DialogContentText>

          {isLoading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          ) : !canSendToday ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('messages.alreadySentToday')}
            </Alert>
          ) : null}

          <Box sx={messageModalInputContainerStyles}>
            <TextField
              autoFocus
              margin="dense"
              id="message"
              label={t('messages.messageLabel')}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending || !canSendToday}
            />
          </Box>

          <Box sx={messageModalButtonContainerStyles}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={isSending}
              sx={messageModalCancelButtonStyles}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSendMessage}
              variant="contained"
              color="primary"
              disabled={!message.trim() || isSending || !canSendToday}
              startIcon={
                isSending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : null
              }
              sx={messageModalSendButtonStyles}
            >
              {t('messages.send')}
            </Button>
          </Box>
        </DialogContent>
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
