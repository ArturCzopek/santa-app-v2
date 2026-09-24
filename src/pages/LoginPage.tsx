import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Location, Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import HowItWorks from '../components/HowItWorks';
import InAppBrowserNotice from '../components/InAppBrowserNotice';
import GoogleSignInButton from '../components/GoogleSignInButton';
import YouTubeEmbed from '../components/YouTubeEmbed';
import SectionHeading from '../components/draw/SectionHeading';
import { tokens } from '../styles/theme';

const LoginPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  // Set by protected routes when a guest opens them (e.g. from a link).
  const from = (useLocation().state as { from?: Location } | null)?.from;

  if (user) {
    return <Navigate to={from ?? '/draws'} replace />;
  }

  return (
    <MainLayout>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, sm: 5 } }}
      >
        <Box component="header">
          <Typography variant="h1" sx={{ color: tokens.snow, mb: 1.5 }}>
            {t('loginPage.title')}
          </Typography>
          <Typography
            sx={{
              color: tokens.snowMuted,
              fontSize: '1.125rem',
              maxWidth: '60ch',
            }}
          >
            {t('loginPage.lead')}
          </Typography>
        </Box>

        <PaperCard airmail>
          <HowItWorks />
          <InAppBrowserNotice />
          <GoogleSignInButton />
        </PaperCard>

        <Box component="section">
          <SectionHeading>{t('loginPage.videoTitle')}</SectionHeading>
          <PaperCard sx={{ p: { xs: 1, sm: 1.5 } }}>
            <YouTubeEmbed videoId="z59gAXZ0ksQ" title="Dubstep Santa" />
          </PaperCard>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default LoginPage;
