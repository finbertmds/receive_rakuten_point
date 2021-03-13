import config from '../pageobjects/config';
import kujiPage from '../pageobjects/kuji.page';
import loginPage from '../pageobjects/login.page';
import rakutencardPage from '../pageobjects/rakutencard.page';
import websearchPage from '../pageobjects/websearch.page';

describe('Rakuten', () => {
    beforeEach(async function() {
      const windows = await browser.getWindowHandles();
      await browser.switchToWindow(windows[0]);
    })

    async function credentials() {
        await loginPage.open();
        await loginPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);
        await websearchPage.open();
        if (await websearchPage.isNeedLogin()) {
            await websearchPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);
        }
    }

    async function loginExtension() {
        await websearchPage.open();
        if (await websearchPage.isNeedLogin()) {
            await websearchPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);
        }
    }

    it('search_get_point', async () => {
        await credentials();
        await loginExtension();
        await websearchPage.search();
        await browser.pause(2000)
    });
    
    it('click_link_get_point', async () => {
        await credentials();
        await rakutencardPage.open();
        if (await rakutencardPage.isNeedLogin()) {
            await rakutencardPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD)
        }
        let labelclickPointCountTxt = await rakutencardPage.getLableClickPointCountTxt();
        await rakutencardPage.handleClickPointCountLink();
        for (let index = labelclickPointCountTxt - 1; index >= 0; index--) {
            // let clickPointListCount = await rakutencardPage.getClickPointListCount();
            // console.log("getClickPointListCount: ", clickPointListCount);
            let canClickNew = await rakutencardPage.canClickPointNewIndex(index);
            console.log("canClickNew--- "+index+" : ", canClickNew);
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

    it('kuji_get_point', async () => {
        await credentials();
        await kujiPage.open();
        let kujiCount = await kujiPage.getKujiCount()
        if (kujiCount > 0) {
            for (let index = 0; index < kujiCount; index++) {
                await kujiPage.open();
                await kujiPage.handleClickKujiElementIndex(index);
                await kujiPage.handleProcessAfterClickKuji();
            }
        }
        await browser.pause(2000)
    });
    
    it('kuji_default_get_point', async () => {
        await credentials();
        for (let index = 0; index < config.KUJI_DEFAULT_LINK.length; index++) {
            await kujiPage.open(config.KUJI_DEFAULT_LINK[index]);
            await kujiPage.handleProcessAfterClickKuji(true);
        }
        await browser.pause(2000)
    });
});


