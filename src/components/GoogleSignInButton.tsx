import React from 'react';
import { Button, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const GoogleSignInButton = () => {
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();

  return (
    <>
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<Google />}
        onClick={signInWithGoogle}
      >
        {t('loginPage.loginWithGoogle')}
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
        {t('loginPage.googleNote')}
      </Typography>
    </>
  );
};

export default GoogleSignInButton;
