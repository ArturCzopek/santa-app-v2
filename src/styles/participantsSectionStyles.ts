import { Theme } from '@mui/material/styles';

export const participantsSectionContainerStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mt: 4
};

export const participantsSectionTitleStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  mb: 2
});

export const participantRowStyles = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  p: 1,
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
});

export const currentUserHighlightStyles = (theme: Theme) => ({
  backgroundColor: 'rgba(255, 193, 7, 0.2)', // Amber with low opacity
  '&:hover': {
    backgroundColor: 'rgba(255, 193, 7, 0.3)'
  }
});

export const participantAvatarStyles = {
  width: 56,
  height: 56,
  mr: 2
};

export const participantInfoContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

export const participantNameStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  fontSize: '1rem'
});

export const participantRoleStyles = (theme: Theme) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem'
});