import React from 'react';
import { Typography } from '@mui/material';
import { CheckCircleOutlined, HourglassEmpty } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Draw } from '../../models/Draw';
import { tokens } from '../../styles/theme';

// Before the draw: one line on what the draw is waiting for and who acts
// next, so nobody has to guess during the weeks until it happens.
const DrawStatus: React.FC<{ draw: Draw; isOwner: boolean }> = ({
  draw,
  isOwner,
}) => {
  const { t } = useTranslation();
  const total = draw.participants.length;
  const done = draw.participants.filter((p) => p.hasWish).length;
  const ready = isOwner && total >= 2 && done === total;

  const text = !isOwner
    ? t('drawPage.status.participant', { owner: draw.ownerName })
    : total < 2
      ? t('drawPage.status.ownerNeedsPeople')
      : ready
        ? t('drawPage.status.ownerReady')
        : t('drawPage.status.ownerWaitingLetters');

  return (
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        color: tokens.snow,
        fontWeight: 600,
        maxWidth: '60ch',
      }}
    >
      {ready ? (
        <CheckCircleOutlined
          aria-hidden
          sx={{ color: tokens.pineOnDark, mt: '2px' }}
        />
      ) : (
        <HourglassEmpty
          aria-hidden
          sx={{ color: tokens.stampGold, mt: '2px' }}
        />
      )}
      {text}
    </Typography>
  );
};

export default DrawStatus;
