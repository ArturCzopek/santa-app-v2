import React from 'react';
import './styles/global.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import AppRoutes from './routes';
import './i18n';
import SnowfallEffect from './components/SnowfallEffect';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';
import { NotifyProvider } from './hooks/useNotify';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnowfallEffect />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100dvh' }}>
        <ErrorBoundary>
          <NotifyProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </NotifyProvider>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
};

export default App;
