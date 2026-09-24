import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PaperCard from './common/PaperCard';

// Rendered outside the router and auth, so it cannot use MainLayout.
const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <PaperCard airmail>
          <Typography variant="h1" sx={{ fontSize: '2rem' }}>
            {t('errorPage.title')}
          </Typography>
          <Typography>{t('errorPage.description')}</Typography>
          {/* A full load, so whatever broke starts from a clean state. */}
          <Button
            variant="contained"
            onClick={() => window.location.replace(window.location.pathname)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('errorPage.backHome')}
          </Button>
        </PaperCard>
      </Box>
    </Box>
  );
};

// A crash in any component used to leave a blank page.
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Unexpected error:', error, info.componentStack);
  }

  render() {
    return this.state.hasError ? <ErrorPage /> : this.props.children;
  }
}

export default ErrorBoundary;
