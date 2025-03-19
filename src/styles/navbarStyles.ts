import { SxProps, Theme } from '@mui/material';

export const appBarStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
});

export const titleStyles = (theme: Theme): SxProps<Theme> => ({
  flexGrow: 1,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  cursor: 'pointer',
});

export const navItemContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
};

export const dividerStyles: SxProps<Theme> = {
  mx: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
};

export const userNameStyles = (theme: Theme): SxProps<Theme> => ({
  mx: 2,
  color: theme.palette.common.white,
});

export const logoutButtonStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const navbarItemStyles = (theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  cursor: 'pointer',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  borderRadius: '4px',
});

export const iconContainerStyles: SxProps<Theme> = {
  mr: 1,
  display: 'flex',
  alignItems: 'center',
};
