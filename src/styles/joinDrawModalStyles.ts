import { Theme } from '@mui/material/styles';

export const joinModalDialogStyles = {
  backgroundColor: 'rgba(0, 43, 0, 0.9)',
  color: 'white'
};

export const joinModalTitleStyles = {
  color: 'white',
  textAlign: 'center',
  fontSize: '1.25rem',
  fontWeight: 'bold'
};

export const joinModalContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 3,
  py: 2
};

export const joinModalDescriptionStyles = {
  color: 'rgba(255, 255, 255, 0.7)',
  textAlign: 'center',
  mb: 2
};

export const joinModalButtonContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: 2,
  mt: 2
};

export const joinModalCancelButtonStyles = {
  color: 'white',
  borderColor: 'rgba(255, 255, 255, 0.5)',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
};

export const joinModalProceedButtonStyles = {
  backgroundColor: '#4CAF50',
  '&:hover': {
    backgroundColor: '#388E3C'
  }
};