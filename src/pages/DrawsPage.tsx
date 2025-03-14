// pages/DrawsPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Link, Typography } from '@mui/material';
import { Add, GroupAdd } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { drawService } from '../services/DrawService';
import { Draw } from '../models/Draw';
import DrawPreviewCard from '../components/DrawPreviewCard';

const DrawsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [draws, setDraws] = useState<Draw[]>([]);
  const [totalDrawsCount, setTotalDrawsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch user's draws
        const userDraws = await drawService.getUserDraws(user.uid);
        setDraws(userDraws);

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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="inherit" />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title={t('drawsPage.title')}>
        <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>
          {error}
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t('drawsPage.title')}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 6, // More space from the top
        }}
      >
        {draws.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              {t('drawsPage.noDraws')}{' '}
              <Link
                component="span"
                onClick={() => navigate('/create')}
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#FFC107',
                  },
                }}
              >
                {t('drawsPage.createOwn')}
              </Link>{' '}
              {t('drawsPage.totalDrawsPrompt', { count: totalDrawsCount })}
            </Typography>
          </Box>
        ) : (
          draws.map((draw) => <DrawPreviewCard key={draw.id} draw={draw} />)
        )}
        <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<GroupAdd />}
            size="large"
            sx={{
              minWidth: '220px',
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#4CAF50', // Green color
              '&:hover': {
                backgroundColor: '#388E3C',
              },
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            {t('drawsPage.joinButton')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            size="large"
            onClick={() => navigate('/create')}
            sx={{
              minWidth: '220px',
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#D32F2F',
              '&:hover': {
                backgroundColor: '#B71C1C',
              },
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            {t('drawsPage.createButton')}
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DrawsPage;
