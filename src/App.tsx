import React from 'react';
import { I18nextProvider } from 'react-i18next';
import './styles/global.css'; // Global styles
import { ThemeProvider } from '@mui/material/styles'; // For theme context
import theme from './styles/theme';
import AppRoutes from './routes';
import i18n from './i18n';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <div style={{ position: 'relative', height: '100vh' }}>
          <AppRoutes />
        </div>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
