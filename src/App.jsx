
// src/App.jsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
// IMPORT 'Global' and 'useMantineTheme'
import { MantineProvider, Global, useMantineTheme } from '@mantine/core';
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
import { AccountSettingsPage } from './pages/AccountSettingsPage/AccountSettingsPage';

// A dedicated component to apply global styles reliably
function GlobalStyles() {
  const theme = useMantineTheme();
  return (
    <Global
      styles={{
        body: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.white,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.black,
        },
      }}
    />
  );
}

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
  const { setAiAssistantAvailability } = useUiStore();

  useEffect(() => {
    const isAiEnabled = import.meta.env.VITE_AI_ASSISTANT_ENABLED === 'true';
    setAiAssistantAvailability(isAiEnabled);
  }, [setAiAssistantAvailability]);

  useEffect(() => {
    if (token) {
      fetchUserOnLoad();
    } else {
      if (setLoadingComplete) {
        setLoadingComplete();
      }
    }
  }, [token, fetchUserOnLoad, setLoadingComplete]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <GlobalStyles /> {/* ADD THE GLOBAL STYLES COMPONENT HERE */}
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