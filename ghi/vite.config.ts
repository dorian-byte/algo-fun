import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: '**/*.tsx',
    }),
  ],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      host: '0.0.0.0',
      port: 3000,
    },
  },
});
