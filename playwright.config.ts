import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import path from 'node:path';

const env = path.join(__dirname, '.env');
if (existsSync(env)) loadEnvFile(env);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  // Do not replay point-claiming actions automatically.
  retries: 0,
  timeout: 30 * 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }], ['./src/kuji-reporter.ts']],
  use: {
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    timezoneId: 'Asia/Tokyo',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
