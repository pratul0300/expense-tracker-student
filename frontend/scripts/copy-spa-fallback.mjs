/**
 * GitHub Pages serves 404.html for unknown paths; copy index.html so React Router loads on refresh/deep links.
 */
import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const indexHtml = join(dist, 'index.html');
const fallback = join(dist, '404.html');

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run vite build first');
  process.exit(1);
}
copyFileSync(indexHtml, fallback);
console.log('Wrote dist/404.html for GitHub Pages SPA routing');
