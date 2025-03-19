import React, { ReactNode } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { navbarItemStyles, iconContainerStyles } from '../../styles/navbarStyles';

interface NavbarItemProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}


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
