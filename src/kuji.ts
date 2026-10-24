import { expect, type Page } from '@playwright/test';
import urls from './urls.json';
import { goto, loginForm, optional, clickTarget, rewardedAd } from './browser';

export async function kujiLogin(page: Page) {
  await goto(page, urls.LOGIN_PAGE);
  await loginForm(page);
  await goto(page, urls.RAKUTENCARD_HOME_PAGE);
  if (await optional(page.locator('#user_id:visible, #password_current:visible').first())) await loginForm(page);
}

export async function playKuji(page: Page, defaultLink: boolean): Promise<string> {
  if (new URL(page.url()).hostname !== new URL(urls.KUJI_HOME_PAGE).hostname) return 'outside-kuji';
  if (/\/already\/?$/.test(new URL(page.url()).pathname)) return 'already-played-or-ended';
  const disnon = page.locator('.btn-10000').first();
  if (!defaultLink && await optional(disnon)) page = await clickTarget(page, disnon);
  if (new URL(page.url()).hostname !== new URL(urls.KUJI_HOME_PAGE).hostname) return 'outside-kuji';
  // Keep evidence of /already even when it immediately redirects to an advertiser.
  let alreadyPlayed = false;
  const observe = () => {
    const url = new URL(page.url());
    if (url.hostname === new URL(urls.KUJI_HOME_PAGE).hostname && /\/already\/?$/.test(url.pathname)) alreadyPlayed = true;
  };
  observe();
  page.on('framenavigated', observe);
  const entry = page.locator('#entry');
  try {
    await rewardedAd(page, true);
    const ended = page.getByText(/本日はすでに|本日は既に|参加済み|終了しました|終了いたしました/).first();
    const outside = () => new URL(page.url()).hostname !== new URL(urls.KUJI_HOME_PAGE).hostname;
    await expect.poll(async () => {
      observe();
      return alreadyPlayed || outside() || await entry.isVisible() || await ended.isVisible();
    }, { timeout: 25_000, message: 'Expected Kuji entry, completed draw, or external redirect' }).toBe(true);
    if (alreadyPlayed) return 'already-played-or-ended';
    if (outside()) return 'outside-kuji';
    if (!(await entry.isVisible())) return 'already-played-or-ended';
  } finally {
    page.off('framenavigated', observe);
  }
  const before = page.url();
  const result = await clickTarget(page, entry);
  await expect.poll(async () => result.url() !== before || !(await result.locator('#entry').isVisible()), {
    timeout: 120_000, message: 'Kuji entry should disappear or navigate after drawing',
  }).toBe(true);
  return 'entry-completed';
}
