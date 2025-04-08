import config from '../../config';
import Gestures from '../helpers/Gestures';
import cFirststartScreen from '../screenobjects/chrome/c.firststart.screen';
import wsFirstStartScreen from "../screenobjects/websearch/ws.firststart.screen";
import wsHomeScreen from '../screenobjects/websearch/ws.home.screen';
import wsLoginScreen from '../screenobjects/websearch/ws.login.screen';

describe('rakuten_search', async () => {
    before(async () => {
        await driver.activateApp(config.RAKUTEN_WEBSEARCH_APP_ID);
        await driver.pause(5000);
    })

    async function checkIsLoggedIn() {
        if (await (await wsHomeScreen.Rakuten).isDisplayed()) {
            return true;
        }
        return false;
    }

    async function handleAgreeTerm() {
        // await wsFirstStartScreen.waitForIsShown();
        await driver.pause(5000);
        if (await (await wsFirstStartScreen.customPanel).isDisplayed()) {
            if (await (await wsFirstStartScreen.aerr_close).isDisplayed()) {
                await wsFirstStartScreen.aerr_close.click();
                await driver.pause(1000);
            }
            if (await (await wsFirstStartScreen.aerr_close).isDisplayed()) {
                await wsFirstStartScreen.aerr_close.click();
                await driver.pause(1000);
            }
            if (await (await wsFirstStartScreen.aerr_close).isDisplayed()) {
                await wsFirstStartScreen.aerr_close.click();
                await driver.pause(1000);
            }
        }

        if (!await (await wsFirstStartScreen.rakuten_tc_checkBox).isDisplayed()) {
            return;
        }
        // let isAccepted = await (await wsFirstStartScreen.rakuten_tc_checkBox).isClickable();
        let isAccepted = await (await wsFirstStartScreen.tc_end).isDisplayed();
        while (!isAccepted) {
            await Gestures.swipeUp(0.5);
            // isAccepted = await (await wsFirstStartScreen.rakuten_tc_checkBox).isClickable();
            isAccepted = await (await wsFirstStartScreen.tc_end).isDisplayed();
        }
        await wsFirstStartScreen.rakuten_tc_checkBox.click();
        await wsFirstStartScreen.rakuten_tc_start_button.click();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
    }

    async function handleFirstTimeLogin() {
        await handleChromeAction();
        // await wsLoginScreen.waitForEnterLoginScreen();
        if (await (await wsLoginScreen.skipToSignIn).isDisplayed()) {
            await wsLoginScreen.skipToSignIn.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await wsLoginScreen.waitForLoggedIn();
            return;
        }
        if (await (await wsLoginScreen.loginContinueButton).isDisplayed()) {
            await wsLoginScreen.loginContinueButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await wsLoginScreen.waitForLoggedIn();
            return;
        }
        if (await (await wsLoginScreen.loginWithOtherButton).isDisplayed()) {
            await wsLoginScreen.loginWithOtherButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        }
        if (config.IS_LOCAL) {
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['text', config.RAKUTEN_USERNAME],
                includeStderr: true,
                timeout: 1000
            });
            console.log("input rakuten username");
            await driver.pause(1000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['keyevent', '66'],
                includeStderr: true,
                timeout: 1000
            });
            console.log("hide keyboard");
            await driver.pause(1000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['tap', '410', '1100'],
                includeStderr: true,
                timeout: 1000
            });
            console.log("click next button");
            await driver.pause(1000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['text', config.RAKUTEN_PASSWORD],
                includeStderr: true,
                timeout: 1000
            });
            console.log("input rakuten password");
            await driver.pause(1000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['keyevent', '66'],
                includeStderr: true,
                timeout: 1000
            });
            console.log("hide keyboard 2");
            await driver.pause(1000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['tap', '410', '1100'],
                includeStderr: true,
                timeout: 1000
            });
            console.log("click next button 2");
        } else {

            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['tap', '410', '840'],
                includeStderr: true,
                timeout: 2000
            });
            await driver.pause(2000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['text', config.RAKUTEN_USERNAME],
                includeStderr: true,
                timeout: 2000
            });
            await driver.pause(2000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['tap', '410', '1100'],
                includeStderr: true,
                timeout: 2000
            });

            await driver.pause(2000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['text', config.RAKUTEN_PASSWORD],
                includeStderr: true,
                timeout: 2000
            });
            await driver.pause(2000);
            await driver.execute('mobile: shell', {
                command: 'input',
                args: ['tap', '410', '1100'],
                includeStderr: true,
                timeout: 2000
            });
        }
        // await wsLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        // await driver.pause(3000);
        // await wsLoginScreen.nextButton.click();
        // await driver.pause(3000);
        // await wsLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        // await driver.pause(3000);
        // await wsLoginScreen.signInButton.click();
        // await driver.pause(3000);
        if (await (await wsLoginScreen.skipToSignIn).isDisplayed()) {
            await wsLoginScreen.skipToSignIn.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        }
        await wsLoginScreen.waitForLoggedIn();
    }

    async function handleCloseFirstPopup() {
        await driver.pause(2000);
        if (await (await wsFirstStartScreen.rakuten_pop_up_actions_layout).isDisplayed()) {
            if (await (await wsFirstStartScreen.NO).isDisplayed()) {
                await wsFirstStartScreen.NO.click();
                await driver.pause(1000);
            }
        }
        if (await (await wsFirstStartScreen.rakuten_pop_up_actions_layout).isDisplayed()) {
            if (await (await wsFirstStartScreen.NO).isDisplayed()) {
                await wsFirstStartScreen.NO.click();
                await driver.pause(1000);
            }
        }
        if (await (await wsFirstStartScreen.close_message).isDisplayed()) {
            await wsFirstStartScreen.close_message.click();
            await driver.pause(1000);
        }
    }

    async function handleChromeAction() {
        let currentPackage = await driver.getCurrentPackage();
        console.log("currentPackage: " + currentPackage);
        if (currentPackage !== config.CHROME_APP_ID) {
            console.log("chrome app is not showing");
            return;
        }
        if (await (await wsLoginScreen.loginContinueButton).isDisplayed()) {
            console.log("login page is displayed");
            return;
        }

        await cFirststartScreen.waitForIsShown();
        if (await (await cFirststartScreen.acceptContinueButton).isDisplayed()) {
            await (await cFirststartScreen.acceptContinueButton).click();
            await (await cFirststartScreen.noThanksButton).click();
            await driver.pause(10000);
        }
    }

    async function openRewardScreen() {
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        if (! await wsHomeScreen.Rakuten.isDisplayed()) {
            console.log("rakuten is not displayed");
            return false;
        }
        await wsHomeScreen.Rakuten.click();
        await driver.pause(1000);
        if (await wsHomeScreen.Rakuten_Reward.isDisplayed()) {
            await wsHomeScreen.Rakuten_Reward.click();
        }

        // await driver.pause(2000);

        // let ad_wrapImageList = await wsHomeScreen.ad_wrapImageList();
        // console.log("ad_wrapImageList: ", ad_wrapImageList?.length);

        // if (ad_wrapImageList && ad_wrapImageList.length > 0) {
        //     for (let index = 0; index < config.RAKUTEN_WEBSEARCH_CLICK_COUPOUN_COUNT; index++) {
        //         const adElement = await wsHomeScreen.ad_wrapImageIndex(index);
        //         if (!adElement) {
        //             continue;
        //         }
        //         await adElement.click();
        //         await driver.pause(2000);
        //         if (await wsHomeScreen.Close.isDisplayed()) {
        //             await wsHomeScreen.Close.click();
        //         }
        //         await driver.pause(2000);
        //     }
        // }

        await driver.pause(2000);
        if (await wsHomeScreen.Close_Portal.isDisplayed()) {
            await wsHomeScreen.Close_Portal.click();
        }
    }

    async function openPointGetCornerScreen() {
        await driver.pause(2000);
        if (! await wsHomeScreen.Rakuten.isDisplayed()) {
            console.log("rakuten is not displayed");
            return false;
        }
        await wsHomeScreen.Rakuten.click();
        await driver.pause(1000);
        if (await wsHomeScreen.Point_Get_Corner.isDisplayed()) {
            await wsHomeScreen.Point_Get_Corner.click();
        }
    }

    async function openWebsearchHomeScreen() {
        await driver.pause(2000);
        if (! await wsHomeScreen.Rakuten.isDisplayed()) {
            console.log("rakuten is not displayed");
            return false;
        }
        await wsHomeScreen.Rakuten.click();
        await driver.pause(1000);
        if (await wsHomeScreen.Rakuten_Web_Search_Home.isDisplayed()) {
            await wsHomeScreen.Rakuten_Web_Search_Home.click();
        }
    }

    async function claimPoint() {
        await driver.pause(2000);
        if (! await wsHomeScreen.Rakuten.isDisplayed()) {
            console.log("rakuten is not displayed");
            return false;
        }
        await wsHomeScreen.Rakuten.click();
        await driver.pause(1000);
        if (await wsHomeScreen.Rakuten_Reward.isDisplayed()) {
            await wsHomeScreen.Rakuten_Reward.click();
        }
        await (await wsHomeScreen.Unclaimed_Points).click();
        await driver.pause(2000);
        if (await wsHomeScreen.rakutenreward_claimbutton.isDisplayed()) {
            await wsHomeScreen.rakutenreward_claimbutton.click();
            await driver.pause(2000);

            await handleClaimPoint();
        }
        await driver.back();

        await driver.pause(2000);
        if (await wsHomeScreen.Close_Portal.isDisplayed()) {
            await wsHomeScreen.Close_Portal.click();
        }
    }

    async function handleClaimPoint() {
        await driver.pause(2000);
        let modalClaimIsDisplayed = await wsFirstStartScreen.modalClaim.isDisplayed()
        if (modalClaimIsDisplayed) {
            await wsFirstStartScreen.pointLogoClaimButton.click();
            await wsFirstStartScreen.waitForGetPointDoneLabelIsShown();
            await driver.back();
            return true;
        }
        return false;
    }

    it('ws_login', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            await handleAgreeTerm();
            await handleFirstTimeLogin();
            await handleCloseFirstPopup();
        }
    });

    it('ws_click_open_reward', async () => {
        await handleCloseFirstPopup();
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < config.RAKUTEN_POINT_CLUB_OPEN_REWARD_COUNT; index++) {
            await openRewardScreen();
        }
        await claimPoint();
    });

    it('ws_click_point_get_corner', async () => {
        await handleCloseFirstPopup();
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < config.RAKUTEN_WEBSEARCH_CLICK_POINT_GET_CORNER; index++) {
            await openPointGetCornerScreen();
        }
        await claimPoint();
    });

    it('ws_click_websearch_home', async () => {
        await handleCloseFirstPopup();
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < config.RAKUTEN_WEBSEARCH_CLICK_WEBSEARCH_HOME; index++) {
            await openWebsearchHomeScreen();
        }
        await claimPoint();
    });
});


