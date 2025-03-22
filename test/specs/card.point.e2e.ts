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

    it('rakuten:click_link_get_point', async () => {
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
        for (let index = labelclickPointCountTxt - 1; index >= 0; index--) {
            // let clickPointListCount = await rakutencardPage.getClickPointListCount();
            // console.log("getClickPointListCount: ", clickPointListCount);
            let canClickNew = await rakutencardPage.canClickPointNewIndex(index);
            console.log("canClickNew--- " + index + ": ", canClickNew);
            if (canClickNew) {
                const currentWindows = await browser.getWindowHandle();
                await rakutencardPage.handleClickPointNewIndex(index);
                await browser.pause(2000);
                await browser.switchToWindow(currentWindows);
            }
        }

        await rakutencardPage.handleClickShoppingLink();
        let canClickShoppingReceivePoint = await rakutencardPage.canClickShoppingReceivePointFromBtn();
        console.log("canClickShoppingReceivePoint: ", canClickShoppingReceivePoint);
        if (canClickShoppingReceivePoint) {
            await rakutencardPage.handleClickShoppingReceivePoint();
            await browser.pause(5000);
        }
        await browser.pause(2000)
    });

    // it('rakuten:view_video_get_point_one_day_monthly', async () => {
    //     let currentDate = new Date().getDate();
    //     if (currentDate !== config.DAY_VIEW_VIDEO_GET_POINT) {
    //         console.log(`only view video in day ${config.DAY_VIEW_VIDEO_GET_POINT}`);
    //         return;
    //     }
    //     await credentials();
    //     await rakutencardPage.open();
    //     if (await rakutencardPage.isNeedLogin()) {
    //         await rakutencardPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD)
    //         await rakutencardPage.open()
    //     }
    //     await rakutencardPage.handleClickPointCountLink();

    //     await rakutencardPage.handlClickVideo();
    // });
});


