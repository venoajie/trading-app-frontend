
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';
import { useUiStore } from './store/uiStore'; // Import uiStore
import { AppLayout } from './layouts/AppLayout';

// Use named imports for all pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PortfolioDashboardPage } from './pages/PortfolioDashboardPage/PortfolioDashboardPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import { LearningJournalPage } from './pages/LearningJournalPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, fetchUserOnLoad, setLoadingComplete } = useAuthStore();
  const { setAiAssistantAvailability } = useUiStore();

  // Effect to configure app-level features on startup
  useEffect(() => {
    // Check the Vite environment variable for AI Assistant availability.
    // The variable is a string, so we compare it to 'true'.
    const isAiEnabled = import.meta.env.VITE_AI_ASSISTANT_ENABLED === 'true';
    setAiAssistantAvailability(isAiEnabled);
  }, [setAiAssistantAvailability]);

  // Effect for user session loading
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
        <Route path="/" element={<AppLayout />}>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
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