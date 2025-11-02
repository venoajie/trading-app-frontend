// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import '@/lib/i18n';

import App from './App';
import './index.css';
import { theme } from './styles/theme';
import { colorSchemeManager } from './styles/colorSchemeManager';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* V7 API CHANGE: `withGlobalStyles` and `withCssVariables` are removed. */}
      {/* This functionality is now enabled by default. */}
      <MantineProvider
        theme={theme}
        colorSchemeManager={colorSchemeManager}
        defaultColorScheme="auto"
      >
        <Notifications />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
