import config from '../../config';
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

    it('card__click_link_get_point', async () => {
        await credentials();
        await rakutencardPage.open();
        await browser.pause(5000);
        let labelclickPointCountTxt = await rakutencardPage.getLableClickPointCountTxt();
        if (! await (await rakutencardPage.btnClickPointCountLink).isDisplayed()) {
            console.log("btnClickPointCountLink is not displayed");
            return;
        }
        await rakutencardPage.handleClickPointCountLink();
        console.log("labelclickPointCountTxt: ", labelclickPointCountTxt);
        await browser.pause(5000);
        const count = await browser.execute(() =>
            document.querySelectorAll('.click-point-banner-image-wrap').length
        );
        console.log("clickPointCount: ", count);

        for (let i = 0; i < count; i++) {
            // Click trong browser
            await browser.execute((idx) => {
                document
                    .querySelectorAll('.click-point-banner-image-wrap')[idx]
                    .click();
            }, i);
            await browser.pause(2000);
        }
        await browser.pause(15000);
    });
});


