// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // CORRECTED: The proxy configuration is updated to mimic the production
  // Nginx server's behavior for root-relative API paths.
  server: {
    proxy: {
      // Any request starting with '/auth' will be forwarded to the backend.
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Any request starting with '/users' will also be forwarded.
      // This is required for the `get('/users/me')` call after login.
      '/users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Add other root-level API prefixes here as they are implemented.
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: false,
  },
});
