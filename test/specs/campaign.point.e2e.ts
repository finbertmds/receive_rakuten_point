import config from '../../config';
import campaignPage from '../pageobjects/campaign.page';
import loginPage from '../pageobjects/login.page';
import rakutencardPage from '../pageobjects/rakutencard.page';

describe('Rakuten', () => {
    beforeEach(async function () {
        const windows = await browser.getWindowHandles();
        await browser.switchToWindow(windows[0]);
    })

    async function credentials() {
        await loginPage.open();
        await loginPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);

        await rakutencardPage.open();
        await browser.pause(5000);
        if (await rakutencardPage.isNeedLogin()) {
            await rakutencardPage.loginV2(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD)
        }
    }

    it('rakuten:entry_campaign', async () => {
        await credentials();
        await campaignPage.entryCampaign();
    });
});


