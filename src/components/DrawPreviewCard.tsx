import React from 'react';
import { Typography, Box, Chip, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import ContentCard from './ContentCard';
import { DrawPreview } from '../models/Draw';

interface DrawPreviewCardProps {
  draw: DrawPreview;
}

const DrawPreviewCard: React.FC<DrawPreviewCardProps> = ({ draw }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
          sx={{
            fontWeight: 'bold',
            backgroundColor: '#FF9800',
            color: 'white',
          }}
        />
      );
    } else {
      return (
        <Chip
          label={t('drawCard.drawedStatus')}
          color="success"
          sx={{
            fontWeight: 'bold',
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
        />
      );
    }
  };

  return (
    <ContentCard sx={{ mb: 2, p: 3, backgroundColor: 'rgba(0, 43, 0, 0.7)' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}
          >
            {draw.drawName}
          </Typography>
        </Box>
        <Box>{getStatusChip()}</Box>
      </Box>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        {draw.description}
      </Typography>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        {t('drawCard.participants', { count: draw.participantsCount })}
      </Typography>

      {draw.status === 'WAITING_FOR_DRAW' && isUserWishEmpty() && (
        <Typography sx={{ color: '#FFD54F', fontWeight: 'medium' }}>
          {t('drawCard.noWish')}
        </Typography>
      )}

      {draw.status === 'DRAWED' && (
        <Typography sx={{ color: '#81C784', fontWeight: 'medium' }}>
          {t('drawCard.checkResults')}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/draw/${draw.id}`)}
          sx={{
            backgroundColor: '#FFC107', // Amber color
            color: 'rgba(0, 0, 0, 0.87)', // Dark text for contrast
            '&:hover': {
              backgroundColor: '#FFD54F', // Lighter amber on hover
            },
          }}
        >
          {t('drawCard.viewDetails')}
        </Button>
      </Box>
    </ContentCard>
  );
};

export default DrawPreviewCard;
