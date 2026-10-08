import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
if (existsSync('.env')) loadEnvFile('.env');
const site = process.env.SITE_URL;
if (site && !/^https:\/\/[^/]+\/?$/.test(site))
  throw new Error('SITE_URL must be an HTTPS origin without a path.');
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  // A build must not replace dependency files that the running preview is serving.
  vite: {
    cacheDir:
      process.env.NODE_ENV === 'production'
        ? 'node_modules/.vite-production'
        : 'node_modules/.vite-development',
  },
});
