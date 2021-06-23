import config from '../../config';
import webSearchHelpers from '../helpers/webSearchHelpers';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class WebSearchPage extends Page {
    /**
     * define selectors using getter methods
     */
    get btnLogin () { return $('//a[contains(text(),\'ログイン\')]') }

    get inputSearchFormTxt () { return $('#srchformtxt_qt') }
    get inputSearchBtn () { return $('#searchBtn') }
    get labelCurrentSearchCount () { return $('.sc-fzqNJr') }

    /**
     * login page require
     */
    get inputUsername () { return $('#loginInner_u') }
    get inputPassword () { return $('#loginInner_p') }
    get btnSubmit () { return $('[name="submit"]') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async isNeedLogin (): Promise<boolean> {
        return await (await this.btnLogin).isDisplayed();
    }

    async clickBtnLogin (): Promise<void> {
        await (await this.btnLogin).click();
    }

    async isNotLoggedIn (): Promise<boolean> {
        return await (await this.inputUsername).isDisplayed();
    }

    async login (username: string, password: string): Promise<void> {
        await this.clickBtnLogin();
        await browser.pause(config.DEFAULT_TIMEOUT)
        if (!await this.isNotLoggedIn()) {
            return;
        }
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnSubmit).click();
        await browser.pause(config.DEFAULT_TIMEOUT)
    }

    async search (): Promise<void> {
        if (!await (await this.labelCurrentSearchCount).isExisting()) {
            console.log("labelCurrentSearchCount not found");
            return;
        }
        let currentSearchCount = await (await this.labelCurrentSearchCount).getText();
        console.log("currentSearchCount: ", currentSearchCount);
        while (parseInt(currentSearchCount) < config.WEBSEARCH_MAX_COUNT) {
            let myRandomKeySearch = webSearchHelpers.generateRandomKeySearch();
            await (await this.inputSearchFormTxt).setValue(myRandomKeySearch)
            await (await this.inputSearchBtn).click()
            await browser.pause(5000)
            currentSearchCount = (parseInt(currentSearchCount) + 1).toString()
            let currentSearchCountLabel = await (await this.labelCurrentSearchCount).getText();
            console.log("currentSearchCount: ", currentSearchCountLabel);
        }
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open(config.WEBSEARCH_SEARCH_PAGE);
    }
}

export default new WebSearchPage();
