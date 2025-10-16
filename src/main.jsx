
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@mantine/core/styles.css'; // Don't forget to import Mantine's CSS


import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css'; // Import notifications CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark">
        <Notifications /> {/* Add Notifications provider */}
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
