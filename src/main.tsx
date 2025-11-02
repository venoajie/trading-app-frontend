// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// --- Pillar 2: i18n ---
// Import i18n configuration to initialize it for the entire app.
// This is intentionally imported for its side-effects (running .init()).
import '@/lib/i18n';

import App from './App';
import './index.css';
import { theme } from './styles/theme';
import { colorSchemeManager } from './styles/colorSchemeManager';

// --- Pillar 10: Observability ---
// Initialize Sentry for production error tracking. This is configured to only
// run in production builds to avoid capturing development-time errors.
if (import.meta.env.PROD) {
  Sentry.init({
    // IMPORTANT: Replace this with your actual DSN, preferably from an environment variable.
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Additional Replay configuration may be needed
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring.
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, sample the session when an error occurs.
  });
}

// Create a client for TanStack Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={theme}
        withCssVariables
        withGlobalStyles
        colorSchemeManager={colorSchemeManager}
        defaultColorScheme="auto"
      >
        <Notifications />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
