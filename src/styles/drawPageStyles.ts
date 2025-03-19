import { SxProps, Theme } from '@mui/material';

export const pageContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
};

export const backButtonContainerStyles: SxProps<Theme> = {
  width: '100%',
  maxWidth: '648px',
  display: 'flex',
  justifyContent: 'flex-start',
  mb: 2,
  pl: 0,
};

export const backButtonStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.common.white,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 'bold',
  px: 2,
  py: 1,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
});

export const loadingContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 8,
};

export const errorMessageStyles: SxProps<Theme> = {
  textAlign: 'center',
  mt: 8,
};

export const actionButtonContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

export const drawActionButtonStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  px: 3,
  py: 1,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
});
