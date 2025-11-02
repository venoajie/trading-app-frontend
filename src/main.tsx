// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import App from './App';
import './index.css';
import { theme } from './styles/theme';
import { colorSchemeManager } from './styles/colorSchemeManager';

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
