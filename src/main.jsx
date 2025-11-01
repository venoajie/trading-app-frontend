
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import App from './App';
import { theme } from './theme';

// Import global styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ColorSchemeScript defaultColorScheme="light" />
      <App />
    </MantineProvider>
  </React.StrictMode>
);