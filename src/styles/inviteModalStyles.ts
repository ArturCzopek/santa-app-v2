import { Theme } from '@mui/material/styles';

export const inviteButtonStyles = () => ({
  backgroundColor: '#2196F3',
  '&:hover': {
    backgroundColor: '#1976D2',
  },
});

export const inviteModalDialogStyles = {
  backgroundColor: 'rgba(0, 43, 0, 0.9)',
  color: 'white',
};

export const inviteModalTitleStyles = {
  color: 'white',
  textAlign: 'center',
  fontSize: '1.25rem',
  fontWeight: 'bold',
};

export const inviteModalContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 3,
  py: 2,
};

export const inviteModalDescriptionStyles = {
  color: 'rgba(255, 255, 255, 0.7)',
  textAlign: 'center',
  mb: 1,
  fontSize: '0.875rem',
};

export const inviteModalDrawCodeDescriptionStyles = (theme: Theme) => ({
  color: theme.customColors.lightGold,
  textAlign: 'center',
  mb: 2,
  fontSize: '0.875rem',
});

export const inviteModalLinkContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  mb: 2,
};

export const inviteModalLinkInputStyles = {
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.23)',
  },
};

export const inviteModalLinkLabelStyles = {
  color: 'rgba(255, 255, 255, 0.7)',
};

export const inviteModalCopyButtonStyles = {
  color: 'white',
  ml: 1,
};

export const inviteModalCloseButtonStyles = {
  backgroundColor: '#4CAF50',
  '&:hover': {
    backgroundColor: '#388E3C',
  },
};
