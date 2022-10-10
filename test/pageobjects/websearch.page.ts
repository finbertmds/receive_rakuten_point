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
    get labelCurrentSearchCount () {
        return (async () => {
            let searchCountContainerList = await $$('//span[contains(text(),\'口\')]')
            if (searchCountContainerList.length > 0) {
                let searchCountContainer = searchCountContainerList[0];
                return searchCountContainer.$('./em');
            }
            return $('.sc-fFucqa')
        })();
     }

    /**
     * login page require
     */
    get inputUsername () { return $('#loginInner_u') }
    get inputPassword () { return $('#loginInner_p') }
    get btnSubmit () { return $('[name="submit"]') }

    /**
     * new login page require
     */
    get inputUsernameV2 () { return $('#user_id') }
    get inputPasswordV2 () { return $('#password_current') }
    get btnNextV2 () { return $$('.omni-e2e-button__submit') }
    get btnLoginConfirmV2 () { return $('#prim_continue') }

    get btnEarnPoint () { return $('//*[contains(text(),\'ポイントを貯める\')]') }
    get earnPointLinkCount (): Promise<number> {
        return (async () => {
            let pointsListContainer = await $('.points-list2')
            if (pointsListContainer) {
                let earnPointList = await pointsListContainer.$$('./li');
                return earnPointList.length;
            }
            return 0;
        })();
    }

    getEarnPointLink (index: number) {
        return (async () => {
            let pointsListContainer = await $('.points-list2')
            if (pointsListContainer) {
                let earnPointList = await pointsListContainer.$$('./li');
                if (earnPointList.length > 0 && index < earnPointList.length) {
                    let earnPointItem = earnPointList[index];
                    return earnPointItem.$('./a');
                }
            }
            return null;
        })();
    }

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

    async isNotLoggedInV2 (): Promise<boolean> {
        let inputUsernameIsDisplayed = await (await this.inputUsernameV2).isDisplayed();
        let inputPasswordIsDisplayed = await (await this.inputPasswordV2).isDisplayed();
        return inputUsernameIsDisplayed || inputPasswordIsDisplayed
    }

    async loginV2 (username: string, password: string): Promise<void> {
        await this.clickBtnLogin();
        await browser.pause(config.DEFAULT_TIMEOUT)
        if (!await this.isNotLoggedInV2()) {
            return;
        }
        if (await (await this.inputUsernameV2).isDisplayed()) {
            await (await this.inputUsernameV2).setValue(username);
            let btnNextList = await this.btnNextV2;
            await (btnNextList[0]).click();
            await browser.pause(2000);
        }
        if (await (await this.inputPasswordV2).isDisplayed()) {
            await (await this.inputPasswordV2).setValue(password);
            let btnNextList = await this.btnNextV2;
            await (btnNextList[1]).click();
            await browser.pause(2000);
        }
        if (await (await this.btnLoginConfirmV2).isDisplayed()) {
            await (await this.btnLoginConfirmV2).click();
        }
        await browser.pause(config.DEFAULT_TIMEOUT)
    }

    async search (): Promise<void> {
        let currentSearchCountLabel = await (await this.labelCurrentSearchCount).getText();
        console.log("currentSearchCount: ", currentSearchCountLabel);
        let currentSearchCount = "0";
        while (parseInt(currentSearchCount) < config.WEBSEARCH_MAX_COUNT) {
            await browser.pause(5000)
            let myRandomKeySearch = webSearchHelpers.generateRandomKeySearch();
            // await (await this.inputSearchFormTxt).setValue(myRandomKeySearch)
            // await (await this.inputSearchBtn).click()
            const searchLink = `https://websearch.rakuten.co.jp/Web?qt=${myRandomKeySearch}&col=OW`
            await super.open(searchLink);
            await browser.pause(5000)
            currentSearchCount = (parseInt(currentSearchCount) + 1).toString()
            if (await (await this.labelCurrentSearchCount).isExisting()) {
                currentSearchCountLabel = await (await this.labelCurrentSearchCount).getText();
                console.log("currentSearchCount: ", currentSearchCountLabel);
            }
        }
    }

    async entryCampaign (): Promise<void> {
        super.open(config.WEBSEARCH_SEARCH_HOME_PAGE);
        await browser.pause(5000);
        await (await this.btnEarnPoint).click();
        let earnPointLinkCount = await this.earnPointLinkCount;
        if (earnPointLinkCount > 0) {
            for (let index = 0; index < earnPointLinkCount; index++) {
                let earnPointLink = await this.getEarnPointLink(index);
                if (earnPointLink) {
                    await earnPointLink.click();
                    await browser.pause(10000);
                    const windows = await browser.getWindowHandles();
                    await browser.switchToWindow(windows[0]);
                }
            }
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
