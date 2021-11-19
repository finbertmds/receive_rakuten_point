import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class KujiPage extends Page {
    /**
     * define selectors using getter methods
     */
    get liKujiList () { return $$('.kuji_list li') }
    // get kujiElement (kujiCountCurrent: string) { return $('//section[@class="kuji_list"]/ul/li['+kujiCountCurrent+']/a/img') }
    get btnDisnon () { return $('.btn-10000') }
    get btnEntry () { return $('#entry') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async getKujiCount (): Promise<number> {
        return (await this.liKujiList).length;
    }

    async getKujiElementIndex (index: number): Promise<WebdriverIO.Element | null> {
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

    async handleClickKujiElementIndex (index: number): Promise<boolean> {
        let kujiElementIndex = await this.getKujiElementIndex(index)
        if (!kujiElementIndex) {
            return false;
        }
        await kujiElementIndex.click();
        return true;
        // await (await this.getKujiElementIndex(index)).click()
        // await browser.pause(1000)
    }

    async hasDisnon () {
        return await (await this.btnDisnon).isDisplayed();
    }

    async handleHasDisnon () {
        await (await this.btnDisnon).click();
    }

    async hasEntry () {
        await browser.pause(5000)
        return await (await this.btnEntry).isExisting();
    }

    async isDisplayedEntry () {
        await browser.pause(1000)
        return await (await this.btnEntry).isDisplayed();
    }

    async handleClickEntry () {
        await browser.pause(1000)
        if (!(await (await this.btnEntry).isClickable())) {
            return;
        }
        await (await this.btnEntry).click();
        let clickedAfterTime = new Date();
        await browser.waitUntil(async () => {
            try {
                let now = new Date();
                let diffMs = (now.valueOf() - clickedAfterTime.valueOf());
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                if (diffMins >= config.DEFAULT_KUJI_PAGE_TIMEOUT) {
                    return true;
                }
                return !(await (await this.btnEntry).isDisplayed())
            } catch (error) {
                return true
            }
        },
        {
            timeout: config.DEFAULT_KUJI_PAGE_TIMEOUT * 2,
            timeoutMsg: 'expected end page kuji'
        })
    }

    async handleProcessAfterClickKuji (index: number, isDefaultLink: boolean = false) {
        if (!isDefaultLink && await this.hasDisnon()) {
            await this.handleHasDisnon();
        }
        if (await this.hasEntry()) {
            console.log(`kuji ${index}: hasEntry`);
            await this.handleClickEntry();
        } else {
            console.log("notEntry");
        }
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open (kujiLink: string = config.KUJI_HOME_PAGE) {
        return super.open(kujiLink);
    }
}

export default new KujiPage();
