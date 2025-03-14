import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { useTranslation } from 'react-i18next';
import AuthPageLayout from '../components/layout/AuthPageLayout';

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useTranslation();

  if (user) {
    window.location.href = '/draws';
  }

  return (
    <AuthPageLayout>
      <Typography
        variant="h1"
        gutterBottom
        sx={{ color: '#212121' }}
      >
        {t('loginPage.title')}
      </Typography>

      <YouTubeEmbed videoId="z59gAXZ0ksQ" />

        <Button
          variant="contained"
          color="error"
          sx={{
            marginTop: 2,
            width: '100%',
            boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
          }}
          startIcon={<Google sx={{ color: 'white' }} />}
          onClick={signInWithGoogle}
        >
          {t('loginPage.loginWithGoogle')}
        </Button>
    </AuthPageLayout>
  );
};

export default LoginPage;