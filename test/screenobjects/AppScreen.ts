import config from "../../config";

export default class AppScreen {
    private selector: string;

    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Wait for the login screen to be visible
     *
     * @param {boolean} isShown
     */
    async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
    }

    /**
     * Wait for the element to be visible
     * @param {string} selectorString 
     * @param {boolean} isShown 
     */
     async waitForElementIsShown (selectorString: string, isShown: boolean = true): Promise<boolean | void> {
        return $(selectorString).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: !isShown,
        });
    }
}
