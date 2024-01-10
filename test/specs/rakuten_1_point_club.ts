import config from '../../config';
import Gestures from '../helpers/Gestures';
import cFirststartScreen from '../screenobjects/chrome/c.firststart.screen';
import pcFirststartScreen from "../screenobjects/pointclub/pc.firststart.screen";
import pcHomeScreen from '../screenobjects/pointclub/pc.home.screen';
import pcLoginScreen from "../screenobjects/pointclub/pc.login.screen";
import pcRewardScreen from '../screenobjects/pointclub/pc.reward.screen';

describe('rakuten_point_club', async () => {
    before(async () => {
        await driver.activateApp(config.RAKUTEN_POINT_CLUB_APP_ID);
        await driver.pause(5000);
    })

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
        // await webviewScreen.switchToContext(config.RAKUTEN_POINT_CLUB_WEBVIEW_CONTEXT);
        // let loginButtonWebView = $('//*[contains(text(),"ログイン")]')
        // if (await loginButtonWebView.isExisting()) {
        //     await loginButtonWebView.click();
        // }
        // await webviewScreen.switchToContext(CONTEXT_REF.NATIVE);
        await pcLoginScreen.waitForIsShown();
        await pcLoginScreen.enterLoginButton.click();
        await driver.pause(5000);

        if (! await pcLoginScreen.loginScreen.isExisting()) {
            await handleChromeAction();
            // return app and click enter login button again
            await pcLoginScreen.enterLoginButton.click();
            await driver.pause(5000);
        }
        if (await (await pcLoginScreen.loginContinueButton).isDisplayed()) {
            await pcLoginScreen.loginContinueButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await pcLoginScreen.waitForLoggedIn();
            return;
        }
        if (await (await pcLoginScreen.loginWithOtherButton).isDisplayed()) {
            await pcLoginScreen.loginWithOtherButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        }
        await pcLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await driver.pause(3000);
        await pcLoginScreen.nextButton.click();
        await driver.pause(3000);
        await pcLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await driver.pause(3000);
        await pcLoginScreen.nextButton.click();
        await driver.pause(3000);
        await pcLoginScreen.waitForLoggedIn();
    }

    async function handleChromeAction() {
        await driver.activateApp(config.CHROME_APP_ID);
        await driver.pause(5000);

        await cFirststartScreen.waitForIsShown();
        if (await (await cFirststartScreen.acceptContinueButton).isDisplayed()) {
            await (await cFirststartScreen.acceptContinueButton).click();
            await (await cFirststartScreen.noThanksButton).click();
            await driver.pause(5000);
        }

        await driver.activateApp(config.RAKUTEN_POINT_CLUB_APP_ID);
        await driver.pause(5000);
    }

    async function handleFirstTimeCloseNotification () {
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let isUpdateVersion = await pcHomeScreen.notificationUpdateLabel.isDisplayed()
        if (isUpdateVersion) {
            await pcHomeScreen.notificationNoButon.click();
        }
        // await pcHomeScreen.waitForNotificationSettingLabelIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let isDiplayedNotification = await pcHomeScreen.notificationSettingLabel.isDisplayed()
        if (isDiplayedNotification) {
            await pcHomeScreen.notificationNoButon.click();
        }
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let isDiplayedCustomPanel = await pcHomeScreen.customPanel.isDisplayed()
        if (isDiplayedCustomPanel) {
            await pcHomeScreen.closeCustomPanelButon.click();
        }
    }

    async function checkIsLoggedIn () {
        let rakutenNameLabel = pcHomeScreen.rakutenNameLabel
        if (await rakutenNameLabel.isDisplayed()) {
            return true;
        }
        let isDiplayedCustomPanel = await pcHomeScreen.customPanel.isDisplayed()
        if (isDiplayedCustomPanel) {
            await handleFirstTimeCloseNotification();
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
    }

    async function handleClickFirstAdBanner () {
        // await pcHomeScreen.waitForAdBannerIsShown();
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

        // await pcRewardScreen.waitForSuggestProductIsShown();
        await driver.pause(config.DEFAULT_TIMEOUT);
        let needLoginMoreTimeButton = await pcRewardScreen.needLoginButton();
        if (needLoginMoreTimeButton) {
            await needLoginMoreTimeButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            await handleLoginRequireAgain();
        }
        if (closeScreenWhenEnd) {
            await pcRewardScreen.closeButton.click();
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

    /**
     * click unclaim button
     * @returns true: success, false: cannot click unclaim button need retry
     */
    async function clickUnclaimButton () {
        let skipFlag = await openRewardScreen(false);
        if (!skipFlag) {
            return false;
        }
        
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let unclaimBox = pcRewardScreen.unclaimBox;
        if (! await unclaimBox.isDisplayed()) {
            await pcRewardScreen.closeButton.click();
            return true;
        }
        // console.log("rewardScreen: ", unclaimBox?.getText());
        await unclaimBox.click();

        // await pcRewardScreen.waitForUnclaimListIsShown();
        let unclaimErrorMessageLabel = pcRewardScreen.unclaimErrorMessageLabel;
        if (await unclaimErrorMessageLabel.isDisplayed()) {
            await pcRewardScreen.closeButton.click();
            return false;
        }
        await pcRewardScreen.waitForUnclaimListItemsIsShown();
        let unclaimListCount = (await pcRewardScreen.getUnclaimListItems())?.length
        console.log("unclaimListCount: ", unclaimListCount);
        
        if (unclaimListCount) {
            for (let index = 0; index < unclaimListCount; index++) {
                if (index !== 0) {
                    await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
                    // await pcRewardScreen.waitForUnclaimListIsShown();
                    let unclaimErrorMessageLabel = pcRewardScreen.unclaimErrorMessageLabel;
                    if (await unclaimErrorMessageLabel.isDisplayed()) {
                        await pcRewardScreen.closeButton.click();
                        return false;
                    }
                    await pcRewardScreen.waitForUnclaimListItemsIsShown();
                }
                let unclaimListIndexButton = await pcRewardScreen.getUnclaimListIndexButton(0);
                if (unclaimListIndexButton) {
                    // console.log("unclaimText: ", await (await pcRewardScreen.getUnclaimListIndexButton(0))?.getText());
                    await unclaimListIndexButton.click();
                    let loginAgain = await handleLoginRequireAgain();
                    if (loginAgain) {
                        return true;
                    }
                    await pcRewardScreen.waitForGetPointDoneLabelIsShown();
                    // console.log("getPointDoneLabel: ", await (await pcRewardScreen.getPointDoneLabel)?.getText());

                    await driver.back();
                }
            }
        }
        await pcRewardScreen.closeButton.click();
        return true;
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
        await driver.pause(5000);
        await Gestures.swipeUp(0.7);
        await handleClickPointHistory();
        await driver.pause(5000);
        await Gestures.swipeDown();
    });

    it('pc_click_first_ad_banner', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        var scrollCount = 0
        while (scrollCount < 3) {
            if (await pcHomeScreen.adBannerGroup.isDisplayed()) {
                break;
            }
            await Gestures.swipeUp(0.7);
            scrollCount++;
        }
        for (let index = 0; index < 5; index++) {
            await handleClickFirstAdBanner();
        }
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        for (let index = 0; index < scrollCount; index++) {
            await Gestures.swipeDown();
        }
    });

    it('pc_get_point_from_reward', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        let result = false;
        let retryCount = 0;
        while (!result && retryCount < config.RAKUTEN_RETRY_MAX_COUNT) {
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            result = await clickUnclaimButton();
            retryCount++;
        }
    });
});


