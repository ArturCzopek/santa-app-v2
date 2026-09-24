import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import StampAvatar from '../components/common/StampAvatar';
import HowItWorks from '../components/HowItWorks';
import InAppBrowserNotice from '../components/InAppBrowserNotice';
import GoogleSignInButton from '../components/GoogleSignInButton';
import PasswordField from '../components/form/PasswordField';
import { drawService } from '../services/DrawService';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import { Draw } from '../models/Draw';
import { tokens } from '../styles/theme';

const PageIntro: React.FC<{ title: string; lead?: string }> = ({
  title,
  lead,
}) => (
  <Box component="header" sx={{ mb: 3 }}>
    <Typography variant="h1" sx={{ color: tokens.snow, mb: lead ? 1.5 : 0 }}>
      {title}
    </Typography>
    {lead && (
      <Typography sx={{ color: tokens.snowMuted, fontSize: '1.125rem' }}>
        {lead}
      </Typography>
    )}
  </Box>
);

const JoinToDrawPage = () => {
  const { drawId } = useParams<{ drawId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();

  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDrawDetails = async () => {
      if (!drawId) return;

      try {
        setLoading(true);
        setDraw(await drawService.getDraw(drawId));
      } catch (err) {
        console.error('Error fetching draw details:', err);
        setError(t('joinPage.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDrawDetails();
    }
  }, [drawId, user, t]);

  const handleJoinDraw = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !draw) return;

    setPasswordError(null);

    if (!password.trim()) {
      setPasswordError(t('joinPage.errors.passwordRequired'));
      passwordRef.current?.focus();
      return;
    }

    setJoining(true);
    try {
      await drawService.joinToDraw(draw.id as string, user, password);
      notify(t('joinPage.success'), 'success');
      navigate(`/draw/${draw.id}`, { state: { justJoined: true } });
    } catch (err: unknown) {
      console.error('Error joining draw:', err);

      if (err instanceof Error && err.message.includes('Invalid password')) {
        setPasswordError(t('joinPage.errors.invalidPassword'));
        passwordRef.current?.focus();
      } else {
        notify(t('joinPage.errors.joinFailed'));
      }
    } finally {
      setJoining(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <PageIntro
          title={t('joinPage.title')}
          lead={t('joinPage.loginRequired')}
        />
        <PaperCard airmail>
          <HowItWorks />
          <InAppBrowserNotice />
          <GoogleSignInButton />
        </PaperCard>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="inherit" aria-label={t('common.loading')} />
        </Box>
      </MainLayout>
    );
  }

  if (error || !draw || draw.status !== 'WAITING_FOR_DRAW') {
    const message = error
      ? error
      : !draw
        ? t('joinPage.errors.drawNotFound')
        : t('joinPage.errors.drawAlreadyStarted');

    // Someone who already joined just wants to see the draw.
    if (draw && draw.participantUuids.includes(user.uid)) {
      return <Navigate to={`/draw/${draw.id}`} replace />;
    }

    return (
      <MainLayout>
        <PageIntro title={t('joinPage.title')} />
        <PaperCard>
          <Typography sx={{ fontWeight: 700 }}>{message}</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/draws')}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('common.backToDraws')}
          </Button>
        </PaperCard>
      </MainLayout>
    );
  }

  if (draw.participantUuids.includes(user.uid)) {
    return <Navigate to={`/draw/${draw.id}`} replace />;
  }

  return (
    <MainLayout>
      <PageIntro
        title={t('joinPage.title')}
        lead={t('joinPage.invitedBy', { name: draw.ownerName })}
      />

      <PaperCard airmail onSubmit={handleJoinDraw}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StampAvatar name={draw.ownerName} photoUrl={draw.ownerPhotoUrl} />
          <Typography color="text.secondary">
            {t('joinPage.createdBy', { name: draw.ownerName })}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 0.5 }}>
            {draw.drawName}
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>
            {t('drawCard.budget', {
              budget: draw.budget,
              currency: draw.currency,
            })}
          </Typography>
        </Box>

        {draw.description && (
          <Typography color="text.secondary">{draw.description}</Typography>
        )}

        <Box sx={{ borderTop: `1px dashed ${tokens.paperLine}`, pt: 2.5 }}>
          <PasswordField
            label={t('joinPage.passwordLabel')}
            value={password}
            onChange={setPassword}
            error={passwordError}
            inputRef={passwordRef}
            helperText={t('joinPage.passwordHint')}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={joining}
        >
          {joining ? t('common.joining') : t('joinPage.joinButton')}
        </Button>
      </PaperCard>
    </MainLayout>
  );
};

export default JoinToDrawPage;
