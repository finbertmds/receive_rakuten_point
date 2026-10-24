import { test } from '../src/fixtures';
import { kujiLogin as rakutenCardLogin } from '../src/kuji';
import { clickCardPoints } from '../src/card';

test.beforeEach(async ({ page }) => { await rakutenCardLogin(page); });

test('card__click_link_get_point', async ({ page }) => {
  try { console.log(`[Card] ${await clickCardPoints(page)}`); }
  finally {
    for (const extra of page.context().pages()) if (extra !== page) await extra.close();
  }
});
