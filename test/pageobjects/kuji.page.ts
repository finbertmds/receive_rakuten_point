import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class KujiPage extends Page {
    /**
     * define selectors using getter methods
     */
    get liKujiList() { return $$('.kuji_list li') }
    // get kujiElement (kujiCountCurrent: string) { return $('//section[@class="kuji_list"]/ul/li['+kujiCountCurrent+']/a/img') }
    get btnDisnon() { return $('.btn-10000') }
    get btnEntry() { return $('#entry') }
    get fcDialogContent() { return $('.fc-dialog-content') }
    get fcRewardedAdButton() { return $('.fc-rewarded-ad-button') }
    get fcCloseButton() { return $('#close_button_icon') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async getKujiCount(): Promise<number> {
        return (await this.liKujiList).length;
    }

    async getKujiElementIndex(index: number): Promise<WebdriverIO.Element | null> {
        let kujiElementList = (await this.liKujiList);
        if (kujiElementList.length > 0) {
            let kujiElement = kujiElementList[index];
            let kujiElementLink = (await kujiElement.$$('a')).length > 0;
            if (kujiElementLink) {
                return (await kujiElement.$('a')).$('img')
            }
        }
        return null;
        // return (await (await this.liKujiList)[index].$('a')).$('img')
    }

    async handleClickKujiElementIndex(index: number): Promise<boolean> {
        let kujiElementIndex = await this.getKujiElementIndex(index)
        if (!kujiElementIndex) {
            return false;
        }
        await kujiElementIndex.click();
        await browser.pause(3000)
        let url = await browser.getUrl()
        if (url.indexOf(config.KUJI_HOME_PAGE) == -1) {
            return false;
        }
        return true;
        // await (await this.getKujiElementIndex(index)).click()
        // await browser.pause(1000)
    }

    async hasDisnon() {
        return await (await this.btnDisnon).isDisplayed();
    }

    async handleHasDisnon() {
        await (await this.btnDisnon).click();
    }

    async hasEntry() {
        await browser.pause(5000)
        return await (await this.btnEntry).isExisting();
    }

    async isDisplayedEntry() {
        await browser.pause(1000)
        return await (await this.btnEntry).isDisplayed();
    }

    async handleFcDialogIsShow() {
        await browser.pause(1000)
        let isFcDialogIsShow = false;
        if (await (await this.fcDialogContent).isExisting()) {
            if (await (await this.fcDialogContent).isDisplayed()) {
                if (await (await this.fcRewardedAdButton).isDisplayed() && await (await this.fcRewardedAdButton).isClickable()) {
                    await (await this.fcRewardedAdButton).click()
                    await browser.pause(40000);
                    isFcDialogIsShow = true;
                }
            }
        }
        if (!isFcDialogIsShow) {
            return;
        }
        await browser.refresh();
        await browser.pause(3000);
    }

    async handleClickEntry() {
        await browser.pause(2000)
        let url = await browser.getUrl()
        if (url.indexOf(config.KUJI_HOME_PAGE) == -1) {
            console.log("this page is not kuji: " + url);
            return;
        }
        if (!(await (await this.btnEntry).isExisting())) {
            console.log("entry is not existing");
            return;
        }
        await (await this.btnEntry).moveTo();
        if (!(await (await this.btnEntry).isClickable())) {
            console.log("entry is not clickable");
            return;
        }
        await (await this.btnEntry).click();
        let clickedAfterTime = new Date();
        await browser.waitUntil(async () => {
            try {
                let now = new Date();
                let diffMs = (now.valueOf() - clickedAfterTime.valueOf());
                url = await browser.getUrl()
                if (url.indexOf(config.KUJI_HOME_PAGE) == -1 || diffMs >= config.DEFAULT_KUJI_PAGE_TIMEOUT) {
                    console.log(`diffMs greater than timeout`);
                    return true;
                }
                console.log(`diffMs less than timeout`);
                return !(await (await this.btnEntry).isDisplayed())
            } catch (error) {
                return true
            }
        },
            {
                timeout: config.DEFAULT_KUJI_PAGE_TIMEOUT * 2,
                timeoutMsg: 'expected end page kuji',
                interval: 5000
            })
    }

    async handleProcessAfterClickKuji(index: number, isDefaultLink: boolean = false) {
        await browser.pause(5000)
        let url = await browser.getUrl()
        if (url.indexOf(config.KUJI_HOME_PAGE) == -1) {
            return;
        }
        if (!isDefaultLink && await this.hasDisnon()) {
            await this.handleHasDisnon();
        }
        await browser.pause(5000)
        if (url.indexOf(config.KUJI_HOME_PAGE) == -1) {
            return;
        }
        await this.handleFcDialogIsShow();
        await this.handleClickEntry();
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open(kujiLink: string = config.KUJI_HOME_PAGE) {
        return super.open(kujiLink);
    }
}

export default new KujiPage();
