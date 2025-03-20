import { Theme } from '@mui/material';

export const showSantaModalDialogStyles = {
  backgroundColor: 'rgba(0, 43, 0, 0.9)',
  color: 'white',
  width: '700px'
};

export const showSantaModalTitleStyles = () => ({
  fontSize: '28px',
  fontWeight: 700,
  color: 'white',
  textAlign: 'center',
  marginBottom: '16px',
});

export const showSantaModalButtonContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '24px',
};

export const showSantaModalCloseButtonStyles = (theme: Theme) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.customColors.darkRed,
  },
  minWidth: '100px',
});