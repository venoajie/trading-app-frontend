
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import App from './App';
import setupInterceptors from './services/setupInterceptors'; // [ADD] Import the setup function
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// [ADD] Run the interceptor setup once, before the app renders.
setupInterceptors();

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