import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import { tokens } from '../styles/theme';

export const NAME_MAX_LENGTH = 50;

// Accounts from an email link have no name, and other participants see
// people by name, so it is asked once before anything else (D38).
const NamePage = () => {
  const { t } = useTranslation();
  const notify = useNotify();
  const { setDisplayName, logOut } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t('namePage.required'));
      return;
    }
    setSaving(true);
    try {
      await setDisplayName(trimmed);
    } catch (err) {
      console.error('Error saving the name:', err);
      notify(t('namePage.failed'));
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <Typography variant="h1" sx={{ color: tokens.snow, mb: 3 }}>
        {t('namePage.title')}
      </Typography>
      <PaperCard onSubmit={save}>
        <Typography>{t('namePage.explain')}</Typography>
        <TextField
          label={t('namePage.label')}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          autoFocus
          error={!!error}
          helperText={error || t('namePage.hint')}
          slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button onClick={logOut} sx={{ color: tokens.ink }}>
            {t('namePage.notMe')}
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {t('namePage.save')}
          </Button>
        </Box>
      </PaperCard>
    </MainLayout>
  );
};

export default NamePage;
