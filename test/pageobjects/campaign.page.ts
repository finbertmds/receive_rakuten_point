import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CampaignPage extends Page {
    entryButtonList = [
        '.rcEntryButton-button',
        '.btn-entry-anim',
    ]

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async canEntry (): Promise<number> {
        for (let index = 0; index < this.entryButtonList.length; index++) {
            const element = $(this.entryButtonList[index]);
            if (await (await element).isDisplayed()) {
                return index;
            }
        }
        return -1;
    }

    async clickBtnEntry (index: number): Promise<void> {
        await (await $(this.entryButtonList[index])).click();
    }

    async entryCampaign (): Promise<void> {
        for (let index = 0; index < config.CAMPAIGN_PAGE_LIST.length; index++) {
            const element = config.CAMPAIGN_PAGE_LIST[index];
            this.open(element);
            await browser.pause(5000);
            let isClickedEntry = false;
            let canClickEntryIndex = await this.canEntry();
            if (canClickEntryIndex > -1) {
                await this.clickBtnEntry(canClickEntryIndex);
                isClickedEntry = true;
            }
            if (!isClickedEntry) {
                continue;
            }
            await browser.pause(5000);
            console.log("entryCampaign: ", element);
        }
    }
}

export default new CampaignPage();
