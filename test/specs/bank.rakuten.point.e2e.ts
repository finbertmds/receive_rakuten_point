import config from '../../config';
import bankCampaignPage from '../pageobjects/bank.campaign.page';
import bankLoginPage from '../pageobjects/bank.login.page';

describe('Rakuten', () => {
    beforeEach(async function() {
      const windows = await browser.getWindowHandles();
      await browser.switchToWindow(windows[0]);
    })

    async function bankCredentials() {
        await bankLoginPage.open();
        await (await bankLoginPage.gotoLoginPageBtn).click();
        await browser.pause(5000);
        await bankLoginPage.login(config.BANK_RAKUTEN_USERNAME, config.BANK_RAKUTEN_PASSWORD);
        await browser.pause(config.DEFAULT_TIMEOUT);
    }
    
    it('bank_click_campaign', async () => {
        await bankCredentials();
        await bankCampaignPage.handleClickCampaign();
    });
});


