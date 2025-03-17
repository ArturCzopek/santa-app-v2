// pages/DrawPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useTheme, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowBack, PlayArrow } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import DrawDetailCard from '../components/draw/DrawDetailCard';
import { drawService } from '../services/DrawService';
import { Draw } from '../models/Draw';
import {
  pageContainerStyles,
  backButtonContainerStyles,
  backButtonStyles,
  loadingContainerStyles,
  errorMessageStyles,
  actionButtonContainerStyles,
  drawActionButtonStyles
} from '../styles/drawPageStyles';
import { useAuth } from '../hooks/useAuth';
import UserWishSection from '../components/draw/UserWishSection';

const DrawPage = () => {
  const { drawId } = useParams<{ drawId: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrawDetails = async () => {
      if (!drawId) return;

      try {
        setLoading(true);
        const drawData = await drawService.getDrawDetails(drawId);
        setDraw(drawData);
      } catch (err) {
        console.error('Error fetching draw details:', err);
        setError(t('drawPage.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchDrawDetails();
  }, [drawId, t]);

  // Check if current user is the draw owner
  const isOwner = draw && user && draw.ownerUuid === user.uid;
  // Check if draw is in waiting for draw status
  const isWaitingForDraw = draw && draw.status === 'WAITING_FOR_DRAW';
  // Determine if action button should be shown
  const showActionButton = isOwner && isWaitingForDraw;

  // Mock action for the button
  const handleStartDraw = () => {
    alert('Draw action will be implemented soon!');
  };

  const handleDrawUpdated = (updatedDraw: Draw) => {
    setDraw(updatedDraw);
  };

  if (loading) {
    return (
      <MainLayout title={t('drawPage.title')}>
        <Box sx={loadingContainerStyles}>
          <CircularProgress color="inherit" />
        </Box>
      </MainLayout>
    );
  }

  if (error || !draw) {
    return (
      <MainLayout title={t('drawPage.title')}>
        <Typography color="error" sx={errorMessageStyles}>
          {error || t('drawPage.errors.drawNotFound')}
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t('drawPage.title')}>
      <Box sx={pageContainerStyles}>
        {/* Back button and action button container */}
        <Box sx={backButtonContainerStyles}>
          <Box sx={actionButtonContainerStyles}>
            {/* Back button */}
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/draws')}
              sx={backButtonStyles(theme)}
            >
              {t('common.backToDraws')}
            </Button>

            {/* Conditional action button */}
            {showActionButton && (
              <Button
                variant="contained"
                color="error"
                startIcon={<PlayArrow />}
                onClick={handleStartDraw}
                sx={drawActionButtonStyles(theme)}
              >
                {t('drawPage.startDrawButton')}
              </Button>
            )}
          </Box>
        </Box>

        <DrawDetailCard draw={draw} />
        <UserWishSection draw={draw} onDrawUpdated={handleDrawUpdated} />
      </Box>
    </MainLayout>
  );
};

export default DrawPage;