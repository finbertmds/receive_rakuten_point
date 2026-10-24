import { test } from '../src/fixtures';
import urls from '../src/urls.json';
import { kujiLogin as rakutenCardLogin } from '../src/kuji';
import { enterCampaign } from '../src/campaign';

test.beforeEach(async ({ page }) => { await rakutenCardLogin(page); });

test('campaign__entry_campaign', async ({ page }) => {
  for (const url of urls.CAMPAIGN_PAGE_LIST) {
    await test.step(url, async () => {
      try { console.log(`[Campaign] ${url}: ${await enterCampaign(page, url)}`); }
      catch (error) { console.error(`[Campaign] ${url}: error`); throw error; }
      finally {
        for (const extra of page.context().pages()) if (extra !== page) await extra.close();
      }
    });
  }
});
