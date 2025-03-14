import React from 'react';
import { Box, Card, useTheme } from '@mui/material';

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'secondary.main',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <Card
        sx={{
          maxWidth: 550,
          width: '100%',
          padding: theme.spacing(2),
          boxShadow: 3,
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </Card>
    </Box>
  );
};

export default AuthPageLayout;