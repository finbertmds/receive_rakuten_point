import { playKuji } from '../src/kuji';
import { test, expect } from '@playwright/test';
import { third, kujiRange } from '../src/schedule';
import { clickTarget, installOverlays, loginForm } from '../src/browser';
import { missions, infoseekLogin, reactToArticle } from '../src/infoseek';

test('34 default links are covered exactly once using integer indices', () => {
  const links = Array.from({ length: 34 }, (_, i) => i);
  expect([0, 1, 2].flatMap(part => third(links, part))).toEqual(links);
  for (let count = 1; count <= 40; count++) {
    const ranges = [true, false].flatMap(am => [0, 1].map(part => kujiRange(count, part as 0 | 1, am)));
    expect(ranges.flatMap(([start, end]) => Array.from({ length: end - start }, (_, i) => start + i)))
      .toEqual(Array.from({ length: count }, (_, i) => i));
  }
});

test('handles a popup and a blocking overlay without forced clicks', async ({ page }) => {
  await page.context().route('https://fixture.test/**', route => route.fulfill({ body: '<h1>Destination</h1>', contentType: 'text/html; charset=utf-8' }));
  await installOverlays(page);
  await page.setContent(`<div style="position:fixed;inset:0;background:white;z-index:10"><button id="notification_close_button" onclick="this.parentElement.remove()">Close</button></div><a href="https://fixture.test/article" target="_blank">Article</a>`);
  const popup = await clickTarget(page, page.getByRole('link', { name: 'Article' }));
  expect(popup).not.toBe(page);
  await expect(popup.locator('h1')).toHaveText('Destination');
});

