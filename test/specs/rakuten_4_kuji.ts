import config from "../../config";
import Gestures from "../helpers/Gestures";
import kFirststartScreen from "../screenobjects/kuji/k.firststart.screen";
import kHomeScreen from "../screenobjects/kuji/k.home.screen";
import kLoginScreen from "../screenobjects/kuji/k.login.screen";
import kLuckykujiScreen from "../screenobjects/kuji/k.luckykuji.screen";
import kMessageboxScreen from "../screenobjects/kuji/k.messagebox.screen";

describe('rakuten_kuji', async () => {
    before(async () => {
        await driver.activateApp(config.RAKUTEN_KUJI_APP_ID);
        await driver.pause(5000);
    })

    async function handleFirstTimeEnterApp () {
        if (! await kFirststartScreen.warningLabel.isDisplayed()) {
            return;
        }
        await kFirststartScreen.closeLabel.click();
        await handleFirstTimeLogin();
    }

    async function handleFirstTimeLogin () {
        await kLoginScreen.waitForIsShown();
        await kLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await kLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await kLoginScreen.loginButton.click();
        await kLoginScreen.waitForLoggedIn();
    }

    async function handleClickMainLayoutKuji () {
        await driver.pause(config.DEFAULT_TIMEOUT);
        // await kHomeScreen.waitForMainLayoutIsShown();
        let kujiList = await kHomeScreen.mainLayoutKujiList();
        console.log("kujiCount: ", kujiList?.length);
        
        if (kujiList && kujiList.length > 0) {
            for (let index = 0; index < kujiList.length; index++) {
                await handleLuckyKuji();
                const kujiElement = await kHomeScreen.mainLayoutKujiIndex(index);
                if (!kujiElement) {
                    continue;
                }
                await kujiElement.click();
                await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
                if (! await kHomeScreen.playMovieIcon.isDisplayed()) {
                    await driver.pause(config.DEFAULT_TIMEOUT);
                    if (await kFirststartScreen.closeLabel.isDisplayed()) {
                        await kFirststartScreen.closeLabel.click();
                    }
                    await driver.pause(parseInt(String(2 * config.DEFAULT_TIMEOUT / 3)));
                    if (await kFirststartScreen.noButton.isDisplayed()) {
                        await kFirststartScreen.noButton.click();
                    }
                    await driver.pause(parseInt(String(2 * config.DEFAULT_TIMEOUT / 3)));
                    await driver.back();
                    await handleDontCloseApp();
                    await driver.pause(parseInt(String(2 * config.DEFAULT_TIMEOUT / 3)));
                    await driver.back();
                    await handleDontCloseApp();
                    if(await kHomeScreen.homeTabLabel.isDisplayed()) {
                        await kHomeScreen.homeTabLabel.click();
                    }
                    console.log(`"kuji clicked: ${index + 1}"`);
                }
            }
        }
    }

    async function handleClickAd () {
        // await kHomeScreen.waitForPlayMoviewIconIsShown();
        if (! await kHomeScreen.playMovieIcon.isDisplayed()) {
            return;
        }
        await kHomeScreen.playMovieIcon.click();
        await driver.pause(5000);
        if (! await kHomeScreen.playMovieIcon.isDisplayed()) {
            await driver.pause(config.DEFAULT_TIMEOUT > 45000 ? 1.5 * config.DEFAULT_TIMEOUT : 45000);
            await driver.back();
            await handleDontCloseApp();
            console.log(`"kujiAd clicked"`);
        }
    }

    async function handleClickMessage () {
        if (! await kHomeScreen.messageLabel.isDisplayed()) {
            return;
        }
        await kHomeScreen.messageLabel.click();
        // await kMessageboxScreen.waitForIsShown();
        // await kMessageboxScreen.waitForMessageIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        let messageList = await kMessageboxScreen.messageThumbnailList;
        for (let index = 0; index < messageList.length; index++) {
            const messageElement = messageList[index];
            await messageElement.click();
            await driver.pause(5000);
            await driver.back();
            await handleDontCloseApp();
        }
        await driver.back();
        await handleDontCloseApp();
    }

    async function handleLuckyKuji () {
        await driver.pause(5000);
        if (await kLuckykujiScreen.announcement.isDisplayed()) {
            await driver.pause(5000);
            if (await kLuckykujiScreen.okButton.isDisplayed()) {
                await kLuckykujiScreen.okButton.click();
                return;
            }
        }
        if (await kLuckykujiScreen.entry.isDisplayed()) {
            await kLuckykujiScreen.entry.click();
            await driver.pause(config.DEFAULT_TIMEOUT > 45000 ? 1.5 * config.DEFAULT_TIMEOUT : 45000);
            if (await kLuckykujiScreen.entry.isDisplayed()) {
                await kLuckykujiScreen.entry.click();
                await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT)));
            }
            await driver.back();
            await handleDontCloseApp();
        }
    }

    async function handleDontCloseApp () {
        await handleLuckyKuji();
        if (await kHomeScreen.closeAppNoButton.isDisplayed()) {
            await kHomeScreen.closeAppNoButton.click();
        }
    }

    it('k_click_mainlayout_kuji', async () => {
        await driver.pause(7000);

        await handleFirstTimeEnterApp();
        await handleLuckyKuji();
        await driver.pause(config.DEFAULT_TIMEOUT);
        await Gestures.swipeUp(4 / 10);
        for (let index = 0; index < config.RAKUTEN_KUJI_RUN_AGAIN_TEST; index++) {
            await handleClickMainLayoutKuji();
        }
    });

    it('k_click_ad', async () => {
        await handleLuckyKuji();
        await Gestures.swipeOnPercentage(
            Gestures.calculateXY({ x: 50, y: 35 }, 1),
            Gestures.calculateXY({ x: 50, y: 85 }, 1),
        );
        await handleClickAd();
    });

    it('k_click_message', async () => {
        await handleLuckyKuji();
        await handleClickMessage();
    });
});


