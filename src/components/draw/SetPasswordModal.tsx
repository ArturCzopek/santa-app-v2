import React, { useRef, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PasswordField from '../form/PasswordField';
import FormActions from '../form/FormActions';
import { drawService } from '../../services/DrawService';
import { MIN_PASSWORD_LENGTH } from '../../services/PasswordUtils';
import { useNotify } from '../../hooks/useNotify';
import { tokens } from '../../styles/theme';

interface SetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  drawId: string;
}

// A forgotten password used to mean the draw could never start. The owner,
// already signed in, can set a new one before the draw.
const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  open,
  onClose,
  drawId,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        password
          ? t('createPage.validation.passwordTooShort')
          : t('createPage.validation.passwordRequired'),
      );
      inputRef.current?.focus();
      return;
    }

    setSaving(true);
    try {
      await drawService.setDrawPassword(drawId, password);
      notify(t('drawPage.password.saved'), 'success');
      handleClose();
    } catch (err) {
      console.error('Error setting the password:', err);
      notify(t('drawPage.password.failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { component: 'form', onSubmit: handleSave } }}
    >
      <DialogTitle>{t('drawPage.password.title')}</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, '&&': { pt: 1 } }}
      >
        <DialogContentText sx={{ color: tokens.ink }}>
          {t('drawPage.password.text')}
        </DialogContentText>
        <Box>
          <PasswordField
            label={t('drawPage.password.label')}
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError(null);
            }}
            error={error}
            helperText={t('drawPage.password.hint')}
            autoComplete="new-password"
            inputRef={inputRef}
          />
        </Box>
        <FormActions
          primaryLabel={t('drawPage.password.save')}
          secondaryLabel={t('common.cancel')}
          onSecondaryClick={handleClose}
          isSubmitting={saving}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SetPasswordModal;
