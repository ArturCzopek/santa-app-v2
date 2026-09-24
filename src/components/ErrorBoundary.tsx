import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AuthPageLayout from './layout/AuthPageLayout';
import { pageTitleStyles } from '../styles/loginPageStyles';

const ErrorPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <AuthPageLayout>
      <Typography variant="h4" component="h1" sx={pageTitleStyles(theme)}>
        {t('errorPage.title')}
      </Typography>
      <Typography sx={{ color: '#212121', textAlign: 'center', mb: 3 }}>
        {t('errorPage.description')}
      </Typography>
      {/* A full load, so whatever broke starts from a clean state. */}
      <Button
        variant="contained"
        color="error"
        onClick={() => window.location.replace(window.location.pathname)}
      >
        {t('errorPage.backHome')}
      </Button>
    </AuthPageLayout>
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
