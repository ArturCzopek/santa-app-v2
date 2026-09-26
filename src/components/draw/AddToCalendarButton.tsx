import React from 'react';
import { Button } from '@mui/material';
import { EventOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Draw } from '../../models/Draw';
import { buildIcs, downloadIcs } from '../../services/calendar';
import { tokens } from '../../styles/theme';

interface AddToCalendarButtonProps {
  draw: Draw;
  // Snow on the spruce ground, ink on paper.
  onDark?: boolean;
}

// Only when the organizer set a gift exchange date.
const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  draw,
  onDark = false,
}) => {
  const { t } = useTranslation();
  if (!draw.eventDate) return null;

  const link = `${import.meta.env.VITE_APP_URL}/#/draw/${draw.id ?? ''}`;

  const handleClick = () => {
    const ics = buildIcs({
      uid: `${draw.id}@santa-app`,
      date: draw.eventDate as string,
      title: t('calendar.title', { name: draw.drawName }),
      place: draw.eventPlace || undefined,
      description: t('calendar.description', {
        budget: draw.budget,
        currency: draw.currency,
        link,
      }),
    });
    downloadIcs(`${t('calendar.fileName')}.ics`, ics);
  };

  return (
    <Button
      variant="text"
      color="inherit"
      startIcon={<EventOutlined />}
      onClick={handleClick}
      sx={{
        alignSelf: 'flex-start',
        px: 0.5,
        color: onDark ? tokens.snow : tokens.ink,
        textDecoration: 'underline',
        textUnderlineOffset: '0.2em',
      }}
    >
      {t('calendar.add')}
    </Button>
  );
};

export default AddToCalendarButton;
