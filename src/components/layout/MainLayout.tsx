import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Navbar from '../navbar/Navbar';
import {
  mainContainerStyles,
  mainContentStyles,
  pageTitleStyles,
} from '../../styles/layoutStyles';
import SnowfallEffect from '../SnowfallEffect';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const theme = useTheme();

  return (
    <Box sx={mainContainerStyles(theme)}>
      <SnowfallEffect />
      <Navbar />
      <Box sx={mainContentStyles(theme)}>
        <Typography variant="h1" component="h1" sx={pageTitleStyles(theme)}>
          {title}
        </Typography>

        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
