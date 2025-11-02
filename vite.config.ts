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
  // CORRECTED: Add the server configuration block.
  server: {
    // This tells the Vite dev server to proxy any requests that it doesn't have a file for.
    proxy: {
      // Any request starting with '/api' will be forwarded.
      '/api': {
        // The target is your backend server, which is running in Docker on port 8000.
        target: 'http://localhost:8000',
        // This is crucial for virtual hosts and ensures the origin header is correct.
        changeOrigin: true,
        // Optional: If your backend API doesn't have the /api prefix,
        // you can rewrite the path. For example, /api/auth/login -> /auth/login.
        // If your backend FastAPI routes include /api, you can remove this rewrite line.
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // Vitest configuration for testing
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: false,
  },
});
