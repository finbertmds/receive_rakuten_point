import type { Page } from '@playwright/test';
import { goto, optional, clickTarget } from './browser';

export async function enterCampaign(page: Page, url: string): Promise<string> {
  await goto(page, url);
  const notice = page.locator('.spu-popup-notice__footer-close:visible').first();
  if (await optional(notice)) await notice.click();
  // Preserve the selector priority of campaign.page.ts; click only one entry.
  for (const selector of ['.rcEntryButton-button', '.btn-entry-anim', '.btn-entry-wrap']) {
    const entry = page.locator(`${selector}:visible`).first();
    if (!(await optional(entry))) continue;
    if (!(await entry.isEnabled()) || await entry.getAttribute('aria-disabled') === 'true') return 'entry-disabled';
    const target = await clickTarget(page, entry);
    try {
      // The legacy flow gives asynchronous entry requests time to settle.
      await target.waitForTimeout(5000);
      return 'entry-clicked';
    } finally { if (target !== page && !target.isClosed()) await target.close(); }
  }
  return 'no-entry';
}
