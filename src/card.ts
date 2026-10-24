import type { Page } from '@playwright/test';
import urls from './urls.json';
import { goto, optional, clickTarget } from './browser';

export async function clickCardPoints(page: Page): Promise<string> {
  await goto(page, urls.RAKUTENCARD_HOME_PAGE);
  const link = page.locator('.sprite-ico_rc_enavi_point_01').first();
  if (!(await optional(link, 5000))) return 'no-click-point-link';
  const label = link.locator('.top-edit-total-click-point');
  console.log(`[Card] available points: ${await label.count() ? await label.first().innerText() : '(unknown)'}`);
  const list = await clickTarget(page, link);
  try {
    const banners = list.locator('.click-point-banner-image-wrap');
    // Allow the banner list to render, including a legitimately empty list.
    await optional(banners.first(), 5000);
    const items = await banners.evaluateAll(nodes => nodes.map((node, index) => ({
      index,
      href: (node.closest('a') ?? node.querySelector('a'))?.href ?? '',
      image: node.querySelector('img')?.getAttribute('src') ?? '',
    })));
    const listUrl = list.url();
    console.log(`[Card] banners: ${items.length}`);
    for (const item of items) {
      if (list.url() !== listUrl) await goto(list, listUrl);
      // Re-query after navigation and list updates instead of retaining elements.
      let index = item.index;
      if (item.href || item.image) {
        index = await banners.evaluateAll((nodes, expected) => nodes.findIndex(node =>
          ((node.closest('a') ?? node.querySelector('a'))?.href ?? '') === expected.href &&
          (node.querySelector('img')?.getAttribute('src') ?? '') === expected.image), item);
      }
      if (index < 0 || index >= await banners.count()) {
        console.log(`[Card] ${JSON.stringify(item)}: no-longer-available`);
        continue;
      }
      const target = await clickTarget(list, banners.nth(index));
      try {
        await target.waitForTimeout(2000);
        console.log(`[Card] ${JSON.stringify(item)}: banner-clicked (${target.url()})`);
      } finally { if (target !== list && !target.isClosed()) await target.close(); }
    }
    // Retain the legacy settlement wait; this does not assert a point balance.
    await list.waitForTimeout(15000);
    return items.length ? 'banners-clicked' : 'no-banners';
  } finally { if (list !== page && !list.isClosed()) await list.close(); }
}
