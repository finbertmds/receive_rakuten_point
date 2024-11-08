import config from "../../config";
import Gestures from "../helpers/Gestures";
import cFirststartScreen from "../screenobjects/chrome/c.firststart.screen";
import kFirststartScreen from "../screenobjects/kuji/k.firststart.screen";
import kHomeScreen from "../screenobjects/kuji/k.home.screen";
import kKujiScreen from "../screenobjects/kuji/k.kuji.screen";
import kLoginScreen from "../screenobjects/kuji/k.login.screen";
import kLuckykujiScreen from "../screenobjects/kuji/k.luckykuji.screen";
import kMessageboxScreen from "../screenobjects/kuji/k.messagebox.screen";

describe('rakuten_kuji', async () => {
    before(async () => {
        await driver.activateApp(config.RAKUTEN_KUJI_APP_ID);
        await driver.pause(5000);
    })

    async function handleFirstTimeEnterApp() {
        await closeWarningLabel();
        await handleFirstTimeLogin();
        await closeWarningLabel();
        await driver.activateApp(config.RAKUTEN_RECIPE_APP_ID);
        await driver.pause(5000);
        await driver.activateApp(config.RAKUTEN_KUJI_APP_ID);
        await driver.pause(5000);
        await closeWarningLabel();
    }

    async function closeWarningLabel() {
        await driver.pause(5000);
        if (await kFirststartScreen.warningLabel.isDisplayed()) {
            await kFirststartScreen.closeLabel.click();
        }
        await driver.pause(5000);
        if (await kFirststartScreen.warningLabel.isDisplayed()) {
            await kFirststartScreen.closeLabel.click();
        }
    }

    async function handleFirstTimeLogin() {
        if (await kFirststartScreen.tutorialSkipButton.isDisplayed()) {
            await kFirststartScreen.tutorialSkipButton.click();
        }
        await driver.pause(5000);

        if (! await kLoginScreen.loginScreen.isExisting()) {
            await handleChromeAction();
            await driver.pause(5000);
        }
        // await kLoginScreen.waitForEnterLoginScreen();
        if (await (await kLoginScreen.skipToSignIn).isDisplayed()) {
            await kLoginScreen.skipToSignIn.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await kLoginScreen.waitForLoggedIn();
            return;
        }
        if (await (await kLoginScreen.loginContinueButton).isDisplayed()) {
            await kLoginScreen.loginContinueButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await kLoginScreen.waitForLoggedIn();
            return;
        }
        if (await (await kLoginScreen.loginWithOtherButton).isDisplayed()) {
            await kLoginScreen.loginWithOtherButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        }
        await kLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await driver.pause(3000);
        await kLoginScreen.nextButton.click();
        await driver.pause(3000);
        await kLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await driver.pause(3000);
        await kLoginScreen.signInButton.click();
        await driver.pause(3000);
        await kLoginScreen.waitForLoggedIn();
    }

    async function handleChromeAction() {
        let currentPackage = await driver.getCurrentPackage();
        console.log("currentPackage: " + currentPackage);
        if (currentPackage !== config.CHROME_APP_ID) {
            console.log("chrome app is not showing");
            return;
        }
        if (await (await kLoginScreen.loginContinueButton).isDisplayed()) {
            console.log("login page is displayed");
            return;
        }

        await cFirststartScreen.waitForIsShown();
        if (await (await cFirststartScreen.acceptContinueButton).isDisplayed()) {
            await (await cFirststartScreen.acceptContinueButton).click();
            await (await cFirststartScreen.noThanksButton).click();
            await driver.pause(5000);
        }
    }

    async function checkIsLoggedIn() {
        let rakutenNameLabel = kHomeScreen.homeTabLabel
        if (await rakutenNameLabel.isExisting()) {
            if (await (await rakutenNameLabel).isDisplayed()) {
                return true;
            }
        }
        return false;
    }

    async function handleClickKujiV2() {
        if (await kHomeScreen.kujiTabLabel.isDisplayed()) {
            await kHomeScreen.kujiTabLabel.click();
        } else {
            console.log("not login");
            return;
        }

        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        let kujiList = await kKujiScreen.groupKuji;
        for (let index = 0; index < kujiList.length; index++) {
            await handleLuckyKujiV2();
            const kujiElement = kujiList[index];
            await kujiElement.click();
            await driver.pause(5000);

            // kuji is clicked, then continue
            if (await (await kKujiScreen.kujiListLabel).isDisplayed()) {
                continue;
            }

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
                let backCount = 0;
                do {
                    await driver.pause(parseInt(String(2 * config.DEFAULT_TIMEOUT / 3)));
                    await driver.back();
                    await handleDontCloseApp();
                    backCount++;
                    if (await kHomeScreen.kujiTabLabel.isDisplayed()) {
                        break;
                    }
                } while (backCount <= 3);
                await kHomeScreen.kujiTabLabel.click();
                console.log(`"kuji clicked: ${index + 1}"`);
                await Gestures.swipeUp(0.5);
            }
        }
    }

    async function handleClickMainLayoutKuji() {
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
                    if (await kHomeScreen.homeTabLabel.isDisplayed()) {
                        await kHomeScreen.homeTabLabel.click();
                    }
                    console.log(`"kuji clicked: ${index + 1}"`);
                }
            }
        }
    }

    async function handleClickAd() {
        // await kHomeScreen.waitForPlayMoviewIconIsShown();
        await driver.pause(config.DEFAULT_TIMEOUT);
        if (! await kHomeScreen.adButton.isDisplayed()) {
            console.log("AdButton is not displayed");
            return;
        }
        await kHomeScreen.adButton.click();
        await driver.pause(5000);
        if (! await kHomeScreen.adButton.isDisplayed()) {
            await driver.pause(config.DEFAULT_TIMEOUT > 45000 ? 1.5 * config.DEFAULT_TIMEOUT : 45000);
            if (await (await kHomeScreen.adCloseButton).isDisplayed()) {
                await (await kHomeScreen.adCloseButton).click();
                await driver.pause(5000);
            }
            console.log(`"kujiAd clicked"`);
            if (await (await kHomeScreen.missionAlert).isDisplayed()) {
                await driver.back();
            }
        }
    }

    async function handleClickMessage() {
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

    async function handleLuckyKuji() {
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

    async function handleLuckyKujiV2() {
        await driver.pause(5000);
        await kHomeScreen.handleStartGacha();

        await driver.pause(5000);

        if (await (await kLuckykujiScreen.kagiArea).isExisting()) {
            if (!await (await kLuckykujiScreen.kagiArea01).isExisting()) {
                await (await kLuckykujiScreen.kagiArea).click();
            } else {
                console.log("not enough kagi");
                return;
            }
        }
        if (await (await kLuckykujiScreen.treasureDialog).isDisplayed()) {
            await (await kLuckykujiScreen.treasurePlayButton).click();

            await driver.pause(config.DEFAULT_TIMEOUT > 45000 ? 1.5 * config.DEFAULT_TIMEOUT : 45000);
            await driver.back();
            await handleDontCloseApp();
        }
    }


    async function handleDontCloseApp() {
        await handleLuckyKujiV2();
        if (await kHomeScreen.closeAppNoButton.isDisplayed()) {
            await kHomeScreen.closeAppNoButton.click();
        }
    }

    it('k_click_kuji', async () => {
        await driver.pause(7000);

        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            await handleFirstTimeEnterApp();
        }
        await handleLuckyKujiV2();
        await driver.pause(config.DEFAULT_TIMEOUT);

        await handleClickKujiV2();
    });

    it('k_click_message', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        await handleLuckyKujiV2();
        if (await kHomeScreen.homeTabLabel.isDisplayed()) {
            await kHomeScreen.homeTabLabel.click();
        }
        await handleClickMessage();
    });

    it('k_click_ad', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        await handleLuckyKujiV2();
        if (await kHomeScreen.homeTabLabel.isDisplayed()) {
            await kHomeScreen.homeTabLabel.click();
        }
        await handleClickAd();
    });
});


