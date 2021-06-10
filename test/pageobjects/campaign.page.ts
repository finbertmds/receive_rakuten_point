import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CampaignPage extends Page {
    get entryButton () { return $('.rcEntryButton-button') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async canEntry (): Promise<boolean> {
        return await (await this.entryButton).isDisplayed();
    }

    async clickBtnEntry (): Promise<void> {
        await (await this.entryButton).click();
    }

    async entryCampaign (): Promise<void> {
        for (let index = 0; index < config.CAMPAIGN_PAGE_LIST.length; index++) {
            const element = config.CAMPAIGN_PAGE_LIST[index];
            this.open(element);
            await browser.pause(2000);
            if (!await this.canEntry()) {
                return;
            }
            await this.clickBtnEntry();
            await browser.pause(5000);
        }
    }
}

export default new CampaignPage();
