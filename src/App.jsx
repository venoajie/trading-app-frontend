
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
 * Guard for protected routes. If the user is not authenticated, it redirects
 * them to the login page. Otherwise, it renders the requested component.
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null; // Wait for auth check
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * Guard for public-only routes. If the user is already authenticated, it
 * redirects them to their dashboard, preventing them from seeing pages
 * like login or the public landing page again.
 */
function PublicRoute({ children }) {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null; // Wait for auth check
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
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
        {/* --- Public-Only Routes --- */}
        {/* These routes are for unauthenticated users. Authenticated users will be redirected. */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* --- Protected Application Routes --- */}
        {/* All routes within this group require authentication. */}
        <Route element={<ProtectedRoute />}>
          {/* The AppLayout serves as the shell for all protected pages */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/decision-workspace" element={<DecisionWorkspacePage />} />
            <Route path="/learning-journal" element={<LearningJournalPage />} />
          </Route>
        </Route>
      </Routes>
    </MantineProvider>
  );
}