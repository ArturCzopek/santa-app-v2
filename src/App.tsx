import React from 'react';
import { I18nextProvider } from 'react-i18next';
import './styles/global.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import AppRoutes from './routes';
import i18n from './i18n';
import SnowfallEffect from './components/SnowfallEffect';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';
import { NotifyProvider } from './hooks/useNotify';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <SnowfallEffect/>
        <div style={{ position: 'relative', height: '100vh' }}>
          <ErrorBoundary>
            <AuthProvider>
              <NotifyProvider>
                <AppRoutes />
              </NotifyProvider>
            </AuthProvider>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
