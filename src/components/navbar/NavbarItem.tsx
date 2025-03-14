import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface NavbarItemProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ icon, children, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        cursor: 'pointer',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        },
        borderRadius: '4px',
      }}
    >
      {icon && (
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
      )}
      <Typography variant="body1">
        {children}
      </Typography>
    </Box>
  );
};

export default NavbarItem;