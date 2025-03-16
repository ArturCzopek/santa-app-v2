import { SxProps, Theme } from '@mui/material';

export const mainContainerStyles = (theme: Theme): SxProps<Theme> => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.secondary.main,
  width: '100%',
  position: 'relative',
});

export const mainContentStyles = (theme: Theme): SxProps<Theme> => ({
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
});

export const pageTitleStyles = (theme: Theme): SxProps<Theme> => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  textAlign: 'center',
  mt: 2,
  mb: 6,
});

export const authContainerStyles = (theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: theme.palette.secondary.main,
  padding: 0,
  margin: 0,
  overflow: 'hidden',
});

export const authCardStyles = (theme: Theme): SxProps<Theme> => ({
  maxWidth: 550,
  width: '100%',
  padding: theme.spacing(2),
  boxShadow: 3,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
