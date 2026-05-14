import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Local dev proxies /api → Spring Boot. Production builds use import.meta.env.VITE_API_URL in api.js. */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
