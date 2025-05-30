import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MovieDetailPage from '../pages/MovieDetailPage';
import { useAuth } from '../features/auth/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/movie/:id" element={
      <PrivateRoute>
        <MovieDetailPage />
      </PrivateRoute>
    } />
  </Routes>
);

export default AppRoutes;
