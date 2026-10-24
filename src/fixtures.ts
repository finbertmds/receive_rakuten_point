import { test as base, expect } from '@playwright/test';
import { installOverlays } from './browser';
export const test = base.extend({
  page: async ({ page }, use) => {
    await installOverlays(page);
    await use(page);
  },
});
export { expect };
