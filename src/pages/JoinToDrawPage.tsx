// pages/JoinToDrawPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../components/layout/MainLayout';
import ContentCard from '../components/common/ContentCard';
import DrawCardBase from '../components/draw/DrawCardBase';
import { drawService } from '../services/DrawService';
import { useAuth } from '../hooks/useAuth';
import { Draw } from '../models/Draw';
import {
  inputStyles,
  inputLabelStyles,
  errorStyles,
  passwordSectionStyles,
  passwordLabelStyles,
} from '../styles/formStyles';
import {
  pageContainerStyles,
  loadingContainerStyles,
  errorMessageStyles,
  detailCardStyles,
  ownerSectionContainerStyles,
  ownerSectionTitleStyles,
  ownerAvatarStyles,
  actionContainerStyles,
  joinButtonStyles,
} from '../styles/joinPageStyles';
import { cardBaseStyles } from '../styles/drawCardStyles';

const JoinToDrawPage = () => {
  const { drawId } = useParams<{ drawId: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<boolean>(false);
  const [joinSuccess, setJoinSuccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const isUserParticipant = user && draw?.participantUuids?.includes(user.uid);
  const canJoinDraw =
    draw && draw.status === 'WAITING_FOR_DRAW' && !isUserParticipant;
  const ownerParticipant = draw?.participants.find(
    (p) => p.userUuid === draw.ownerUuid,
  );

  useEffect(() => {
    if (!user && drawId) {
      sessionStorage.setItem('redirectAfterLogin', `/join/${drawId}`);
    }

    if (user) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');

        if (window.location.pathname !== redirectPath) {
          navigate(redirectPath);
        }
      }
    }
  }, [user, drawId, navigate]);

  useEffect(() => {
    const fetchDrawDetails = async () => {
      if (!drawId) return;

      try {
        setLoading(true);
        const drawData = await drawService.getDrawDetails(drawId);
        setDraw(drawData);
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleJoinDraw = async () => {
    if (!user || !draw || !canJoinDraw) return;

    setPasswordError(null);

    if (!password.trim()) {
      setPasswordError(t('joinPage.errors.passwordRequired'));
      return;
    }

    if (password.length < 4) {
      setPasswordError(t('createPage.validation.passwordTooShort'));
      return;
    }

    setJoining(true);
    try {
      await drawService.joinToDraw(draw.id as string, user, password);

      setJoinSuccess(true);
      setTimeout(() => {
        navigate(`/draw/${draw.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error joining draw:', err);

      if (err.message.includes('Invalid password')) {
        setPasswordError(t('joinPage.errors.invalidPassword'));
      } else {
        setSnackbarMessage(t('joinPage.errors.joinFailed'));
        setSnackbarOpen(true);
      }
    } finally {
      setJoining(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!user) {
    return (
      <MainLayout title={t('joinPage.title')}>
        <Box sx={pageContainerStyles}>
          <ContentCard
            sx={{ maxWidth: '600px', p: 3, ...cardBaseStyles(theme) }}
          >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              {t('joinPage.loginRequired')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={signInWithGoogle}
                sx={{
                  mt: 2,
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                }}
              >
                {t('loginPage.loginWithGoogle')}
              </Button>
            </Box>
          </ContentCard>
        </Box>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout title={t('joinPage.title')}>
        <Box sx={loadingContainerStyles}>
          <CircularProgress color="inherit" />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title={t('joinPage.title')}>
        <Typography color="error" sx={errorMessageStyles}>
          {error}
        </Typography>
      </MainLayout>
    );
  }

  if (!draw) {
    return (
      <MainLayout title={t('joinPage.title')}>
        <Typography color="error" sx={errorMessageStyles}>
          {t('joinPage.errors.drawNotFound')}
        </Typography>
      </MainLayout>
    );
  }

  if (isUserParticipant) {
    return (
      <MainLayout title={t('joinPage.title')}>
        <Box sx={pageContainerStyles}>
          <ContentCard
            sx={{ maxWidth: '600px', p: 3, ...cardBaseStyles(theme) }}
          >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              {t('joinPage.alreadyParticipating')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/draw/${draw.id}`)}
                sx={{
                  mt: 2,
                  fontWeight: 'bold',
                }}
              >
                {t('joinPage.viewDraw')}
              </Button>
            </Box>
          </ContentCard>
        </Box>
      </MainLayout>
    );
  }

  if (draw.status !== 'WAITING_FOR_DRAW') {
    return (
      <MainLayout title={t('joinPage.title')}>
        <Box sx={pageContainerStyles}>
          <ContentCard
            sx={{ maxWidth: '600px', p: 3, ...cardBaseStyles(theme) }}
          >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              {t('joinPage.errors.drawAlreadyStarted')}
            </Typography>
          </ContentCard>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t('joinPage.title')}>
      <Box sx={pageContainerStyles}>
        {joinSuccess && (
          <Alert
            severity="success"
            sx={{
              width: '100%',
              maxWidth: '600px',
              mb: 3,
            }}
          >
            {t('joinPage.success')}
          </Alert>
        )}

        <DrawCardBase
          title={draw.drawName}
          description={draw.description}
          status={draw.status}
          budget={draw.budget}
          currency={draw.currency}
          drawDate={draw.drawDate}
          showMetadata={true}
          cardStyles={detailCardStyles(theme)}
        >
          <Box sx={ownerSectionContainerStyles}>
            <Typography variant="h6" sx={ownerSectionTitleStyles(theme)}>
              {t('joinPage.createdBy', { name: draw.ownerName })}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                my: 2,
              }}
            >
              <Avatar
                src={ownerParticipant?.userPhotoUrl || undefined}
                alt={draw.ownerName}
                sx={ownerAvatarStyles}
              >
                {!ownerParticipant?.userPhotoUrl &&
                  draw.ownerName[0].toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          <Box sx={passwordSectionStyles}>
            <Typography variant="subtitle1" sx={passwordLabelStyles(theme)}>
              {t('joinPage.passwordLabel')}
            </Typography>

            <TextField
              label={t('createPage.password')}
              variant="outlined"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                sx: inputStyles(theme),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: inputLabelStyles(theme),
              }}
              sx={errorStyles(theme)}
            />
          </Box>

          <Box sx={actionContainerStyles}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={joining || !canJoinDraw}
              onClick={handleJoinDraw}
              sx={joinButtonStyles(theme)}
            >
              {joining ? t('common.joining') : t('joinPage.joinButton')}
            </Button>
          </Box>
        </DrawCardBase>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default JoinToDrawPage;
