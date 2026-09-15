import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  fullyParallel: true,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node ./node_modules/http-server/bin/http-server dist -p 4173 -c-1',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true
  }
});
