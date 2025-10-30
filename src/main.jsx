
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { theme } from './theme'; // Import your custom theme

// Import global styles ONLY here, at the root of the application.
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 
        This is the single, authoritative provider for the entire application.
        It's configured with your custom theme, ensuring globalStyles are applied correctly.
      */}
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);