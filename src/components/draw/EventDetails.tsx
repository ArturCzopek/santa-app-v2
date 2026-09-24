import React from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarMonthOutlined, PlaceOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { tokens } from '../../styles/theme';

// 'YYYY-MM-DD' as a local calendar day, e.g. "24 grudnia 2026".
export const formatEventDate = (eventDate: string, language: string) => {
  const [year, month, day] = eventDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'd MMMM yyyy', {
    locale: language === 'pl' ? pl : enUS,
  });
};

// One line for the invite message: "24 grudnia 2026, u babci".
export const eventSummary = (
  eventDate: string | undefined,
  eventPlace: string | undefined,
  language: string,
) =>
  [eventDate ? formatEventDate(eventDate, language) : '', eventPlace ?? '']
    .filter(Boolean)
    .join(', ');

interface EventDetailsProps {
  eventDate?: string;
  eventPlace?: string;
  // Snow text on the spruce ground instead of ink on paper.
  onDark?: boolean;
}

// When and where the gifts are handed over; nothing if the owner left it out.
const EventDetails: React.FC<EventDetailsProps> = ({
  eventDate,
  eventPlace,
  onDark = false,
}) => {
  const { t, i18n } = useTranslation();
  if (!eventDate && !eventPlace) return null;

  const color = onDark ? tokens.snow : tokens.ink;
  const row = (icon: React.ReactNode, label: string, value: string) => (
    <Typography
      sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color }}
    >
      <Box component="span" sx={{ display: 'flex', mt: '2px' }} aria-hidden>
        {icon}
      </Box>
      <span>
        <Box component="span" sx={{ fontWeight: 700 }}>
          {label}
        </Box>{' '}
        {value}
      </span>
    </Typography>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {eventDate &&
        row(
          <CalendarMonthOutlined fontSize="small" />,
          t('event.date'),
          formatEventDate(eventDate, i18n.language),
        )}
      {eventPlace &&
        row(<PlaceOutlined fontSize="small" />, t('event.place'), eventPlace)}
    </Box>
  );
};

export default EventDetails;
