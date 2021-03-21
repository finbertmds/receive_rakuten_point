import config from "../../config";

export default class AppScreen {
    selector: string;
    
    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Wait for the screen to be visible
     *
     * @param {boolean} isShown
     * @return {boolean | void}
     */
    waitForIsShown (isShown: boolean = true): boolean | void {
        return $(this.selector).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: !isShown,
        });
    }

    /**
     * Wait for the element to be visible
     * @param {string} selectorString 
     * @param {boolean} isShown 
     * @returns {boolean | void}
     */
    waitForElementIsShown (selectorString: string, isShown: boolean = true): boolean | void {
        return $(selectorString).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: !isShown,
        });
    }
}
