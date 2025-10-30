
// src/App.jsx
import { useEffect } from 'react';
// Import 'useMantineTheme' to access theme values for the workaround
import { useMantineTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import useAuthStore from './store/authStore';
import { useUiStore } from './store/uiStore';
import { AppLayout } from './layouts/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import { LearningJournalPage } from './pages/LearningJournalPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage/AccountSettingsPage';

/**
 * Imperative workaround to manage the body's background color.
 * A stubborn CSS specificity issue prevents Mantine's declarative `globalStyles`
 * from working correctly for the <body> tag in this environment.
 * This component uses a useEffect hook to apply an inline style, which
 * has the highest specificity and guarantees the correct background is applied.
 */
function ThemeManager() {
  const theme = useMantineTheme();
  useEffect(() => {
    // Apply the background color directly to the body's inline style
    document.body.style.backgroundColor =
      theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.white;
  }, [theme.colorScheme, theme.colors]); // Re-run effect when theme changes

  return null; // This component does not render any DOM elements
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
    <>
      <ThemeManager /> {/* The imperative workaround is now active here */}
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
    </>
  );
}