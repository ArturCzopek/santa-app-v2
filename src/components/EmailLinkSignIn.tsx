import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { AuthError } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import PaperCard from './common/PaperCard';
import { finishLoginLink, pendingLoginEmail } from '../services/emailLink';
import { tokens } from '../styles/theme';

// Where the link from the email lands (D38): signs in with the address it
// was sent to, and goes back to the page the person came from. Opened in
// another browser, it asks for the address first.
const EmailLinkSignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(pendingLoginEmail);
  const [asking, setAsking] = useState(() => !pendingLoginEmail());
  const [error, setError] = useState('');
  const started = useRef(false);

  const finish = async (address: string) => {
    setAsking(false);
    setError('');
    try {
      navigate(await finishLoginLink(address), { replace: true });
    } catch (err) {
      const code = (err as AuthError).code;
      console.error('Error signing in with the email link:', err);
      setError(
        t(
          code === 'auth/invalid-email'
            ? 'loginPage.email.wrongAddress'
            : 'loginPage.email.linkExpired',
        ),
      );
      setAsking(code === 'auth/invalid-email');
    }
  };

  // The address from this browser signs in straight away, once.
  useEffect(() => {
    if (started.current || asking) return;
    started.current = true;
    finish(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back to the plain login page, without the used code in the address.
  const startOver = () =>
    window.location.replace(window.location.origin + window.location.pathname);

  return (
    <PaperCard>
      <Typography variant="h2" sx={{ fontSize: '1.4rem' }}>
        {t('loginPage.email.finishTitle')}
      </Typography>

      {asking ? (
        <Box
          component="form"
          noValidate
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            finish(email.trim());
          }}
          sx={{ display: 'grid', gap: 1.5 }}
        >
          <Typography>{t('loginPage.email.confirmAddress')}</Typography>
          <TextField
            type="email"
            label={t('loginPage.email.label')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            autoFocus
            error={!!error}
            helperText={error || undefined}
          />
          <Button type="submit" variant="contained">
            {t('loginPage.email.finish')}
          </Button>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Typography sx={{ color: tokens.amber, fontWeight: 700 }}>
            {error}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={startOver}
              sx={{ color: tokens.ink }}
            >
              {t('loginPage.email.startOver')}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={24} color="inherit" />
          <Typography>{t('loginPage.email.signingIn')}</Typography>
        </Box>
      )}
    </PaperCard>
  );
};

export default EmailLinkSignIn;
