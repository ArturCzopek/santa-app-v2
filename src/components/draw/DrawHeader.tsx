import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import Postmark from '../common/Postmark';
import EventDetails from './EventDetails';
import { Draw } from '../../models/Draw';
import { tokens } from '../../styles/theme';

const toDate = (date: Date | Timestamp) =>
  (date as Timestamp).seconds !== undefined
    ? new Date((date as Timestamp).seconds * 1000)
    : new Date(date as Date);

// The draw name is the page title; status, budget and organizer sit under it.
const DrawHeader: React.FC<{ draw: Draw }> = ({ draw }) => {
  const { t, i18n } = useTranslation();
  const drawn = draw.status === 'DRAWED';

  return (
    <Box
      component="header"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Typography
        variant="h1"
        sx={{ color: tokens.snow, overflowWrap: 'anywhere' }}
      >
        {draw.drawName}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 2.5,
          rowGap: 1,
          color: tokens.snowMuted,
        }}
      >
        <Postmark
          onDark
          tone={drawn ? 'done' : 'waiting'}
          label={
            drawn ? t('drawCard.drawedStatus') : t('drawCard.waitingStatus')
          }
        />
        <Typography sx={{ fontWeight: 700, color: tokens.snow }}>
          {t('drawCard.budget', {
            budget: draw.budget,
            currency: draw.currency,
          })}
        </Typography>
        <Typography>
          {t('drawPage.organizer', { name: draw.ownerName })}
        </Typography>
        {drawn && draw.drawDate && (
          <Typography>
            {t('drawPage.drawnOn', {
              date: format(toDate(draw.drawDate), 'd MMMM yyyy', {
                locale: i18n.language === 'pl' ? pl : enUS,
              }),
            })}
          </Typography>
        )}
      </Box>

      <EventDetails
        onDark
        eventDate={draw.eventDate}
        eventPlace={draw.eventPlace}
      />

      {draw.description && (
        <Typography sx={{ color: tokens.snowMuted, maxWidth: '65ch' }}>
          {draw.description}
        </Typography>
      )}
    </Box>
  );
};

export default DrawHeader;
