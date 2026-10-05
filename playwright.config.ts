import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:4325', browserName: 'chromium', headless: true },
  webServer: {
    command: 'node tests/server.mjs 4325',
    url: 'http://127.0.0.1:4325',
    reuseExistingServer: false,
    timeout: 60000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
