import React, { ReactNode } from 'react';
import { Box, SxProps, Theme, Typography, useTheme } from '@mui/material';

interface NavbarItemProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}

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

const NavbarItem: React.FC<NavbarItemProps> = ({ icon, children, onClick }) => {
  const theme = useTheme();

  return (
    <Box onClick={onClick} sx={navbarItemStyles(theme)}>
      {icon && <Box sx={iconContainerStyles}>{icon}</Box>}
      <Typography variant="body1">{children}</Typography>
    </Box>
  );
};

export default NavbarItem;
