/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  open(path: string) {
    return browser.url(`${path}`);
  }

  async openPage(url: string) {
    for (let retry = 0; retry < 3; retry++) {
      try {
        await browser.url(url);
        return true;
      } catch (e) {
        console.log(`Open page failed (${retry + 1})`);

        try {
          await browser.execute(() => window.stop());
        } catch {}

        await browser.pause(2000);
      }
    }

    return false;
  }
}
