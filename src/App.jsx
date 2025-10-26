
// src/App.jsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';
import { AppLayout } from './layouts/AppLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DecisionWorkspacePage from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import TransactionsPage from './pages/TransactionsPage/TransactionsPage';
import PortfolioDashboardPage from './pages/PortfolioDashboardPage';
import LearningJournalPage from './pages/LearningJournalPage';

// A simple wrapper to protect routes that require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null; // Or a loading spinner
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, fetchUserOnLoad, setLoadingComplete } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUserOnLoad();
    } else {
      setLoadingComplete();
    }
  }, [token, fetchUserOnLoad, setLoadingComplete]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications />
      <Routes>
        {/* CORRECTIVE ACTION: Added path="/" to the layout route to fix the router context */}
        <Route path="/" element={<AppLayout />}>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          {/* Changed the root protected route to be an 'index' route */}
          <Route index element={<ProtectedRoute><PortfolioDashboardPage /></ProtectedRoute>} />
          <Route path="portfolio" element={<ProtectedRoute><PortfolioDashboardPage /></ProtectedRoute>} />
          <Route path="transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="decision-workspace" element={<ProtectedRoute><DecisionWorkspacePage /></ProtectedRoute>} />
          <Route path="learning-journal" element={<ProtectedRoute><LearningJournalPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}