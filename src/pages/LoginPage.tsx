import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { Google } from '@mui/icons-material'; // Import Google icon
import YouTubeEmbed from '../components/YouTubeEmbed'; // Import the YouTubeEmbed component
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useTranslation();

  // If the user is already logged in, redirect to AllDrawsPage
  if (user) {
    window.location.href = '/all-draws'; // Redirect to AllDrawsPage if user is logged in
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Ensures it takes the full viewport height
        backgroundColor: 'secondary.main',
        padding: 0, // Ensure no extra padding is added
        margin: 0, // Remove any unintended margins
        overflow: 'hidden', // Prevent overflow
      }}
    >
      <Card
        sx={{
          maxWidth: 550,
          width: '100%',
          padding: 2,
          boxShadow: 3,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          {t('loginPage.title')}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t('loginPage.by')}
        </Typography>

        <YouTubeEmbed videoId="z59gAXZ0ksQ" />

        <CardContent
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: 2, width: '100%' }}
            startIcon={<Google sx={{ color: 'white' }} />} // Add Google icon in white
            onClick={signInWithGoogle}
          >
            {t('loginPage.loginWithGoogle')}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
