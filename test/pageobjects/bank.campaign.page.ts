import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class BankCampaignPage extends Page {
    /**
     * define selectors using getter methods
     */
    get cashGiftBtn() { return $$('table.marginleft15 tr td input[name*="FORM_CASH_GIFT_SERVICE:"]') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

    async canClickCampaign(): Promise<boolean> {
        return (await this.cashGiftBtn).length > 0;
    }

    async handleClickCampaign(): Promise<void> {
        if (!await this.canClickCampaign()) {
            return;
        }
        let campaignList = await this.cashGiftBtn;
        for (let index = 0; index < campaignList.length; index++) {
            const campaign = campaignList[index];
            const currentWindows = await browser.getWindowHandle();
            await campaign.click();
            await browser.pause(5000);
            await browser.switchToWindow(currentWindows);
        }
    }
}

export default new BankCampaignPage();
