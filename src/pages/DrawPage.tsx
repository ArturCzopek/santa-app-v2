import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowBack, PlayArrow, PersonAdd } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import DrawDetailCard from '../components/draw/DrawDetailCard';
import ParticipantsSection from '../components/draw/ParticipantsSection';
import WinnerSection from '../components/draw/WinnerSection';
import StartDrawModal from '../components/draw/StartDrawModal';
import InviteDrawModal from '../components/draw/InviteDrawModal';
import { drawService } from '../services/DrawService';
import { Draw } from '../models/Draw';
import {
  pageContainerStyles,
  backButtonContainerStyles,
  backButtonStyles,
  loadingContainerStyles,
  errorMessageStyles,
  actionButtonContainerStyles,
  drawActionButtonStyles,
} from '../styles/drawPageStyles';
import { useAuth } from '../hooks/useAuth';
import UserWishSection from '../components/draw/UserWishSection';
import { drawingService } from '../services/DrawingService';
import { inviteButtonStyles } from '../styles/inviteModalStyles';

const DrawPage = () => {
  const { drawId } = useParams<{ drawId: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartDrawModalOpen, setIsStartDrawModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [drawSuccess, setDrawSuccess] = useState(false);

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

  // Determine if action button should be shown
  const showActionButton =
    draw &&
    user &&
    draw.ownerUuid === user.uid &&
    draw.status === 'WAITING_FOR_DRAW' &&
    draw.participants.length >= 2;

  const showInviteButton = draw && draw.status === 'WAITING_FOR_DRAW';

  const handleStartDraw = async () => {
    if (!draw || !drawId || !user) return;

    try {
      const updatedDraw = await drawingService.startDraw(drawId, user.uid);
      setDraw(updatedDraw);
      setIsStartDrawModalOpen(false);
      setDrawSuccess(true);

      setTimeout(() => {
        setDrawSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error starting draw:', err);
      alert(err instanceof Error ? err.message : 'Failed to start draw');
    }
  };

  const handleDrawUpdated = (updatedDraw: Draw) => {
    setDraw(updatedDraw);
  };

  const handleCloseDrawSuccess = () => {
    setDrawSuccess(false);
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
        <Box sx={backButtonContainerStyles}>
          <Box sx={actionButtonContainerStyles}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/draws')}
              sx={backButtonStyles(theme)}
            >
              {t('common.backToDraws')}
            </Button>

            {showInviteButton && (
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setIsInviteModalOpen(true)}
                sx={inviteButtonStyles()}
              >
                {t('drawPage.inviteButton')}
              </Button>
            )}

            {showActionButton && (
              <Button
                variant="contained"
                color="error"
                startIcon={<PlayArrow />}
                onClick={() => setIsStartDrawModalOpen(true)}
                sx={drawActionButtonStyles(theme)}
              >
                {t('drawPage.startDrawButton')}
              </Button>
            )}
          </Box>
        </Box>

        <DrawDetailCard draw={draw} />

        {draw.status !== 'DRAWED' ? (
          <UserWishSection draw={draw} onDrawUpdated={handleDrawUpdated} />
        ) : (
          <WinnerSection draw={draw} />
        )}

        <ParticipantsSection draw={draw} />

        {showActionButton && (
          <StartDrawModal
            open={isStartDrawModalOpen}
            onClose={() => setIsStartDrawModalOpen(false)}
            onConfirm={handleStartDraw}
            drawPassword={draw.password || ''}
          />
        )}

        <InviteDrawModal
          open={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          drawId={draw.id || ''}
        />

        <Snackbar
          open={drawSuccess}
          autoHideDuration={2000}
          onClose={handleCloseDrawSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseDrawSuccess}
            severity="success"
            sx={{ width: '100%' }}
          >
            {t('drawPage.drawSuccessMessage')}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default DrawPage;
