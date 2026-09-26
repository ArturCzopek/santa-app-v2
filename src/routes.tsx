import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/LoginPage';
import DrawsListPage from './pages/DrawsListPage';
import JoinToDrawPage from './pages/JoinToDrawPage';
import { useAuth } from './hooks/useAuth';
import CreatePage from './pages/CreatePage';
import DrawPage from './pages/DrawPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpPage from './pages/HelpPage';

// A new page starts at the top, not where the previous one was scrolled.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Guests go to the login page, which brings them back here after signing in.
const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  return user ? children : <Navigate to="/" replace state={{ from: location }} />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  // Deciding on redirects before Firebase restores the session would send
  // signed-in users away from the page they reloaded or opened from a link.
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
        }}
      >
        <CircularProgress color="inherit" aria-label={t('common.loading')} />
      </Box>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Redirects signed-in users on its own */}
        <Route path="/" element={<LoginPage />} />

        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/*redirection done on page*/}
        <Route path="/join/:drawId" element={<JoinToDrawPage />} />

        {/* Protected Routes */}
        <Route
          path="/draws"
          element={
            <RequireAuth>
              <DrawsListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/draw/:drawId"
          element={
            <RequireAuth>
              <DrawPage />
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth>
              <CreatePage />
            </RequireAuth>
          }
        />

        {/* Catch-all for unmatched routes */}
        <Route
          path="*"
          element={<Navigate to={user ? '/draws' : '/'} replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
