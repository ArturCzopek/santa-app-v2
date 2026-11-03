import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import { Draw } from '../../models/Draw';
import { drawService } from '../../services/DrawService';
import { tokens } from '../../styles/theme';

// 'YYYY-MM-DD' of today in the user's local time.
const today = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// Opt-in email reminders 7 days and 1 day before the exchange, for a
// participant of a draw that has an exchange date still ahead.
const EmailReminderToggle: React.FC<{ draw: Draw }> = ({ draw }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const notify = useNotify();
  const mine = draw.participants.find((p) => p.userUuid === user?.uid);
  const [enabled, setEnabled] = useState(!!mine?.remindByEmail);
  const [saving, setSaving] = useState(false);

  if (!draw.id || !user || !mine || !draw.eventDate) return null;
  if (draw.eventDate <= today()) return null;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const previous = enabled;
    const next = event.target.checked;
    setEnabled(next);
    setSaving(true);
    try {
      await drawService.updateEmailReminder(
        draw.id as string,
        user.uid,
        next,
        i18n.language === 'pl' ? 'pl' : 'en',
      );
    } catch (error) {
      console.error('Error updating email reminder:', error);
      setEnabled(previous);
      notify(t('drawPage.errors.emailReminderUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={enabled}
            disabled={saving}
            onChange={handleChange}
            sx={{ color: tokens.snow, '&.Mui-checked': { color: tokens.snow } }}
          />
        }
        label={t('drawPage.emailReminder.label')}
        sx={{ mx: -1, alignSelf: 'flex-start', color: tokens.snow }}
      />
      <Typography variant="body2" sx={{ color: tokens.snowMuted, mt: -1 }}>
        {t('drawPage.emailReminder.hint')}
      </Typography>
    </>
  );
};

export default EmailReminderToggle;
