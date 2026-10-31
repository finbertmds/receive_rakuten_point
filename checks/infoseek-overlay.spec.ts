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
