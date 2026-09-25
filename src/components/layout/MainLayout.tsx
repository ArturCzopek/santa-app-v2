import React, { useRef } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from '../navbar/Navbar';
import Footer from './Footer';
import {
  mainContainerStyles,
  mainContentStyles,
  pageTitleStyles,
  skipLinkStyles,
} from '../../styles/layoutStyles';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);

  return (
    <Box sx={mainContainerStyles}>
      {/* For keyboard users: straight past the navbar. A button, not an
          #anchor, because the hash holds the route. */}
      <ButtonBase
        onClick={() => mainRef.current?.focus()}
        sx={skipLinkStyles}
      >
        {t('common.skipToContent')}
      </ButtonBase>
      <Navbar />
      <Box
        component="main"
        ref={mainRef}
        tabIndex={-1}
        sx={mainContentStyles}
      >
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
};

export default MainLayout;
