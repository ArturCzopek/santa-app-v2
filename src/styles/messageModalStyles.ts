import { Theme } from '@mui/material';

export const messageModalDialogStyles = {
  backgroundColor: 'rgba(0, 43, 0, 0.9)',
  color: 'white',
};

export const messageModalTitleStyles = (theme: Theme) => ({
  fontSize: '24px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginBottom: '8px',
});

export const messageModalDescriptionStyles = (theme: Theme) => ({
  textAlign: 'center',
  marginBottom: '16px',
  color: theme.palette.text.secondary,
});

export const messageModalInputContainerStyles = {
  marginBottom: '24px',
};

export const messageModalButtonContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  marginTop: '16px',
};

export const messageModalCancelButtonStyles = (theme: Theme) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  '&:hover': {
    borderColor: theme.palette.text.secondary,
  },
});

export const messageModalSendButtonStyles = (theme: Theme) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  minWidth: '100px',
});
