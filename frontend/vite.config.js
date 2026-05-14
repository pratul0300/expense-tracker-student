import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/** Local dev proxies /api → Spring Boot. Production: VITE_API_URL + VITE_BASE_PATH for GitHub Pages. */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let base = (env.VITE_BASE_PATH ?? '').trim();
  if (!base) base = '/';
  else if (base !== '/' && !base.endsWith('/')) base = `${base}/`;

  return {
    base,
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  };
});
