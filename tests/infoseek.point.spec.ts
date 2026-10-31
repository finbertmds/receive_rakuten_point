import { test } from '../src/fixtures';
import urls from '../src/urls.json';
import { infoseekLogin, missions, readRanking } from '../src/infoseek';
import { isAM, rankingIndex } from '../src/schedule';

test.beforeEach(async ({ page }) => { await infoseekLogin(page); });
test('infoseek__join_mission', async ({ page }) => { await missions(page, false); });
test('infoseek__read_articles', async ({ page }) => {
  const rankings = urls.INFO_SEEK_RANKING_PAGE;
  const index = rankingIndex(rankings.length, isAM());
  for (const url of [rankings[index], rankings[(index + 1) % rankings.length]]) {
    await test.step(`Read ranking ${url}`, async () => { await readRanking(page, url); });
  }
});
test('infoseek__get_point', async ({ page }) => { await missions(page, true); });
