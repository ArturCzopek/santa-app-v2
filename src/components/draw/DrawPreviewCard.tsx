import React, { useId } from 'react';
import { Typography, Box, ButtonBase } from '@mui/material';
import {
  ArrowForward,
  DraftsOutlined,
  HourglassEmpty,
  MarkEmailUnread,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import DrawCardBase from './DrawCardBase';
import EventDetails from './EventDetails';
import { DrawPreview } from '../../models/Draw';
import { tokens } from '../../styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { wasEnvelopeOpened } from '../../services/envelope';

interface DrawPreviewCardProps {
  drawPreview: DrawPreview;
}

// The whole envelope is the link to the draw.
const DrawPreviewCard: React.FC<DrawPreviewCardProps> = ({ drawPreview }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const titleId = useId();
  const statusId = useId();
  const drawn = drawPreview.status === 'DRAWED';
  const missingWish = !drawn && !drawPreview.userWishProvided;
  // Once opened, the card stops asking to open the envelope.
  const opened =
    drawn && !!user && wasEnvelopeOpened(drawPreview.id ?? '', user.uid);

  return (
    <ButtonBase
      component={RouterLink}
      aria-labelledby={titleId}
      aria-describedby={drawn || missingWish ? statusId : undefined}
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
        titleId={titleId}
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
            id={statusId}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 700,
              color: opened ? tokens.ink : drawn ? tokens.wax : tokens.amber,
            }}
          >
            {opened ? (
              <DraftsOutlined aria-hidden />
            ) : drawn ? (
              <MarkEmailUnread aria-hidden />
            ) : (
              <HourglassEmpty aria-hidden />
            )}
            {opened
              ? t('drawCard.envelopeOpened')
              : drawn
                ? t('drawCard.checkResults')
                : t('drawCard.noWish')}
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
