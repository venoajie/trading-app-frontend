
// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useMantineColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import useAuthStore from './store/authStore';
import { useUiStore } from './store/uiStore';

// Import Layouts and Pages
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import { LearningJournalPage } from './pages/LearningJournalPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage/AccountSettingsPage';

/**
 * This component acts as a bridge.
 * It listens to our Zustand store and tells Mantine's context when to change.
 * This ensures the data-mantine-color-scheme attribute is correctly applied to the HTML tag.
 */
function ThemeBridge() {
  const { colorScheme } = useUiStore();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

  return null; // This component renders nothing.
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
      setLoadingComplete?.();
    }
  }, [token, fetchUserOnLoad, setLoadingComplete]);

  return (
    <BrowserRouter>
      <ThemeBridge />
      <Notifications />
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/decision-workspace" element={<DecisionWorkspacePage />} />
            <Route path="/learning-journal" element={<LearningJournalPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}