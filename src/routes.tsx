import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MyDrawsPage from './pages/MyDrawsPage';
import AllDrawsPage from './pages/AllDrawsPage';
import JoinToDrawPage from './pages/JoinToDrawPage';
import { useAuth } from './hooks/useAuth';

const AppRoutes = () => {
  const { user } = useAuth(); // Get user state from the hook

  return (
    <Router>
      <Routes>
        {/* Redirect `/` based on login state */}
        <Route
          path="/"
          element={user ? <Navigate to="/all-draws" replace /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/my-draws"
          element={user ? <MyDrawsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/all-draws"
          element={user ? <AllDrawsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/join-to-draw/:uuid"
          element={user ? <JoinToDrawPage /> : <Navigate to="/" replace />}
        />

        {/* Catch-all for unmatched routes */}
        <Route
          path="*"
          element={<Navigate to={user ? '/all-draws' : '/'} replace />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
