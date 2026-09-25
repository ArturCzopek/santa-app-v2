import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
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

// Long descriptions fold to two lines on phones, so the actions and your
// letter stay near the top of the screen.
const LONG_DESCRIPTION = 120;

const Description: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const foldable = text.length > LONG_DESCRIPTION;
  const folded = foldable && !expanded;

  return (
    <Box>
      <Typography
        sx={{
          color: tokens.snowMuted,
          maxWidth: '65ch',
          whiteSpace: 'pre-line',
          ...(folded && {
            display: { xs: '-webkit-box', sm: 'block' },
            WebkitLineClamp: { xs: 2, sm: 'none' },
            WebkitBoxOrient: 'vertical',
            overflow: { xs: 'hidden', sm: 'visible' },
          }),
        }}
      >
        {text}
      </Typography>
      {foldable && (
        <Button
          color="inherit"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          sx={{
            display: { sm: 'none' },
            color: tokens.snow,
            px: 0,
            textDecoration: 'underline',
          }}
        >
          {expanded
            ? t('drawPage.description.less')
            : t('drawPage.description.more')}
        </Button>
      )}
    </Box>
  );
};

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

      {draw.description && <Description text={draw.description} />}
    </Box>
  );
};

export default DrawHeader;
