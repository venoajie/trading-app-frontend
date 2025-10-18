
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core'; // <-- ONLY ONE of these
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import App from './App';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

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
