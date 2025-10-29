
// src/App.jsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';
import { useUiStore } from './store/uiStore';
import { AppLayout } from './layouts/AppLayout';
import { theme } from './theme';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PortfolioDashboardPage } from './pages/PortfolioDashboardPage/PortfolioDashboardPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import { LearningJournalPage } from './pages/LearningJournalPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null; // Render nothing while auth status is being determined
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * NEW: RootRedirect Component
 * This component acts as a gatekeeper for the root URL ('/').
 * It checks the user's authentication status and directs them to the
 * appropriate page, ensuring a seamless user experience.
 */
function RootRedirect() {
  const { isAuthenticated, isLoadingUser } = useAuthStore();

  // While the initial user fetch is in progress, we don't know the auth state.
  // Rendering null prevents a flash of the LandingPage for authenticated users.
  if (isLoadingUser) {
    return null;
  }

  // If the user is authenticated, redirect them to their dashboard.
  // Otherwise, show them the public landing page.
  return isAuthenticated ? <Navigate to="/portfolio" replace /> : <LandingPage />;
}


export default function App() {
  const { token, fetchUserOnLoad } = useAuthStore();
  const { setAiAssistantAvailability } = useUiStore();

  useEffect(() => {
    const isAiEnabled = import.meta.env.VITE_AI_ASSISTANT_ENABLED === 'true';
    setAiAssistantAvailability(isAiEnabled);
  }, [setAiAssistantAvailability]);

  useEffect(() => {
    // This effect now only needs to trigger the user fetch if a token exists.
    // The isLoadingUser state will be handled by the redirect components.
    if (token) {
      fetchUserOnLoad();
    }
  }, [token, fetchUserOnLoad]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Public Routes */}
          {/* The index route now uses RootRedirect for a conditional experience. */}
          <Route index element={<RootRedirect />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="portfolio" element={<ProtectedRoute><PortfolioDashboardPage /></ProtectedRoute>} />
          <Route path="transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="decision-workspace" element={<ProtectedRoute><DecisionWorkspacePage /></ProtectedRoute>} />
          <Route path="learning-journal" element={<ProtectedRoute><LearningJournalPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}