
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import App from './App';

// Import the new font and base styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './main.css'; // A new file for global imports like fonts

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);