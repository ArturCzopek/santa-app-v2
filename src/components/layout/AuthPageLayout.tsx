import React from 'react';
import { Box, Card, useTheme } from '@mui/material';
import { authContainerStyles, authCardStyles } from '../../styles/layoutStyles';
import SnowfallEffect from '../SnowfallEffect';

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={authContainerStyles(theme)}>
      <SnowfallEffect />
      <Card sx={authCardStyles(theme)}>{children}</Card>
    </Box>
  );
};

export default AuthPageLayout;
