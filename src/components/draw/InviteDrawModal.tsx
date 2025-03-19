import React, { useState } from 'react';
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
  IconButton,
  useTheme,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  inviteModalDialogStyles,
  inviteModalTitleStyles,
  inviteModalContentStyles,
  inviteModalDescriptionStyles,
  inviteModalDrawCodeDescriptionStyles,
  inviteModalLinkContainerStyles,
  inviteModalLinkInputStyles,
  inviteModalLinkLabelStyles,
  inviteModalCopyButtonStyles,
  inviteModalCloseButtonStyles,
} from '../../styles/inviteModalStyles';

interface InviteDrawModalProps {
  open: boolean;
  onClose: () => void;
  drawId: string;
}

const InviteDrawModal: React.FC<InviteDrawModalProps> = ({
  open,
  onClose,
  drawId,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const APP_URL = import.meta.env.VITE_APP_URL;
  const inviteLink = `${APP_URL}/join/${drawId}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);

        // Hide copied message after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  const handleClose = () => {
    setCopied(false);
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
          sx: inviteModalDialogStyles,
        }}
      >
        <DialogTitle sx={inviteModalTitleStyles}>
          {t('drawPage.inviteButton')}
        </DialogTitle>
        <DialogContent sx={inviteModalContentStyles}>
          <DialogContentText sx={inviteModalDescriptionStyles}>
            {t('drawPage.inviteModal.descriptionPart1')}{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 'bold',
                color: 'inherit',
              }}
            >
              {drawId}
            </Box>
          </DialogContentText>

          <DialogContentText sx={inviteModalDrawCodeDescriptionStyles(theme)}>
            {t('drawPage.inviteModal.descriptionPart2')}
          </DialogContentText>

          <Box sx={inviteModalLinkContainerStyles}>
            <TextField
              fullWidth
              variant="outlined"
              value={inviteLink}
              InputProps={{
                readOnly: true,
                sx: inviteModalLinkInputStyles,
              }}
              InputLabelProps={{
                sx: inviteModalLinkLabelStyles,
              }}
            />
            <IconButton
              onClick={handleCopyLink}
              sx={inviteModalCopyButtonStyles}
            >
              <ContentCopy />
            </IconButton>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleClose}
            sx={inviteModalCloseButtonStyles}
          >
            {t('common.close')}
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {t('drawPage.inviteModal.linkCopied')}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InviteDrawModal;
