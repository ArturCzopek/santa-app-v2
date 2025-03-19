import { SxProps, Theme } from '@mui/material';

export const pageContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mt: 6, // More space from the top
};

export const loadingContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 8,
};

export const errorMessageStyles: SxProps<Theme> = {
  textAlign: 'center',
  mt: 8,
};

export const emptyStateContainerStyles: SxProps<Theme> = {
  textAlign: 'center',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
};

export const appDataContainerStyles: SxProps<Theme> = {
  textAlign: 'center',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  mb: 4
};

export const emptyStateTextStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.primary,
  fontSize: '1.1rem',
  lineHeight: 1.6,
});

export const createLinkStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  cursor: 'pointer',
  textDecoration: 'underline',
  '&:hover': {
    color: theme.customColors.gold,
  },
});

export const actionButtonsContainerStyles: SxProps<Theme> = {
  mt: 5,
  display: 'flex',
  gap: 2,
};

export const buttonBaseStyles: SxProps<Theme> = {
  minWidth: '220px',
  py: 1.5,
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
};

export const joinButtonStyles = (theme: Theme): SxProps<Theme> => ({
  ...buttonBaseStyles,
  backgroundColor: theme.palette.success.main,
  '&:hover': {
    backgroundColor: '#388E3C', // Darker green
  },
});

export const createButtonStyles = (theme: Theme): SxProps<Theme> => ({
  ...buttonBaseStyles,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.customColors.darkRed,
  },
});
