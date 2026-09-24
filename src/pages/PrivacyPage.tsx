import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import { tokens } from '../styles/theme';
import { LAST_UPDATED, privacyPolicy } from './privacyPolicy';

// Open to everyone, signed in or not.
const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'en' ? 'en' : 'pl';

  return (
    <MainLayout>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ color: tokens.snow, mb: 1.5 }}>
          {t('privacy.title')}
        </Typography>
        <Typography sx={{ color: tokens.snowMuted }}>
          {t('privacy.updated', {
            date: format(new Date(LAST_UPDATED), 'd MMMM yyyy', {
              locale: language === 'pl' ? pl : enUS,
            }),
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
