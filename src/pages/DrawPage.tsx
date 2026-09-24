import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowBack, PlayArrow, PersonAdd } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import DrawHeader from '../components/draw/DrawHeader';
import ParticipantsSection from '../components/draw/ParticipantsSection';
import WinnerSection from '../components/draw/WinnerSection';
import StartDrawModal from '../components/draw/StartDrawModal';
import InviteDrawModal from '../components/draw/InviteDrawModal';
import { drawService } from '../services/DrawService';
import { Draw } from '../models/Draw';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import UserWishSection from '../components/draw/UserWishSection';
import { drawingService } from '../services/DrawingService';
import { tokens } from '../styles/theme';

const BackToDraws = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      color="inherit"
      startIcon={<ArrowBack />}
      onClick={() => navigate('/draws')}
      sx={{ alignSelf: 'flex-start', ml: -1.5, color: tokens.snowMuted }}
    >
      {t('common.backToDraws')}
    </Button>
  );
};

const DrawPage = () => {
  const { drawId } = useParams<{ drawId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();
  // Set by the join page, so a new participant lands in the letter editor.
  const justJoined = !!(useLocation().state as { justJoined?: boolean } | null)
    ?.justJoined;

  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartDrawModalOpen, setIsStartDrawModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchDrawDetails = async () => {
      if (!drawId || !user) return;

      try {
        setLoading(true);
        const drawData = await drawService.getDraw(drawId);

        if (!drawData.participantUuids.includes(user.uid)) {
          console.warn('Access denied: User is not a participant in this draw');
          setAccessDenied(true);
          setError(t('drawPage.errors.accessDenied'));
          return;
        }

        const participants = await drawService.getParticipants(drawId);
        setDraw({ ...drawData, participants });
      } catch (err) {
        console.error('Error fetching draw details:', err);
        setError(t('drawPage.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchDrawDetails();
  }, [drawId, t, user]);

  const isOwner = !!draw && !!user && draw.ownerUuid === user.uid;
  const isWaiting = draw?.status === 'WAITING_FOR_DRAW';
  const showStartButton =
    isOwner && isWaiting && (draw?.participantUuids.length ?? 0) >= 2;

  const handleStartDraw = async () => {
    if (!draw || !drawId || !user) return;

    try {
      const updatedDraw = await drawingService.startDraw(drawId, user.uid);
      setDraw({
        ...draw,
        status: updatedDraw.status,
        drawDate: updatedDraw.drawDate,
      });
      setIsStartDrawModalOpen(false);
      notify(t('drawPage.drawSuccessMessage'), 'success');
    } catch (err) {
      console.error('Error starting draw:', err);
      notify(t('drawPage.errors.startDrawFailed'));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="inherit" aria-label={t('common.loading')} />
        </Box>
      </MainLayout>
    );
  }

  if (error || !draw || accessDenied) {
    return (
      <MainLayout title={t('drawPage.title')}>
        <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 2 }}>
          {error || t('drawPage.errors.drawNotFound')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/draws')}
        >
          {t('common.backToDraws')}
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, sm: 5 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <BackToDraws />
          <DrawHeader draw={draw} />

          {isWaiting && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                '& > *': { flex: { xs: '1 1 100%', sm: '0 0 auto' } },
              }}
            >
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setIsInviteModalOpen(true)}
              >
                {t('drawPage.inviteButton')}
              </Button>

              {showStartButton && (
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<PlayArrow />}
                  onClick={() => setIsStartDrawModalOpen(true)}
                  sx={{ color: tokens.snow }}
                >
                  {t('drawPage.startDrawButton')}
                </Button>
              )}
            </Box>
          )}
        </Box>

        {draw.status === 'DRAWED' && <WinnerSection draw={draw} />}

        {/* Still editable after the draw, so the Santa sees the latest wish. */}
        <UserWishSection
          draw={draw}
          onDrawUpdated={setDraw}
          startEditing={justJoined && isWaiting}
        />

        <ParticipantsSection draw={draw} />
      </Box>

      {showStartButton && (
        <StartDrawModal
          open={isStartDrawModalOpen}
          onClose={() => setIsStartDrawModalOpen(false)}
          onConfirm={handleStartDraw}
          drawId={draw.id || ''}
          withoutWish={draw.participants
            .filter((p) => !p.wish)
            .map((p) => p.userName)}
        />
      )}

      <InviteDrawModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        drawId={draw.id || ''}
      />
    </MainLayout>
  );
};

export default DrawPage;
