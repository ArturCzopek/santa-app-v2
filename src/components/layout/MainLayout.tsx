import React from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../navbar/Navbar';
import Footer from './Footer';
import {
  mainContainerStyles,
  mainContentStyles,
  pageTitleStyles,
} from '../../styles/layoutStyles';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => (
  <Box sx={mainContainerStyles}>
    <Navbar />
    <Box component="main" sx={mainContentStyles}>
      {title && (
        <Typography variant="h1" sx={pageTitleStyles}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;
