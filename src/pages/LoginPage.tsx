import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Typography, Box, useTheme } from '@mui/material';
import { Google } from '@mui/icons-material';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import {
  pageTitleStyles,
  loginButtonStyles,
  youtubeContainerStyles,
} from '../styles/loginPageStyles';

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();

  if (user) {
    return <Navigate to="/draws" replace />;
  }

  return (
    <AuthPageLayout>
      <Typography variant="h1" gutterBottom sx={pageTitleStyles(theme)}>
        {t('loginPage.title')}
      </Typography>

      <Box sx={youtubeContainerStyles}>
        <YouTubeEmbed videoId="z59gAXZ0ksQ" />
      </Box>

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
