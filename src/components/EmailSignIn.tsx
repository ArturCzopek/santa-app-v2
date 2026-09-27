import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { MailOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Location, useLocation } from 'react-router';
import { sendLoginLink } from '../services/emailLink';
import { useNotify } from '../hooks/useNotify';
import { tokens } from '../styles/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "No Google account?" under the Google button: a sign-in link by email
// (D38). The link brings the person back to the page they were on.
const EmailSignIn = () => {
  const { t } = useTranslation();
  const notify = useNotify();
  const location = useLocation();
  // The login page is often reached from a protected page it returns to.
  const from = (location.state as { from?: Location } | null)?.from;
  const returnTo = from
    ? from.pathname + from.search
    : location.pathname === '/'
      ? '/draws'
      : location.pathname + location.search;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const address = email.trim();
    if (!EMAIL.test(address)) {
      setError(t('loginPage.email.invalid'));
      return;
    }
    setError('');
    setSending(true);
    try {
      await sendLoginLink(address, returnTo);
      setSentTo(address);
    } catch (err) {
      console.error('Error sending the sign-in link:', err);
      notify(t('loginPage.email.sendFailed'));
    } finally {
      setSending(false);
    }
  };

  if (sentTo) {
    return (
      <Box role="status" sx={{ display: 'grid', gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>
          {t('loginPage.email.sentTitle')}
        </Typography>
        <Typography>{t('loginPage.email.sent', { email: sentTo })}</Typography>
        <Box>
          <Button
            onClick={() => setSentTo('')}
            sx={{ color: tokens.ink, ml: -1 }}
          >
            {t('loginPage.email.changeAddress')}
          </Button>
        </Box>
      </Box>
    );
  }

  if (!open) {
    return (
      <Box>
        <Button
          startIcon={<MailOutlined />}
          onClick={() => setOpen(true)}
          sx={{ color: tokens.ink, ml: -1 }}
        >
          {t('loginPage.email.open')}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={send}
      sx={{ display: 'grid', gap: 1.5 }}
    >
      <Typography>{t('loginPage.email.explain')}</Typography>
      <TextField
        type="email"
        label={t('loginPage.email.label')}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        autoFocus
        error={!!error}
        helperText={error || undefined}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
      <Button
        type="submit"
        variant="outlined"
        color="inherit"
        disabled={sending}
        startIcon={<MailOutlined />}
        sx={{ color: tokens.ink }}
      >
        {t('loginPage.email.send')}
      </Button>
    </Box>
  );
};

export default EmailSignIn;