for (const claim of [false, true]) {
  test(`mission list can shrink after ${claim ? 'claiming' : 'joining'} without losing the next item`, async ({ page }) => {
    const remaining = new Set(['a', 'b', 'c']);
    const visited: string[] = [];
    await page.route('https://www.infoseek.co.jp/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/mission/list/') {
        const selector = claim ? 'list-acquired' : 'list-challenge';
        await route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<h1>ミッション</h1><div class="${selector}">${[...remaining].map(id => `<a class="btn" href="/mission/${id}">${id}</a>`).join('')}</div>` });
      } else {
        const id = url.pathname.split('/').pop()!;
        remaining.delete(id);
        visited.push(id);
        await route.fulfill({ contentType: 'text/html', body: '<div class="point_get">Acquired</div>' });
      }
    });
    await missions(page, claim);
    expect(visited).toEqual(['a', 'b', 'c']);
    expect(remaining.size).toBe(0);
  });
}

test('V2 clicks Next even when password is already visible', async ({ page }) => {
  const previousUser = process.env.RAKUTEN_USERNAME;
  const previousPassword = process.env.RAKUTEN_PASSWORD;
  process.env.RAKUTEN_USERNAME = 'fixture-user';
  process.env.RAKUTEN_PASSWORD = 'fixture-password';
  try {
    await page.setContent(`<input id="user_id"><input id="password_current"><button class="h4k5-e2e-button__submit" onclick="document.querySelector('#user_id').remove();this.remove();document.querySelector('#finish').hidden=false">Next</button><button id="finish" hidden class="h4k5-e2e-button__submit" onclick="document.querySelector('#password_current').remove();this.remove()">Login</button>`);
    await loginForm(page);
    await expect(page.locator('#user_id, #password_current, button')).toHaveCount(0);
  } finally {
    if (previousUser === undefined) delete process.env.RAKUTEN_USERNAME;
    else process.env.RAKUTEN_USERNAME = previousUser;
    if (previousPassword === undefined) delete process.env.RAKUTEN_PASSWORD;
    else process.env.RAKUTEN_PASSWORD = previousPassword;
  }
});

test('join clicks agreement link containing additional text', async ({ page }) => {
  let joined = false;
  await page.route('https://www.infoseek.co.jp/**', async route => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === '/mission/agree') joined = true;
    const body = pathname === '/mission/list/'
      ? `<h1>ミッション</h1><div class="list-challenge">${joined ? '' : '<a class="btn" href="/mission/start">Join</a>'}</div>`
      : pathname === '/mission/start' ? '<a href="/mission/agree">規約に同意する</a>' : '<h1>Joined</h1>';
    await route.fulfill({ contentType: 'text/html; charset=utf-8', body });
  });
  await missions(page, false);
  expect(joined).toBe(true);
});

for (const delayed of [false, true]) {
  test(`recognizes image-only already result (delayed=${delayed})`, async ({ page }) => {
    await page.route('https://kuji.rakuten.co.jp/**', route => route.fulfill({
      contentType: 'text/html', body: delayed && !route.request().url().endsWith('/already')
        ? `<script>setTimeout(() => location.href = '/fixture/already', 100)</script>` : '<h1>Image-only result</h1>',
    }));
    await page.goto(`https://kuji.rakuten.co.jp/fixture/${delayed ? '' : 'already'}`);
    expect(await playKuji(page, true)).toBe('already-played-or-ended');
  });
}

test('handles automatic advertiser redirect while waiting for entry', async ({ page }) => {
  await page.route('https://kuji.rakuten.co.jp/**', route => route.fulfill({
    contentType: 'text/html', body: `<script>setTimeout(() => location.href = 'https://advertiser.test/', 100)</script>`,
  }));
  await page.route('https://advertiser.test/**', route => route.fulfill({ body: 'Advertisement' }));
  await page.goto('https://kuji.rakuten.co.jp/fixture');
  expect(await playKuji(page, true)).toBe('outside-kuji');
});

for (const delayed of [false, true]) {
  test(`closes GMOSSP iframe covering Kuji entry (delayed=${delayed})`, async ({ page }) => {
    await page.route('https://kuji.rakuten.co.jp/**', route => route.fulfill({
      contentType: 'text/html', body: `<button id="entry" onclick="this.remove();window.draws++">Draw</button>
        <div id="lot_page_header"><iframe title="GMOSSP iframe" src="https://gmo.fixture.test/ad"
          style="position:fixed;inset:0;width:100%;height:100%;z-index:100;${delayed ? 'display:none' : ''}"></iframe></div>
        <script>window.draws=0;addEventListener('message', e => {
          if(e.origin === 'https://gmo.fixture.test' && e.data === 'close') document.querySelector('iframe').style.display='none';
        });${delayed ? "setTimeout(() => document.querySelector('iframe').style.display='block', 300)" : ''}</script>`,
    }));
    await page.route('https://gmo.fixture.test/**', route => route.fulfill({
      contentType: 'text/html', body: `<div style="position:fixed;inset:0;background:white">Advertisement
        <a class="gmoyda gmoam_close_button" href="#" onclick="parent.postMessage('close','https://kuji.rakuten.co.jp');return false">×</a></div>`,
    }));
    await installOverlays(page);
    await page.goto('https://kuji.rakuten.co.jp/fixture');
    expect(await playKuji(page, true)).toBe('entry-completed');
    const draws = await page.evaluate(() => (window as unknown as { draws: number }).draws);
    expect(draws).toBe(1);
    await expect(page.locator('iframe')).toBeHidden();
  });
}


test('mission already participating is skipped with real wrapper markup', async ({ page }) => {
  let clicks = 0;
  await page.route('https://www.infoseek.co.jp/**', route => {
    if (!route.request().url().includes('/mission/list/')) clicks++;
    return route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<h1>ミッション</h1>
      <li class="list-challenge"><p class="mission-announce"><span>参加中</span>あと10記事</p>
      <div class="btn"><a href="/">チャレンジ</a></div></li>` });
  });
  await missions(page, false);
  expect(clicks).toBe(0);
});

test('joining wrapper link may remain in challenge list with participating status', async ({ page }) => {
  let joined = false;
  await page.route('https://www.infoseek.co.jp/**', route => {
    if (route.request().url().endsWith('/agree')) joined = true;
    return route.fulfill({ contentType: 'text/html; charset=utf-8', body: route.request().url().includes('/mission/list/')
      ? `<h1>ミッション</h1><li class="list-challenge">${joined ? '<p class="mission-announce"><span>参加中</span></p>' : ''}<div class="btn"><a href="/agree">チャレンジ</a></div></li>`
      : '<h1>Joined</h1>' });
  });
  await missions(page, false);
  expect(joined).toBe(true);
});

for (const closeId of ['gn_interstitial_close_icon', 'gn_ydn_interstitial_btn']) {
test(`closes stacked GPT, Gunosy ${closeId} and Taboola overlays before reaction`, async ({ page }) => {
  await installOverlays(page);
  await page.route('https://gn.fixture.test/**', route => route.fulfill({ contentType: 'text/html',
    body: `<button id="${closeId}" onclick="parent.postMessage('close','*')">Close</button>` }));
  await page.setContent(`<button class="reaction-icon -iine" onclick="this.textContent='Liked'">Like</button>
    <div id="gpt" style="position:fixed;inset:0;background:white;z-index:9">
      <button id="div-gpt-ad-1603846419813-close-btn" onclick="this.parentElement.remove()">Close GPT</button></div>
    <iframe id="gn_interstitial_iframe_content" src="https://gn.fixture.test/ad" style="position:fixed;inset:0;width:100%;height:100%;z-index:10"></iframe>
    <div id="tbl-explore-more-container" hidden style="position:fixed;inset:0;background:white;z-index:11">
      <button class="tbl-explore-more-close" onclick="this.parentElement.hidden=true">Close</button></div>
    <script>addEventListener('message', e => {if(e.origin==='https://gn.fixture.test') {
      document.querySelector('iframe').remove(); document.querySelector('#tbl-explore-more-container').hidden=false;
    }})</script>`);
  await page.locator('.reaction-icon').click();
  await expect(page.locator('.reaction-icon')).toHaveText('Liked');
  await expect(page.locator('#gpt')).toHaveCount(0);
});


}

test('removed ad frame does not prevent closing its replacement', async ({ page }) => {
  await installOverlays(page);
  await page.setContent(`<iframe id="gn_interstitial_iframe_content"></iframe><button onclick="this.textContent='Done'">Continue</button>`);
  const stale = page.frames().find(frame => frame !== page.mainFrame())!;
  await page.locator('iframe').evaluate(node => node.remove());
  await expect.poll(() => stale.isDetached()).toBe(true);
  await page.evaluate(() => {
    const iframe = document.createElement('iframe');
    iframe.id = 'gn_interstitial_iframe_content';
    iframe.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';
    iframe.srcdoc = `<button id="gn_ydn_interstitial_btn" onclick="window.frameElement.remove()">Close</button>`;
    document.body.append(iframe);
  });
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('button')).toHaveText('Done');
});

test('Infoseek SSO can return authenticated without a login form', async ({ page }) => {
  let signedIn = false;
  await page.route('https://www.infoseek.co.jp/**', route => {
    if (route.request().url().endsWith('/login')) {
      signedIn = true;
      return route.fulfill({ status: 302, headers: { location: 'https://www.infoseek.co.jp/' } });
    }
    return route.fulfill({ contentType: 'text/html', body: signedIn ? '<h1>Home</h1>'
      : '<a class="button login" href="/login">Login</a>' });
  });
  await infoseekLogin(page);
  expect(signedIn).toBe(true);
  await expect(page.locator('.button.login')).toBeHidden();
});


test('already active reaction behind click wall is not clicked again', async ({ page }) => {
  await installOverlays(page);
  await page.setContent(`<button class="reaction-icon -iine is-active is-disabled" onclick="throw Error('Already liked')">Liked</button>
    <div id="reaction-icon-container-click-wall" style="position:fixed;inset:0"></div>`);
  expect(await reactToArticle(page)).toBe('already-reacted');
  await expect(page.locator('.reaction-icon')).toHaveText('Liked');
});

test('fullscreen ad closes before many covered document controls exhaust the handler budget', async ({ page }) => {
  await installOverlays(page);
  await page.setContent(`<button class="reaction-icon -iine" onclick="window.likes=(window.likes||0)+1">Like</button>
    ${Array.from({ length: 12 }, () => '<button class="modalClick_close">Covered close</button>').join('')}
    <iframe id="gn_interstitial_iframe_content" style="position:fixed;inset:0;width:100%;height:100%;z-index:100"
      srcdoc="<button id='gn_interstitial_close_icon' onclick='window.frameElement.remove()'>Close</button>"></iframe>`);
  expect(await reactToArticle(page)).toBe('clicked');
  expect(await page.evaluate(() => (window as unknown as { likes: number }).likes)).toBe(1);
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('navigation during overlay iframe discovery does not abort the pending action', async ({ page }) => {
  // Inject the precise protocol failure recorded in both runs, once during discovery.
  const originalLocator = page.locator.bind(page);
  let interrupted = false;
  page.locator = ((selector: string, options?: Parameters<typeof page.locator>[1]) => {
    const locator = originalLocator(selector, options);
    if (selector.startsWith('iframe#gn_interstitial')) {
      const originalHandles = locator.elementHandles.bind(locator);
      locator.elementHandles = async () => {
        if (!interrupted) {
          interrupted = true;
          throw new Error('locator.elementHandles: Execution context was destroyed, most likely because of a navigation');
        }
        return originalHandles();
      };
    }
    return locator;
  }) as typeof page.locator;
  await installOverlays(page);
  await page.setContent('<button onclick="this.textContent=\'Done\'">Continue</button>');
  await page.getByRole('button').click();
  expect(interrupted).toBe(true);
  await expect(page.getByRole('button')).toHaveText('Done');
});
