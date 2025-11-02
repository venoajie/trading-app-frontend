import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import App from './App';
import './index.css';
import { theme } from './styles/theme';
import { colorSchemeManager } from './styles/colorSchemeManager';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
