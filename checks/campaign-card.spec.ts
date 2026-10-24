import { test, expect } from '@playwright/test';
import { enterCampaign } from '../src/campaign';
import { clickCardPoints } from '../src/card';
import { installOverlays } from '../src/browser';

for (const selector of ['rcEntryButton-button', 'btn-entry-anim', 'btn-entry-wrap']) {
  test(`campaign handles notice and ${selector} entry`, async ({ page }) => {
    await page.route('https://campaign.fixture.test/**', route => route.fulfill({
      contentType: 'text/html', body: `<div style="position:fixed;inset:0;background:white;z-index:10"><button class="spu-popup-notice__footer-close" onclick="this.parentElement.remove()">Close</button></div>
        <button class="${selector}" onclick="window.entries=(window.entries||0)+1">Entry</button>`,
    }));
    expect(await enterCampaign(page, 'https://campaign.fixture.test/')).toBe('entry-clicked');
    expect(await page.evaluate(() => (window as unknown as { entries: number }).entries)).toBe(1);
  });
}

test('campaign without an entry is reported explicitly', async ({ page }) => {
  await page.route('https://campaign.fixture.test/**', route => route.fulfill({ body: '<h1>Ended</h1>' }));
  expect(await enterCampaign(page, 'https://campaign.fixture.test/')).toBe('no-entry');
});

test('card processes shrinking banners and closes popup tabs', async ({ page }) => {
  const clicks: string[] = [];
  await page.context().route('https://www.rakuten-card.co.jp/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/claim/')) {
      clicks.push(url.pathname.split('/').pop()!);
      return route.fulfill({ body: '<h1>Claim page</h1>' });
    }
    const body = url.pathname === '/list'
      ? ['a', 'b', 'c'].map(id => `<div class="click-point-banner-image-wrap" onclick="window.open('/claim/${id}');this.remove()"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7#${id}" style="width:100px;height:100px"></div>`).join('')
      : '<a class="sprite-ico_rc_enavi_point_01" href="/list" target="_blank"><span class="top-edit-total-click-point">3</span></a>';
    return route.fulfill({ contentType: 'text/html', body });
  });
  await installOverlays(page);
  expect(await clickCardPoints(page)).toBe('banners-clicked');
  expect(clicks).toEqual(['a', 'b', 'c']);
  expect(page.context().pages()).toEqual([page]);
});
