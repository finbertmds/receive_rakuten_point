import config from '../../config';
import Gestures from '../helpers/Gestures';
import { CONTEXT_REF } from "../helpers/WebView";
import pcFirststartScreen from "../screenobjects/pointclub/pc.firststart.screen";
import pcHomeScreen from '../screenobjects/pointclub/pc.home.screen';
import pcLoginScreen from "../screenobjects/pointclub/pc.login.screen";
import pcRewardScreen from '../screenobjects/pointclub/pc.reward.screen';
import webviewScreen from "../screenobjects/WebviewScreen";

describe('rakuten_point_club', async () => {

    async function handleFirstTimeCloseWarning () {
        await pcFirststartScreen.waitForIsShown();
        await pcFirststartScreen.waitForWarningLablelIsShown();
        let isDiplayedWarning = await pcFirststartScreen.warningLabel.isDisplayed()
        if (isDiplayedWarning) {
            await pcFirststartScreen.neverDisplayCheckbox.click()
            await pcFirststartScreen.closeLabel.click()
        }
    }

    async function handleFirstTimeLogin () {
        await webviewScreen.switchToContext(config.RAKUTEN_POINT_CLUB_WEBVIEW_CONTEXT);
        let loginButtonWebView = $('//*[contains(text(),"ログイン")]')
        if (await loginButtonWebView.isExisting()) {
            await loginButtonWebView.click();
        }
        await webviewScreen.switchToContext(CONTEXT_REF.NATIVE);
        await pcLoginScreen.waitForIsShown();
        await pcLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await pcLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await pcLoginScreen.loginButton.click();
        await pcLoginScreen.waitForLoggedIn();
    }

    async function handleFirstTimeCloseNotification () {
        // await pcHomeScreen.waitForToolbarIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let isUpdateVersion = await pcHomeScreen.notificationUpdateLabel.isDisplayed()
        if (isUpdateVersion) {
            await pcHomeScreen.notificationNoButon.click();
        }
        await pcHomeScreen.waitForNotificationSettingLabelIsShown();
        let isDiplayedNotification = await pcHomeScreen.notificationSettingLabel.isDisplayed()
        if (isDiplayedNotification) {
            await pcHomeScreen.notificationNoButon.click();
            // console.log(homeScreen.notificationSettingOnLabel.getText());
            await pcHomeScreen.waitForOkButtonIsShown();
            await pcHomeScreen.notificationOkButon.click();
        }
    }

    async function checkIsLoggedIn () {
        let rakutenNameLabel = pcHomeScreen.rakutenNameLabel
        if (await rakutenNameLabel.isDisplayed()) {
            // console.log(rakutenNameLabel.getText());
            return true;
        }
        return false;
    }

    async function handleClickPointHistory () {
        await pcHomeScreen.waitForPointHistoryIsShown();
        await pcHomeScreen.pointHistoryIcon.click();
        // await pcHomeScreen.waitForWebCloseButtonIsShown();
        // await pcHomeScreen.webCloseButton.click();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        if (await pcHomeScreen.pointHistoryIcon.isDisplayed()) {
            console.log("pointHistoryIcon still displayed");
            return;
        }
        await driver.back();
        await pcHomeScreen.waitForAdBannerIsShown();
    }

    async function handleClickFirstAdBanner () {
        let firstAdBanner = await pcHomeScreen.firstAdBanner()
        if (firstAdBanner === null) {
            return;
        }
        await firstAdBanner.click();
        // await pcHomeScreen.waitForWebCloseTabButtonIsShown();
        // await pcHomeScreen.webCloseTabButton.click();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        firstAdBanner = await pcHomeScreen.firstAdBanner()
        if (firstAdBanner != null) {
            console.log("firstAdBanner still displayed");
            return;
        }
        await driver.back();
        await pcHomeScreen.waitForAdBannerIsShown();
    }

    async function openRewardScreen (closeScreenWhenEnd: boolean = true) {
        // await pcHomeScreen.waitForRakutenNameLableIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        if (! await pcHomeScreen.rakutenNameLabel.isDisplayed()) {
            return false;
        }
        await pcHomeScreen.menuNavigationButton.click();
        // console.log("rakutenRewardNumberLabel: ", await homeScreen.rakutenRewardNumberLabel?.getText());
        await pcHomeScreen.waitForRakutenRewardLabelIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        await pcHomeScreen.rakutenRewardLabel.click();
        
        await pcRewardScreen.waitForIsShown();
        await driver.pause(config.DEFAULT_TIMEOUT);
        let retryLableIsShown = await pcRewardScreen.retryLabel.isDisplayed();
        let retryCount = 0;
        while (retryLableIsShown && retryCount < config.RAKUTEN_RETRY_MAX_COUNT) {
            await pcRewardScreen.retryLabel.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            retryLableIsShown = await pcRewardScreen.retryLabel.isDisplayed();
            retryCount++;
        }
        if (retryCount >= config.RAKUTEN_RETRY_MAX_COUNT) {
            return false;
        }

        await pcRewardScreen.waitForSuggestProductIsShown();
        let needLoginMoreTimeButton = await pcRewardScreen.needLoginButton();
        if (needLoginMoreTimeButton) {
            await needLoginMoreTimeButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            await handleLoginRequireAgain();
        }
        if (closeScreenWhenEnd) {
            // @ts-ignore
            await (await pcRewardScreen.closeButton()).click();
        }
        return true;
    }

    async function handleLoginRequireAgain () {
        await driver.pause(5000);
        if (! await pcRewardScreen.requireLoginLabel.isDisplayed()) {
            return false;
        }
        await Gestures.swipeUp(0.7);
        await pcRewardScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await pcRewardScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await pcRewardScreen.loginButton.click();
        await pcRewardScreen.waitForLoggedIn();
        console.log("logged in one again");
        return true;
    }

    async function clickUnclaimButton () {
        let skipFlag = await openRewardScreen(false);
        if (!skipFlag) {
            return;
        }
        
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let unclaimBox = pcRewardScreen.unclaimBox;
        if (! await unclaimBox.isDisplayed()) {
            // @ts-ignore
            await (await pcRewardScreen.closeButton()).click();
            return;
        }
        // console.log("rewardScreen: ", unclaimBox?.getText());
        await unclaimBox.click();

        await pcRewardScreen.waitForUnclaimListIsShown();
        await pcRewardScreen.waitForUnclaimListItemsIsShown();
        let unclaimListCount = (await pcRewardScreen.getUnclaimListItems())?.length
        console.log("unclaimListCount: ", unclaimListCount);
        
        if (unclaimListCount) {
            for (let index = 0; index < unclaimListCount; index++) {
                if (index !== 0) {
                    await pcRewardScreen.waitForUnclaimBoxIsShown();
                    await unclaimBox.click();
                    await pcRewardScreen.waitForUnclaimListIsShown();
                    await pcRewardScreen.waitForUnclaimListItemsIsShown();
                }
                let unclaimListIndexButton = await pcRewardScreen.getUnclaimListIndexButton(0);
                if (unclaimListIndexButton) {
                    console.log("unclaimText: ", await (await pcRewardScreen.getUnclaimListIndexButton(index))?.getText());
                    await unclaimListIndexButton.click();
                    let loginAgain = await handleLoginRequireAgain();
                    if (loginAgain) {
                        return true;
                    }
                    await pcRewardScreen.waitForGetPointDoneLabelIsShown();
                    console.log("getPointDoneLabel: ", (await pcRewardScreen.getPointDoneLabel)?.getText());

                    // @ts-ignore
                    await (await pcRewardScreen.backButton()).click();
                }
            }
        }
        // @ts-ignore
        await (await pcRewardScreen.closeButton()).click();
    }

    it('pc_first_login', async () => {
        await pcHomeScreen.waitForIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));

        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            await handleFirstTimeCloseWarning();
            await handleFirstTimeLogin();
            await handleFirstTimeCloseNotification();
        }
    });

    it('pc_click_open_reward', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < 3; index++) {
            await openRewardScreen();
        }
    });

    it('pc_click_point_history', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        await handleClickPointHistory();
    });

    it('pc_click_first_ad_banner', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < 5; index++) {
            await handleClickFirstAdBanner();
        }
    });

    it('pc_get_point_from_reward', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        await clickUnclaimButton();
    });
});


