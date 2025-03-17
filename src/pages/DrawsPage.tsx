import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import { Add, GroupAdd } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { drawService } from '../services/DrawService';
import { DrawPreview } from '../models/Draw';
import DrawPreviewCard from '../components/draw/DrawPreviewCard';
import ActionButtons from '../components/common/ActionButtons';
import {
  pageContainerStyles,
  loadingContainerStyles,
  errorMessageStyles,
  emptyStateContainerStyles,
  emptyStateTextStyles,
  createLinkStyles,
  actionButtonsContainerStyles,
  joinButtonStyles,
  createButtonStyles,
} from '../styles/drawsPageStyles';

const DrawsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [drawPreviews, setDrawPreviews] = useState<DrawPreview[]>([]);
  const [totalDrawsCount, setTotalDrawsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch user's draws
        const userDraws = await drawService.getDrawPreviews(user.uid);
        setDrawPreviews(userDraws);

        // Fetch total draws count and add 100 to make it appear like there are more users
        const count = await drawService.getTotalDrawsCount();
        setTotalDrawsCount(count + 100); // Adding 100 to the actual count
      } catch (err) {
        console.error('Error fetching draws:', err);
        setError(t('drawsPage.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, t]);

  if (loading) {
    return (
      <MainLayout title={t('drawsPage.title')}>
        <Box sx={loadingContainerStyles}>
          <CircularProgress color="inherit" />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title={t('drawsPage.title')}>
        <Typography color="error" sx={errorMessageStyles}>
          {error}
        </Typography>
      </MainLayout>
    );
  }

  // Define action buttons for reuse
  const actionButtons = [
    {
      icon: <GroupAdd />,
      label: t('drawsPage.joinButton'),
      color: 'success' as const,
      customStyles: joinButtonStyles(theme),
    },
    {
      icon: <Add />,
      label: t('drawsPage.createButton'),
      onClick: () => navigate('/create'),
      color: 'primary' as const,
      customStyles: createButtonStyles(theme),
    },
  ];

  return (
    <MainLayout title={t('drawsPage.title')}>
      <Box sx={pageContainerStyles}>
        {drawPreviews.length === 0 ? (
          <Box sx={emptyStateContainerStyles}>
            <Typography sx={emptyStateTextStyles(theme)}>
              {t('drawsPage.noDraws')}{' '}
              <Link
                component="span"
                onClick={() => navigate('/create')}
                sx={createLinkStyles(theme)}
              >
                {t('drawsPage.createOwn')}
              </Link>{' '}
              {t('drawsPage.totalDrawsPrompt', { count: totalDrawsCount })}
            </Typography>
          </Box>
        ) : (
          drawPreviews.map((drawPreview) => <DrawPreviewCard key={drawPreview.id} drawPreview={drawPreview} />)
        )}

        <ActionButtons
          buttons={actionButtons}
          containerStyles={actionButtonsContainerStyles}
        />
      </Box>
    </MainLayout>
  );
};

export default DrawsPage;
