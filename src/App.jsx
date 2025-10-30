
// src/App.jsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import useAuthStore from './store/authStore';
import { useUiStore } from './store/uiStore';
import { AppLayout } from './layouts/AppLayout';
import { theme } from './theme';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage'; 
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import { LearningJournalPage } from './pages/LearningJournalPage';

/**
 * ProtectedRoute now serves a more structural role. It ensures the user is
 * authenticated before allowing access to the main application layout and its children.
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) {
    return null; // Render nothing while auth status is being determined
  }
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, fetchUserOnLoad } = useAuthStore();
  const { setAiAssistantAvailability } = useUiStore();

  useEffect(() => {
    const isAiEnabled = import.meta.env.VITE_AI_ASSISTANT_ENABLED === 'true';
    setAiAssistantAvailability(isAiEnabled);
  }, [setAiAssistantAvailability]);

  useEffect(() => {
    if (token) {
      fetchUserOnLoad();
    }
  }, [token, fetchUserOnLoad]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes render outside the main AppLayout */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes --- */}
        {/* The AppLayout itself is now protected. All children are implicitly protected. */}
        <Route path="/" element={<ProtectedRoute />}>
          {/* If authenticated users land at '/', redirect them to their dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="decision-workspace" element={<DecisionWorkspacePage />} />
          <Route path="learning-journal" element={<LearningJournalPage />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}