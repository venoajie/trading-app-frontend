import React from 'react';
import ReactDOM from 'react-dom/client';
// Import Mantine core styles – must be imported before your own styles.
import '@mantine/core/styles.css';
// Import Mantine notifications styles
import '@mantine/notifications/styles.css';

import App from './App';
import './index.css'; // Your global vanilla CSS
import { ThemeBridge } from './components/ThemeBridge';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeBridge>
      <App />
    </ThemeBridge>
  </React.StrictMode>
);
