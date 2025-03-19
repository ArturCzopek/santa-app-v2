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
import JoinDrawModal from '../components/draw/JoinDrawModal';
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
  appDataContainerStyles,
} from '../styles/drawsPageStyles';
import { appDataService } from '../services/AppDataService';

const DrawsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [drawPreviews, setDrawPreviews] = useState<DrawPreview[]>([]);
  const [totalDrawsCount, setTotalDrawsCount] = useState<number>(0);
  const [totalWinnersCounts, setTotalWinnersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userDraws = await drawService.getDrawPreviews(user.uid);
        setDrawPreviews(userDraws);
        const appData = await appDataService.getAppData();
        setTotalDrawsCount(appData.drawsCount + 100);
        setTotalWinnersCount(appData.winnersCount + 314);
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

  const actionButtons = [
    {
      icon: <GroupAdd />,
      label: t('drawsPage.joinButton'),
      color: 'success' as const,
      customStyles: joinButtonStyles(theme),
      onClick: () => setIsJoinModalOpen(true),
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
              {t('drawsPage.totalDrawsPrompt', {
                count: totalDrawsCount,
                winnersCount: totalWinnersCounts,
              })}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={appDataContainerStyles}>
              <Typography sx={emptyStateTextStyles(theme)}>
                {t('drawsPage.totalDrawsPromptWithData', {
                  count: totalDrawsCount,
                  winnersCount: totalWinnersCounts,
                })}
              </Typography>
            </Box>

            {drawPreviews.map((drawPreview) => (
              <DrawPreviewCard key={drawPreview.id} drawPreview={drawPreview} />
            ))}
          </>
        )}

        <ActionButtons
          buttons={actionButtons}
          containerStyles={actionButtonsContainerStyles}
        />

        <JoinDrawModal
          open={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
        />
      </Box>
    </MainLayout>
  );
};

export default DrawsListPage;
