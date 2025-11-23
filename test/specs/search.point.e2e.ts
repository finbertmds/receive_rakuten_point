import config from '../../config';
import loginPage from '../pageobjects/login.page';
import rakutencardPage from '../pageobjects/rakutencard.page';
import websearchPage from '../pageobjects/websearch.page';

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

    async function credentialsForWebSearch() {
        await websearchPage.open();
        await browser.pause(config.DEFAULT_TIMEOUT);
        if (await websearchPage.isNeedLogin()) {
            await websearchPage.loginV2(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);
        }
    }

    it('websearch__entry_get_point', async () => {
        await credentials();
        await credentialsForWebSearch();
        await websearchPage.entryCampaign();
        await browser.pause(2000)
    });
});


