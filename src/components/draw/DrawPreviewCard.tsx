import React from 'react';
import { Typography, Box, Button, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import DrawCardBase from './DrawCardBase';
import { DrawPreview } from '../../models/Draw';
import {
  previewCardStyles,
  participantsStyles,
  noWishStyles,
  resultStyles,
  actionContainerStyles,
  viewDetailsButtonStyles,
} from '../../styles/drawCardStyles';

interface DrawPreviewCardProps {
  drawPreview: DrawPreview;
}

const DrawPreviewCard: React.FC<DrawPreviewCardProps> = ({ drawPreview }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const isUserWishEmpty = () => {
    if (drawPreview.status === 'WAITING_FOR_DRAW' && user) {
      return !drawPreview.userWishProvided;
    }
    return false;
  };

  return (
    <DrawCardBase
      title={drawPreview.drawName}
      description={drawPreview.description}
      status={drawPreview.status}
      cardStyles={previewCardStyles(theme)}
    >
      <Typography sx={participantsStyles(theme)}>
        {t('drawCard.participants', { count: drawPreview.participantsCount })}
      </Typography>

      {drawPreview.status === 'WAITING_FOR_DRAW' && isUserWishEmpty() && (
        <Typography sx={noWishStyles(theme)}>
          {t('drawPage.wishSection.noWishWarning')}
        </Typography>
      )}

      {drawPreview.status === 'DRAWED' && (
        <Typography sx={resultStyles()}>
          {t('drawCard.checkResults')}
        </Typography>
      )}

      <Box sx={actionContainerStyles}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/draw/${drawPreview.id}`)}
          sx={viewDetailsButtonStyles(theme)}
        >
          {t('drawCard.viewDetails')}
        </Button>
      </Box>
    </DrawCardBase>
  );
};

export default DrawPreviewCard;
