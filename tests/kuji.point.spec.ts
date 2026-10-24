import { test, expect } from '../src/fixtures';
import urls from '../src/urls.json';
import { goto, clickTarget } from '../src/browser';
import { kujiLogin, playKuji } from '../src/kuji';
import type { Page } from '@playwright/test';
import { isAM, kujiRange, third } from '../src/schedule';

// Attach structured results so the final reporter survives worker restarts.
async function logKuji(getPage: () => Page, source: string, action: () => Promise<string>) {
  let result = 'error';
  let error: string | undefined;
  try {
    result = await action();
    return result;
  } catch (cause) {
    result = 'error';
    error = cause instanceof Error ? cause.message : String(cause);
    throw cause;
  } finally {
    const page = getPage();
    const record = { source, page: page.isClosed() ? '(closed)' : page.url(), result, error };
    console.log(`[Kuji] ${JSON.stringify(record)}`);
    await test.info().attach('kuji-result', {
      body: JSON.stringify(record), contentType: 'application/json',
    });
  }
}

test.beforeEach(async ({ page }) => { await kujiLogin(page); });

for (const part of [0, 1] as const) {
  test(`kuji__get_point${part + 1}`, async ({ page }) => {
    await goto(page, urls.KUJI_HOME_PAGE);
    await expect(page.locator('.kuji_list li').first()).toBeVisible();
    const count = await page.locator('.kuji_list li').count();
    const [start, end] = kujiRange(count, part, isAM());
    for (let i = start; i < end; i++) {
      await test.step(`Draw list item ${i}`, async () => {
        await goto(page, urls.KUJI_HOME_PAGE);
        const link = page.locator('.kuji_list li').nth(i).locator('a').first();
        let target = page;
        const href = await link.count() ? await link.getAttribute('href') : null;
        const source = href ? new URL(href, page.url()).href : `${urls.KUJI_HOME_PAGE} (item ${i}: no active link)`;
        try {
          await logKuji(() => target, source, async () => {
            if (!await link.count()) return 'no-active-link';
            target = await clickTarget(page, link);
            return playKuji(target, false);
          });
        }
        finally {
          for (const extra of page.context().pages()) if (extra !== page) await extra.close();
        }
      });
    }
  });
}

for (let part = 0; part < 3; part++) {
  test(`kuji__default_get_point${part + 1}`, async ({ page }) => {
    for (const url of third(urls.KUJI_DEFAULT_LINK, part)) {
      await test.step(url, async () => {
        try {
          await logKuji(() => page, url, async () => {
            await goto(page, url);
            return playKuji(page, true);
          });
        }
        finally {
          for (const extra of page.context().pages()) if (extra !== page) await extra.close();
        }
      });
    }
  });
}
