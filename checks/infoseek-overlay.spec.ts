import { test, expect } from '@playwright/test';
import { installOverlays } from '../src/browser';
import { reactToArticle } from '../src/infoseek';

for (const initiallyDismissed of [false, true]) {
  test(`Gunosy iframe remaining after dismissal does not block Like (dismissed=${initiallyDismissed})`, async ({ page }) => {
    await installOverlays(page);
    await page.setContent(`<button class="reaction-icon -iine" onclick="window.likes=(window.likes||0)+1">Like</button>
      <iframe id="gn_interstitial_iframe_content" style="position:fixed;inset:0;width:100%;height:100%;z-index:2147483647"
        srcdoc="<div id='gn_interstitial_area' style='${initiallyDismissed ? 'display:none' : ''}'>
          <button id='gn_interstitial_close_icon' onclick='this.parentElement.style.display=&quot;none&quot;'>Close</button></div>"></iframe>`);
    expect(await reactToArticle(page)).toBe('clicked');
    await expect(page.locator('#gn_interstitial_iframe_content')).toBeHidden();
    expect(await page.evaluate(() => (window as unknown as { likes: number }).likes)).toBe(1);
  });
}

test('empty Gunosy ad with hidden close control is retired after a grace period', async ({ page }) => {
  await installOverlays(page);
  await page.setContent(`<button class="reaction-icon -iine" onclick="window.likes=(window.likes||0)+1">Like</button>
    <iframe id="gn_interstitial_iframe_content" style="position:fixed;inset:0;width:100%;height:100%;z-index:2147483647"
      srcdoc="<div id='gn_interstitial_area' style='position:fixed;inset:0;opacity:1'>
        <div id='gn_interstitial_inner_area'><img id='gn_interstitial_close_icon' style='width:44px;height:44px;visibility:hidden'><script>window.adLoading=true;</script></div></div>"></iframe>`);
  const started = Date.now();
  expect(await reactToArticle(page)).toBe('clicked');
  expect(Date.now() - started).toBeGreaterThanOrEqual(5000);
  await expect(page.locator('iframe')).toBeHidden();
  expect(await page.evaluate(() => (window as unknown as { likes: number }).likes)).toBe(1);
});

test('Gunosy creative arriving during grace period is closed through its button', async ({ page }) => {
  await installOverlays(page);
  await page.setContent(`<button class="reaction-icon -iine" onclick="this.textContent='Liked'">Like</button>
    <iframe id="gn_interstitial_iframe_content" style="position:fixed;inset:0;width:100%;height:100%;z-index:2147483647"
      srcdoc="<div id='gn_interstitial_area'><div id='gn_interstitial_inner_area'>
        <img id='gn_interstitial_close_icon' style='width:44px;height:44px;visibility:hidden' onclick='parent.closedByButton=true;window.frameElement.remove()'>
      </div></div><script>
        setTimeout(() => document.querySelector('#gn_interstitial_inner_area').insertAdjacentHTML('beforeend','<div>Advertisement</div>'), 1000);
        setTimeout(() => document.querySelector('img').style.visibility='visible', 6500);
      </script>"></iframe>`);
  expect(await reactToArticle(page)).toBe('clicked');
  expect(await page.evaluate(() => (window as unknown as { closedByButton: boolean }).closedByButton)).toBe(true);
  await expect(page.locator('.reaction-icon')).toHaveText('Liked');
});
