import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Add, GroupAdd } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { drawService } from '../services/DrawService';
import { DrawPreview } from '../models/Draw';
import DrawPreviewCard from '../components/draw/DrawPreviewCard';
import ActionButtons from '../components/common/ActionButtons';
import PaperCard from '../components/common/PaperCard';
import HowItWorks from '../components/HowItWorks';
import JoinDrawModal from '../components/draw/JoinDrawModal';
import { appDataService } from '../services/AppDataService';
import { tokens } from '../styles/theme';

const DrawsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
        setTotalDrawsCount(appData.drawsCount);
        setTotalWinnersCount(appData.winnersCount);
      } catch (err) {
        console.error('Error fetching draws:', err);
        setError(t('drawsPage.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, t]);

  // "one of 1 draws" reads oddly, so the real counts show up once they grow.
  const showStats = totalDrawsCount >= 2 && totalWinnersCounts >= 2;

  const actionButtons = [
    {
      icon: <Add />,
      label: t('drawsPage.createButton'),
      onClick: () => navigate('/create'),
    },
    {
      icon: <GroupAdd />,
      label: t('drawsPage.joinButton'),
      variant: 'outlined' as const,
      sx: { color: tokens.snow },
      onClick: () => setIsJoinModalOpen(true),
    },
  ];

  return (
    <MainLayout title={t('drawsPage.title')}>
      <ActionButtons buttons={actionButtons} containerStyles={{ mb: 4 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="inherit" aria-label={t('common.loading')} />
        </Box>
      ) : error ? (
        <PaperCard>
          <Typography sx={{ fontWeight: 700 }}>{error}</Typography>
        </PaperCard>
      ) : drawPreviews.length === 0 ? (
        <PaperCard>
          <Typography variant="h2" sx={{ fontSize: '1.3rem' }}>
            {t('drawsPage.emptyTitle')}
          </Typography>
          <Typography>{t('drawsPage.noDraws')}</Typography>
          <HowItWorks />
        </PaperCard>
      ) : (
        <Box
          component="ul"
          sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2.5 }}
        >
          {drawPreviews.map((drawPreview) => (
            <Box component="li" key={drawPreview.id}>
              <DrawPreviewCard drawPreview={drawPreview} />
            </Box>
          ))}
        </Box>
      )}

      {!loading && showStats && (
        <Typography
          variant="body2"
          sx={{ color: tokens.snowMuted, mt: 4, textAlign: 'center' }}
        >
          {t('drawsPage.stats', {
            count: totalDrawsCount,
            winnersCount: totalWinnersCounts,
          })}
        </Typography>
      )}

      <JoinDrawModal
        open={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </MainLayout>
  );
};

export default DrawsListPage;
