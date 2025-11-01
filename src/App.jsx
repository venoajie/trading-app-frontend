
// src/App.jsx
import { useEffect } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import useAuthStore from './store/authStore';
import { useUiStore } from './store/uiStore';
import { theme } from './theme';

import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import { LearningJournalPage } from './pages/LearningJournalPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage/AccountSettingsPage';

function ProtectedRoute() {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoadingUser } = useAuthStore();
  if (isLoadingUser) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const { token, fetchUserOnLoad, setLoadingComplete } = useAuthStore();
  const { setAiAssistantAvailability, colorScheme } = useUiStore();

  useEffect(() => {
    const isAiEnabled = import.meta.env.VITE_AI_ASSISTANT_ENABLED === 'true';
    setAiAssistantAvailability(isAiEnabled);
  }, [setAiAssistantAvailability]);

  useEffect(() => {
    if (token) {
      fetchUserOnLoad();
    } else {
      setLoadingComplete?.();
    }
  }, [token, fetchUserOnLoad, setLoadingComplete]);

  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <ColorSchemeScript defaultColorScheme="light" />
      <Notifications />
      <Routes>
        {/* --- Public-Only Routes --- */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* --- Protected Application Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/decision-workspace" element={<DecisionWorkspacePage />} />
            <Route path="/learning-journal" element={<LearningJournalPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </MantineProvider>
  );
}