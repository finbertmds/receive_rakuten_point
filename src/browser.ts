import { expect, type Page, type Locator, type Frame } from '@playwright/test';

export async function goto(page: Page, url: string) {
  // Only retry read-only navigation, never a point claim or mission submission.
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      if (response && response.status() >= 400) throw new Error(`HTTP ${response.status()} at ${url}`);
      return;
    } catch (error) {
      if (attempt >= 1 || page.isClosed()) throw error;
    }
  }
}

export async function optional(locator: Locator, timeout = 2500) {
  try { await locator.waitFor({ state: 'visible', timeout }); return true; }
  catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') return false;
    throw error;
  }
}

// Ads may remove or navigate their iframe between any two awaited operations.
function transientFrameError(frame: Frame, error: unknown) {
  return !frame.page().isClosed() && (frame.isDetached() ||
    error instanceof Error && /Frame was detached|frame has been detached|Execution context was destroyed|Cannot find context with specified id/i.test(error.message));
}

export async function installOverlays(page: Page) {
  const selectors = [
    '#interstitial_close_button', '.modalClick_close', '#notification_close_button',
    '.gmoam_close_button', '.tbl-explore-more-close', '#gn_interstitial_close_icon', '#gn_ydn_interstitial_btn',
    '#rdnwipe-close-ad-button', '[id="div-gpt-ad-1603846419813-close-btn"]',
  ].map(selector => `${selector}:visible`).join(', ');
  // Separate handlers can deadlock when one close button is under another ad.
  // A single handler probes actionability without clicking, then closes the top layer.
  const emptyGunosySince = new WeakMap<Frame, number>();
  await page.addLocatorHandler(page.locator('body'), async () => {
    const handlerDeadline = Date.now() + 2500;
    for (let layer = 0; layer < 12 && Date.now() < handlerDeadline; layer++) {
      let closed = false;
      const frames: Frame[] = [];
      try {
        for (const element of await page.locator('iframe#gn_interstitial_iframe_content, iframe[title="GMOSSP iframe"]').elementHandles()) {
          try {
            const frame = await element.contentFrame();
            if (frame) frames.push(frame);
          } finally { await element.dispose(); }
        }
      } catch (error) {
        // The main document can redirect while discovering ad frames too.
        if (!transientFrameError(page.mainFrame(), error)) throw error;
        return;
      }
      // Fullscreen ad controls get a turn before covered controls in the document.
      frames.push(page.mainFrame());
      for (const frame of frames) {
        if (Date.now() >= handlerDeadline) break;
        if (frame.isDetached()) continue;
        try {
          if (frame !== page.mainFrame()) {
            // A failed creative can leave an empty fullscreen ad with its close icon hidden.
            const state = await frame.locator('#gn_interstitial_area').evaluateAll(nodes => {
              const dismissed = nodes.length > 0 && nodes.every(node => getComputedStyle(node).display === 'none');
              const empty = nodes.length === 1 && (() => {
                const inner = nodes[0].querySelector('#gn_interstitial_inner_area');
                if (!inner || Array.from(inner.childNodes).some(node =>
                  node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) return false;
                const close = inner.querySelector('#gn_interstitial_close_icon, #gn_ydn_interstitial_btn');
                if (close && getComputedStyle(close).visibility !== 'hidden'
                  && getComputedStyle(close).display !== 'none' && close.getClientRects().length > 0) return false;
                return Array.from(inner.children).every(child => child.matches(
                  '#gn_interstitial_close_icon, #gn_ydn_interstitial_btn, link, style, script'));
              })();
              return { dismissed, empty };
            });
            if (state.empty) {
              if (!emptyGunosySince.has(frame)) emptyGunosySince.set(frame, Date.now());
            } else emptyGunosySince.delete(frame);
            const stalled = state.empty && Date.now() - emptyGunosySince.get(frame)! >= 5000;
            if (state.dismissed || stalled) {
              const owner = await frame.frameElement();
              try {
                const retired = await owner.evaluate(node => {
                  if (!(node instanceof HTMLElement) || node.id !== 'gn_interstitial_iframe_content'
                    || node.style.display === 'none') return false;
                  node.style.display = 'none';
                  return true;
                });
                if (retired && stalled) console.warn('[Overlay] Dismissed empty Gunosy iframe after 5s without a usable close control');
              } finally { await owner.dispose(); }
              continue;
            }
          }
          for (const close of await frame.locator(selectors).all()) {
            if (Date.now() >= handlerDeadline) break;
            try {
              await close.click({ trial: true, timeout: 250 });
              await close.click({ timeout: 1000 });
              closed = true;
              break;
            } catch (error) {
              if (transientFrameError(frame, error)) break;
              // Covered controls are retried on the next actionability check.
              if (!(error instanceof Error && error.name === 'TimeoutError')) throw error;
            }
          }
        } catch (error) {
          // isDetached() above is only a snapshot, not a lock on the frame.
          if (!transientFrameError(frame, error)) throw error;
        }
        if (closed) break; // Re-query frames and controls after each dismissal.
      }
      if (!closed) break;
    }
  }, { noWaitAfter: true });
  page.on('dialog', dialog => { void dialog.dismiss(); });
}

// Subscribe before clicking so a fast target=_blank cannot be missed.
export async function clickTarget(page: Page, locator: Locator): Promise<Page> {
  const popup = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
  await locator.click();
  const target = await popup;
  if (target) await installOverlays(target);
  const result = target ?? page;
  await result.waitForLoadState('domcontentloaded');
  return result;
}

export async function rewardedAd(page: Page, reload: boolean) {
  const dialog = page.locator('.fc-dialog-content:visible, .fc-monetization-dialog-container:visible').first();
  if (!(await optional(dialog))) return;
  await dialog.locator('.fc-rewarded-ad-button').click();
  // Ad duration varies: wait for the close control or for the dialog to disappear.
  await expect(async () => {
    for (const frame of page.frames()) {
      try {
        const close = frame.locator('#close_button_icon:visible, #dismiss-button-element:visible').first();
        if (await close.isVisible()) await close.click();
      } catch (error) {
        if (!transientFrameError(frame, error)) throw error;
      }
    }
    await expect(dialog).toBeHidden({ timeout: 1000 });
  }).toPass({ timeout: 90_000, intervals: [1000] });
  if (reload) await page.reload({ waitUntil: 'domcontentloaded' });
}

export async function loginForm(page: Page) {
  const username = process.env.RAKUTEN_USERNAME;
  const password = process.env.RAKUTEN_PASSWORD;
  if (!username || !password) throw new Error('Set RAKUTEN_USERNAME and RAKUTEN_PASSWORD in playwright/.env');
  const user = page.locator('#user_id:visible, [name="u"]:visible').first();
  const pass = page.locator('#password_current:visible, [name="p"]:visible').first();
  const confirm = page.locator('#prim_continue:visible');
  await expect(user.or(pass).or(confirm).first()).toBeVisible();
  if (await user.isVisible()) {
    await user.fill(username);
    // V2 requires Next even when the password field is already present.
    // The legacy form submits username and password together.
    if (await user.getAttribute('id') === 'user_id' || !(await pass.isVisible())) {
      await page.locator('.h4k5-e2e-button__submit:visible, [name="submit"]:visible').first().click();
    }
  }
  if (await optional(pass, 10_000)) {
    await pass.fill(password);
    await page.locator('.h4k5-e2e-button__submit:visible, [name="submit"]:visible').last().click();
  }
  if (await optional(confirm, 5000)) await confirm.click();
  await expect(user).toBeHidden();
  await expect(pass).toBeHidden();
}
