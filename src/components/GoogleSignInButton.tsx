import React from 'react';
import { Button, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { Google } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { tokens } from '../styles/theme';

interface GoogleSignInButtonProps {
  // Inside Messenger & co. signing in usually fails, so the button steps
  // back and says so; it stays in case the detection is wrong.
  secondary?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  secondary = false,
}) => {
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();

  return (
    <>
      {secondary && (
        <Typography variant="body2" color="text.secondary">
          {t('loginPage.inAppBrowser.googleMayFail')}
        </Typography>
      )}
      <Button
        variant={secondary ? 'outlined' : 'contained'}
        color={secondary ? 'inherit' : 'primary'}
        size="large"
        fullWidth
        startIcon={<Google />}
        onClick={signInWithGoogle}
        sx={secondary ? { color: tokens.ink } : undefined}
      >
        {t('loginPage.loginWithGoogle')}
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
        {t('loginPage.googleNote')}{' '}
        <Link component={RouterLink} to="/privacy" color="inherit">
          {t('loginPage.privacyLink')}
        </Link>
      </Typography>
    </>
  );
};

export default GoogleSignInButton;
