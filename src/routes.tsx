import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DrawsListPage from './pages/DrawsListPage';
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

        {/*redirection done on page*/}
        <Route path="/join/:drawId" element={<JoinToDrawPage />} />


        {/* Protected Routes */}
        <Route
          path="/draws"
          element={user ? <DrawsListPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/draw/:drawId"
          element={user ? <DrawPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/create"
          element={user ? <CreatePage /> : <Navigate to="/" replace />}
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
