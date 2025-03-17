import { Theme } from '@mui/material/styles';

export const winnerSectionContainerStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mt: 4
};

export const winnerSectionTitleStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  mb: 2
});

export const winnerAvatarStyles = {
  width: 150,
  height: 150,
  mb: 2,
  fontSize: '4rem'
};

export const winnerNameStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  fontSize: '1.5rem',
  mb: 1
});

export const winnerWishStyles = (theme: Theme) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: '80%',
  wordWrap: 'break-word'
});