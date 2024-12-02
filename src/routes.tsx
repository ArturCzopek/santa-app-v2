import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MyDrawsPage from './pages/MyDrawsPage';
import AllDrawsPage from './pages/AllDrawsPage';
import JoinToDrawPage from './pages/JoinToDrawPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/my-draws" element={<MyDrawsPage />} />
            <Route path="/all-draws" element={<AllDrawsPage />} />
            <Route path="/join-to-draw/:uuid" element={<JoinToDrawPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;
