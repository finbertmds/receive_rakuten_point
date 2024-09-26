import config from "../../config";

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
        return browser.url(`${path}`)
    }

    async handleScrollIntoView(element: WebdriverIO.Element, isClickBefore: boolean = false) {
        let scrollCount = 0;
        do {
            if (await this.checkElementClickableOrDisplayed(element, isClickBefore)) {
                await browser.scroll(0, 10);
                console.log("--scrollToView: element is displayed");
                break;
            }
            console.log("--scrollToView: " + scrollCount++);
            await browser.scroll(0, 10);
            if (scrollCount >= config.SCROLLINTOVIEW_MAXCOUNT) {
                console.log("--scrollToView: is max count");
                break;
            }
        } while (await this.checkElementClickableOrDisplayed(element, isClickBefore));
        console.log("--scrollToView: element is " + (await element.isDisplayed()) ? "displayed" : "not displayed");
    }

    private async checkElementClickableOrDisplayed(element: WebdriverIO.Element, isClickBefore: boolean): Promise<boolean> {
        if (isClickBefore) {
            return element.isClickable();
        } else {
            return element.isDisplayed()
        }
    }
}
