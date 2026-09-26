import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import { longDate } from '../components/draw/EventDetails';
import { tokens } from '../styles/theme';
import { LAST_UPDATED, privacyPolicy } from './privacyPolicy';

// Open to everyone, signed in or not.
const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const language = i18n.language === 'en' ? 'en' : 'pl';

  return (
    <MainLayout>
      {/* Guests arrive here from the login page and need a way back too. */}
      <Button
        color="inherit"
        startIcon={<ArrowBack />}
        onClick={() => navigate(user ? '/draws' : '/')}
        sx={{ ml: -1.5, mb: 2, color: tokens.snowMuted }}
      >
        {user ? t('common.backToDraws') : t('common.backHome')}
      </Button>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ color: tokens.snow, mb: 1.5 }}>
          {t('privacy.title')}
        </Typography>
        <Typography sx={{ color: tokens.snowMuted }}>
          {t('privacy.updated', {
            date: longDate(new Date(LAST_UPDATED), language),
          })}
        </Typography>
      </Box>

      <PaperCard sx={{ gap: 3 }}>
        {privacyPolicy[language].map((section) => (
          <Box component="section" key={section.heading}>
            <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 1 }}>
              {section.heading}
            </Typography>
            {section.paragraphs?.map((paragraph) => (
              <Typography key={paragraph} sx={{ mb: 1 }}>
                {paragraph}
              </Typography>
            ))}
            {section.items && (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {section.items.map((item) => (
                  <Typography component="li" key={item} sx={{ mb: 0.75 }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </PaperCard>
    </MainLayout>
  );
};

export default PrivacyPage;
