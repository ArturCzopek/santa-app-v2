import { Theme } from '@mui/material';

export const startDrawModalDialogStyles = {
  backgroundColor: 'rgba(0, 43, 0, 0.9)',
  color: 'white',
};

export const startDrawModalTitleStyles = {
  color: 'white',
  textAlign: 'center',
};

export const startDrawModalDescriptionStyles = {
  color: 'rgba(255, 255, 255, 0.7)',
  textAlign: 'center',
  mb: 2,
};

export const startDrawModalInputContainerStyles = {
  width: '100%',
};

export const startDrawModalButtonContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: 2,
  mt: 2,
};

export const startDrawModalCancelButtonStyles = {
  color: 'white',
  borderColor: 'rgba(255, 255, 255, 0.5)',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
};

export const startDrawModalConfirmButtonStyles = (theme: Theme) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.customColors.darkRed,
  },
  minWidth: '100px',
});
