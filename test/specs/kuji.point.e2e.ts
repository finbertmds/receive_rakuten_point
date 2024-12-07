import config from '../../config';
import timeHelper from '../helpers/timeHelper';
import kujiPage from '../pageobjects/kuji.page';
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

    it('rakuten:kuji_default_get_point', async () => {
        await credentials();
        for (let index = 0; index < config.KUJI_DEFAULT_LINK.length; index++) {
            await kujiPage.open(config.KUJI_DEFAULT_LINK[index]);
            await kujiPage.handleProcessAfterClickKuji(index, true);
        }
        await browser.pause(2000)
    });

    it('rakuten:kuji_get_point', async () => {
        await credentials();
        await kujiPage.open();
        let kujiCount = await kujiPage.getKujiCount();
        let isAM = timeHelper.checkIsAM();
        if (kujiCount > 0) {
            let kujiCountHalf = (Math.round(kujiCount / 2));
            for (let index = (isAM ? 0 : kujiCountHalf); index < (isAM ? kujiCountHalf : kujiCount); index++) {
                await kujiPage.open();
                console.log("open kuji at " + index);
                let clickedKuji = await kujiPage.handleClickKujiElementIndex(index);
                if (clickedKuji) {
                    await kujiPage.handleProcessAfterClickKuji(index, false);
                }
            }
        }
        await browser.pause(2000)
    });
});


