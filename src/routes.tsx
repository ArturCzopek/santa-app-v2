import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DrawsPage from './pages/DrawsPage';
import JoinToDrawPage from './pages/JoinToDrawPage';
import { useAuth } from './hooks/useAuth';
import CreatePage from './pages/CreatePage';
import DrawPage from './pages/DrawPage';

const AppRoutes = () => {
  const { user } = useAuth(); // Get user state from the hook

  return (
    <Router>
      <Routes>
        {/* Redirect `/` based on login state */}
        <Route
          path="/"
          element={user ? <Navigate to="/draws" replace /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/draws"
          element={user ? <DrawsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/draw/:drawId"
          element={user ? <DrawPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/create"
          element={user ? <CreatePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/join/:uuid"
          element={user ? <JoinToDrawPage /> : <Navigate to="/" replace />}
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
