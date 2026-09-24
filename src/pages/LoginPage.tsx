import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Typography, Box, useTheme } from '@mui/material';
import { Google } from '@mui/icons-material';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { useTranslation } from 'react-i18next';
import { Location, Navigate, useLocation } from 'react-router';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import InAppBrowserNotice from '../components/InAppBrowserNotice';
import {
  pageTitleStyles,
  loginButtonStyles,
  youtubeContainerStyles,
} from '../styles/loginPageStyles';

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  // Set by protected routes when a guest opens them (e.g. from a link).
  const from = (useLocation().state as { from?: Location } | null)?.from;

  if (user) {
    return <Navigate to={from ?? '/draws'} replace />;
  }

  return (
    <AuthPageLayout>
      <Typography variant="h1" gutterBottom sx={pageTitleStyles(theme)}>
        {t('loginPage.title')}
      </Typography>

      <Box sx={youtubeContainerStyles}>
        <YouTubeEmbed videoId="z59gAXZ0ksQ" />
      </Box>

      <InAppBrowserNotice />

      <Button
        variant="contained"
        color="error"
        sx={loginButtonStyles}
        startIcon={<Google sx={{ color: 'white' }} />}
        onClick={signInWithGoogle}
      >
        {t('loginPage.loginWithGoogle')}
      </Button>
    </AuthPageLayout>
  );
};

export default LoginPage;
