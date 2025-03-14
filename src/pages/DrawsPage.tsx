import React from 'react';
import { Typography } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const DrawsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <MainLayout title={t('drawsPage.title', 'All Draws')}>
      {user && (
        <Typography
          variant="h6"
          component="h2"
          sx={{
            marginBottom: 4,
            color: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          {user.displayName}
        </Typography>
      )}
    </MainLayout>
  );
};

export default DrawsPage;