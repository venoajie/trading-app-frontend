import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the 'path' module
// vite.config.ts
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps the '@' alias to the 'src' directory.
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Vitest configuration (if needed in the future) can go here
  // test: { ... }
});
