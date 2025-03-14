import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Snowfall from 'react-snowfall';
import Navbar from '../navbar/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.secondary.main,
        width: '100%',
        position: 'relative',
      }}
    >
      <Snowfall
        snowflakeCount={200}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Use the separated Navbar component */}
      <Navbar />

      {/* Main content */}
      <Box
        sx={{
          padding: theme.spacing(3),
          color: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            marginBottom: theme.spacing(3),
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 'bold',
            textAlign: 'center',
            mt: 2,
            mb: 6
          }}
        >
          {title}
        </Typography>

        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;