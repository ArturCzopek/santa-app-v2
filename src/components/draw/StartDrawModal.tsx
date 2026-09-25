import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { drawService } from '../../services/DrawService';
import PasswordField from '../form/PasswordField';
import { tokens } from '../../styles/theme';
import { Draw } from '../../models/Draw';
import { Exclusion, isDrawPossible } from '../../services/pairs';
import { ImpossibleDrawNotice, pairLabel } from './ExclusionsSection';

interface StartDrawModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  draw: Draw;
  // People who have not written their letter yet.
  withoutWish?: string[];
  // Current exclusions (people still in the draw).
  exclusions: Exclusion[];
  onEditExclusions: () => void;
  onForgotPassword: () => void;
}

const StartDrawModal: React.FC<StartDrawModalProps> = ({
  open,
  onClose,
  onConfirm,
  draw,
  withoutWish = [],
  exclusions,
  onEditExclusions,
  onForgotPassword,
}) => {
  const drawId = draw.id ?? '';
  const possible = isDrawPossible(draw.participantUuids, exclusions);
  const nameOf = (uid: string) =>
    draw.participants.find((p) => p.userUuid === uid)?.userName ?? '?';
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password) {
      setError(t('createPage.validation.passwordRequired'));
      inputRef.current?.focus();
      return;
    }

    setIsChecking(true);
    try {
      if (!(await drawService.isDrawPasswordValid(drawId, password))) {
        setError(t('drawPage.startDraw.incorrectPassword'));
        inputRef.current?.focus();
        return;
      }
    } finally {
      setIsChecking(false);
    }

    setError('');
    onConfirm();
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { component: 'form', onSubmit: handleConfirm } }}
    >
      <DialogTitle>{t('drawPage.startDrawButton')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DialogContentText sx={{ color: tokens.ink }}>
          {t('drawPage.startDraw.confirmationText')}
        </DialogContentText>

        {withoutWish.length > 0 && (
          <DialogContentText sx={{ color: tokens.amber, fontWeight: 700 }}>
            {t('drawPage.startDraw.withoutWish', {
              count: withoutWish.length,
              names: withoutWish.join(', '),
            })}
          </DialogContentText>
        )}

        <Box
          sx={{
            borderTop: `1px dashed ${tokens.paperLine}`,
            borderBottom: `1px dashed ${tokens.paperLine}`,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            {exclusions.length > 0
              ? t('drawPage.startDraw.exclusions', {
                  pairs: exclusions
                    .map((pair) => pairLabel(pair, nameOf))
                    .join(', '),
                })
              : t('drawPage.startDraw.noExclusions')}
          </Typography>
          <ImpossibleDrawNotice
            draw={draw}
            exclusions={exclusions}
            nameOf={nameOf}
          />
          {possible && (
            <Typography variant="body2">
              {t('drawPage.startDraw.allExclusionsSet')}
            </Typography>
          )}
          <Button
            onClick={() => {
              handleClose();
              onEditExclusions();
            }}
            sx={{
              alignSelf: 'flex-start',
              color: tokens.ink,
              px: 0,
              textDecoration: 'underline',
            }}
          >
            {t('drawPage.startDraw.editExclusions')}
          </Button>
        </Box>

        <PasswordField
          label={t('createPage.password')}
          value={password}
          onChange={(value) => {
            setPassword(value);
            setError('');
          }}
          error={error}
          autoFocus
          inputRef={inputRef}
        />
        <Button
          onClick={() => {
            handleClose();
            onForgotPassword();
          }}
          sx={{
            alignSelf: 'flex-start',
            color: tokens.ink,
            px: 0,
            mt: -1,
            textDecoration: 'underline',
          }}
        >
          {t('drawPage.password.forgot')}
        </Button>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: tokens.ink }}>
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isChecking || !possible}
          variant="contained"
        >
          {t('drawPage.startDraw.drawButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartDrawModal;
