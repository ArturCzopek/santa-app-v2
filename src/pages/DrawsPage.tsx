import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DrawsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const draws = [];

  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 5
          }}
        >
          {t('drawsPage.title')}
        </Typography>

        {draws.length === 0 ? (
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              maxWidth: '600px',
              fontSize: '1.1rem'
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
                  color: '#FFC107'
                }
              }}
            >
              {t('drawsPage.createOwn')}
            </Link>
          </Typography>
        ) : (
          // This will be your future draws list
          <Box>
            {/* Draws will be displayed here */}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default DrawsPage;