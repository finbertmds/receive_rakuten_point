import { test, expect } from '@playwright/test';
import { missions } from '../src/infoseek';

for (const popup of [false, true]) {
  test(`visits all three participating challenges and returns after three seconds (popup=${popup})`, async ({ page }) => {
    const visits: string[] = [];
    let openedAt: number | undefined;
    const dwellTimes: number[] = [];
    await page.context().route('https://www.infoseek.co.jp/**', route => {
      const path = new URL(route.request().url()).pathname;
      if (path === '/mission/list/') {
        if (openedAt !== undefined) {
          dwellTimes.push(Date.now() - openedAt);
          openedAt = undefined;
        }
        return route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<h1>ミッション</h1>
          ${['a', 'b', 'a'].map(id => `<li class="list-challenge"><p class="mission-announce"><span>参加中</span></p>
            <div class="btn"><a href="/challenge/${id}" ${popup ? 'target="_blank"' : ''}>チャレンジ</a></div></li>`).join('')}` });
      }
      visits.push(path);
      openedAt = Date.now();
      return route.fulfill({ contentType: 'text/html', body: '<h1>Challenge destination</h1>' });
    });
    await missions(page, false);
    expect(visits).toEqual(['/challenge/a', '/challenge/b', '/challenge/a']);
    expect(dwellTimes).toHaveLength(3);
    for (const ms of dwellTimes) expect(ms).toBeGreaterThanOrEqual(3000);
    expect(page.url()).toBe('https://www.infoseek.co.jp/mission/list/');
    expect(page.context().pages()).toEqual([page]);
  });
}
