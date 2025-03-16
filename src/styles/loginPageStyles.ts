import { SxProps, Theme } from '@mui/material';
import theme from './theme';

export const pageTitleStyles = (theme: Theme): SxProps<Theme> => ({
  color: '#212121', // Using the dark text color for better contrast on white background
  textAlign: 'center',
  marginBottom: theme.spacing(2)
});

export const loginButtonStyles: SxProps<Theme> = {
  marginTop: 2,
  width: '100%',
  boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
};

export const youtubeContainerStyles: SxProps<Theme> = {
  width: '100%',
  marginBottom: theme.spacing(3)
};