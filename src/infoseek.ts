import { expect, type Page } from '@playwright/test';
import urls from './urls.json';
import { goto, loginForm, optional, clickTarget, rewardedAd } from './browser';

export async function infoseekLogin(page: Page) {
  await goto(page, urls.INFO_SEEK_PAGE);
  const login = page.locator('.button.login').first();
  if (await optional(login, 5000)) {
    const target = await clickTarget(page, login);
    const form = target.locator('#user_id:visible, [name="u"]:visible, #password_current:visible, [name="p"]:visible, #prim_continue:visible').first();
    const signedIn = async () => new URL(target.url()).hostname === new URL(urls.INFO_SEEK_PAGE).hostname
      && !(await target.locator('.button.login').isVisible());
    // SSO may return directly to Infoseek without showing a login form.
    await expect.poll(async () => await form.isVisible() || await signedIn(), {
      message: 'Expected Rakuten login form or authenticated Infoseek return',
    }).toBe(true);
    if (!(await signedIn())) await loginForm(target);
    if (target !== page) await target.close();
    await goto(page, urls.INFO_SEEK_PAGE);
  }
  await expect(login).toBeHidden();
}

export async function missions(page: Page, claim: boolean) {
  await goto(page, urls.INFO_SEEK_MISSION_PAGE);
  const selector = claim
    ? '.list-acquired :is(a.btn, .btn a)'
    : '.list-challenge :is(a.btn, .btn a):text-is("チャレンジ")';
  await expect(page.locator('body')).toContainText(/ミッション/);
  // Snapshot URL identities, never element handles across navigation.
  const links = await page.locator(selector).evaluateAll(nodes => nodes.map(node => ({
    href: (node as HTMLAnchorElement).href, text: node.textContent?.trim() ?? '',
  })));
  const seen = new Set<string>();
  for (const item of links) {
    const key = item.href + item.text;
    if (claim && seen.has(key)) continue;
    seen.add(key);
    // Different challenge cards may lead to the same destination.
    let occurrence = claim ? 0 : links.slice(0, links.indexOf(item)).filter(other =>
      other.href === item.href && other.text === item.text).length;
    await goto(page, urls.INFO_SEEK_MISSION_PAGE);
    const buttons = page.locator(selector);
    let match = -1;
    for (let i = 0; i < await buttons.count(); i++) {
      if (await buttons.nth(i).evaluate((node, expected) =>
        (node as HTMLAnchorElement).href === expected.href && (node.textContent?.trim() ?? '') === expected.text, item)) {
        if (occurrence-- === 0) { match = i; break; }
      }
    }
    if (match < 0) continue; // Already removed after a previous operation.
    const target = await clickTarget(page, buttons.nth(match));
    try {
      if (claim) await expect(target.locator('.point_get')).toBeVisible();
      else await target.waitForTimeout(3000);
    } finally { if (target !== page && !target.isClosed()) await target.close(); }
    if (!claim) await goto(page, urls.INFO_SEEK_MISSION_PAGE);
  }
}

export async function reactToArticle(page: Page) {
  const reaction = page.locator('.reaction-icon.-iine').first();
  if (!(await optional(reaction, 5000))) return 'unavailable';
  const alreadyReacted = () => reaction.evaluate(node => node.classList.contains('is-active') || node.classList.contains('is-disabled'));
  if (await alreadyReacted()) return 'already-reacted';
  // A previous reaction may arrive asynchronously while ads are being dismissed.
  await expect(async () => {
    if (await alreadyReacted()) return 'already-reacted';
    await reaction.click({ trial: true, timeout: 5000 });
  }).toPass({ timeout: 30_000, intervals: [250] });
  if (await alreadyReacted()) return 'already-reacted';
  try { await reaction.click({ timeout: 5000 }); }
  catch (error) {
    if (!(error instanceof Error && error.name === 'TimeoutError' && await alreadyReacted())) throw error;
  }
  return 'clicked';
}

export async function readRanking(page: Page, url: string) {
  await goto(page, url);
  await expect(page.locator('.ranking-list__text-title').first()).toBeVisible();
  const count = Number(process.env.ARTICLE_COUNT ?? 10);
  const dwell = Number(process.env.ARTICLE_READ_MS ?? 10000);
  if (!Number.isInteger(count) || count < 1 || !Number.isFinite(dwell) || dwell < 0) throw new Error('Invalid article settings');
  const available = await page.locator('.ranking-list__text-title').count();
  for (let i = 0; i < Math.min(count, available); i++) {
    await goto(page, url);
    const rankingUrl = page.url();
    const article = await clickTarget(page, page.locator('.ranking-list__text-title').nth(i));
    try {
      await expect.poll(() => article.url(), { message: 'Article link should leave the ranking page' }).not.toBe(rankingUrl);
      await expect.poll(() => article.url()).not.toBe('about:blank');
      await rewardedAd(article, false);
      const reaction = await reactToArticle(article);
      // Previously liked articles can advance immediately.
      if (reaction !== 'already-reacted') await article.waitForTimeout(dwell);
    } finally { if (article !== page) await article.close(); }
  }
}
