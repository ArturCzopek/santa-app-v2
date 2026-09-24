import React from 'react';
import { Typography, Box, ButtonBase } from '@mui/material';
import {
  ArrowForward,
  HourglassEmpty,
  MarkEmailUnread,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import DrawCardBase from './DrawCardBase';
import EventDetails from './EventDetails';
import { DrawPreview } from '../../models/Draw';
import { tokens } from '../../styles/theme';

interface DrawPreviewCardProps {
  drawPreview: DrawPreview;
}

// The whole envelope is the link to the draw.
const DrawPreviewCard: React.FC<DrawPreviewCardProps> = ({ drawPreview }) => {
  const { t } = useTranslation();
  const drawn = drawPreview.status === 'DRAWED';
  const missingWish = !drawn && !drawPreview.userWishProvided;

  return (
    <ButtonBase
      component={RouterLink}
      to={`/draw/${drawPreview.id}`}
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        borderRadius: '12px',
        transition: 'transform 160ms ease-out',
        '&:hover': { transform: 'translateY(-2px)' },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
      }}
    >
      <DrawCardBase
        title={drawPreview.drawName}
        description={drawPreview.description}
        status={drawPreview.status}
        airmail={drawn}
      >
        <EventDetails
          eventDate={drawPreview.eventDate}
          eventPlace={drawPreview.eventPlace}
        />

        <Typography color="text.secondary">
          {t('drawCard.participants', { count: drawPreview.participantsCount })}
        </Typography>

        {(drawn || missingWish) && (
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 700,
              color: drawn ? tokens.wax : tokens.amber,
            }}
          >
            {drawn ? <MarkEmailUnread /> : <HourglassEmpty />}
            {drawn ? t('drawCard.checkResults') : t('drawCard.noWish')}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
            fontWeight: 700,
            color: tokens.ink,
          }}
        >
          {t('drawCard.viewDetails')}
          <ArrowForward fontSize="small" />
        </Box>
      </DrawCardBase>
    </ButtonBase>
  );
};

export default DrawPreviewCard;
