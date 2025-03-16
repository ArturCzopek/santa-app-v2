import React from 'react';
import { Typography, Box, Chip, Button, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import ContentCard from './ContentCard';
import { DrawPreview } from '../models/Draw';
import {
  cardStyles,
  cardHeaderStyles,
  cardTitleStyles,
  waitingChipStyles,
  completedChipStyles,
  descriptionStyles,
  participantsStyles,
  noWishStyles,
  resultStyles,
  actionContainerStyles,
  viewDetailsButtonStyles,
} from '../styles/drawCardStyles';

interface DrawPreviewCardProps {
  draw: DrawPreview;
}

const DrawPreviewCard: React.FC<DrawPreviewCardProps> = ({ draw }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const isUserWishEmpty = () => {
    if (draw.status === 'WAITING_FOR_DRAW' && user) {
      // Find current user's participant entry and check if wish is empty
      return !draw.userWishProvided;
    }
    return false;
  };

  const getStatusChip = () => {
    if (draw.status === 'WAITING_FOR_DRAW') {
      return (
        <Chip
          label={t('drawCard.waitingStatus')}
          color="warning"
          sx={waitingChipStyles(theme)}
        />
      );
    } else {
      return (
        <Chip
          label={t('drawCard.drawedStatus')}
          color="success"
          sx={completedChipStyles(theme)}
        />
      );
    }
  };

  return (
    <ContentCard sx={cardStyles(theme)}>
      <Box sx={cardHeaderStyles}>
        <Box>
          <Typography variant="h4" sx={cardTitleStyles(theme)}>
            {draw.drawName}
          </Typography>
        </Box>
        <Box>{getStatusChip()}</Box>
      </Box>
      <Typography variant="body2" sx={descriptionStyles()}>
        {draw.description}
      </Typography>
      <Typography sx={participantsStyles(theme)}>
        {t('drawCard.participants', { count: draw.participantsCount })}
      </Typography>

      {draw.status === 'WAITING_FOR_DRAW' && isUserWishEmpty() && (
        <Typography sx={noWishStyles(theme)}>{t('drawCard.noWish')}</Typography>
      )}

      {draw.status === 'DRAWED' && (
        <Typography sx={resultStyles()}>
          {t('drawCard.checkResults')}
        </Typography>
      )}

      <Box sx={actionContainerStyles}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/draw/${draw.id}`)}
          sx={viewDetailsButtonStyles(theme)}
        >
          {t('drawCard.viewDetails')}
        </Button>
      </Box>
    </ContentCard>
  );
};

export default DrawPreviewCard;
