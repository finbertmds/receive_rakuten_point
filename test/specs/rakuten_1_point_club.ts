import config from '../../config';
import Gestures from '../helpers/Gestures';
import { CONTEXT_REF } from "../helpers/WebView";
import pcFirststartScreen from "../screenobjects/pointclub/pc.firststart.screen";
import pcHomeScreen from '../screenobjects/pointclub/pc.home.screen';
import pcLoginScreen from "../screenobjects/pointclub/pc.login.screen";
import pcRewardScreen from '../screenobjects/pointclub/pc.reward.screen';
import webviewScreen from "../screenobjects/webview.screen";

describe('rakuten_point_club', () => {

    function handleFirstTimeCloseWarning () {
        pcFirststartScreen.waitForIsShown();
        pcFirststartScreen.waitForWarningLablelIsShown();
        let isDiplayedWarning = pcFirststartScreen.warningLabel.isDisplayed()
        if (isDiplayedWarning) {
            pcFirststartScreen.neverDisplayCheckbox.click()
            pcFirststartScreen.closeLabel.click()
        }
    }

    function handleFirstTimeLogin () {
        webviewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        let loginButtonWebView = $('//*[contains(text(),"ログイン")]')
        if (loginButtonWebView.isExisting()) {
            loginButtonWebView.click();
        }
        webviewScreen.switchToContext(CONTEXT_REF.NATIVE);
        pcLoginScreen.waitForIsShown();
        pcLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        pcLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        pcLoginScreen.loginButton.click();
        pcLoginScreen.waitForLoggedIn();
    }

    function handleFirstTimeCloseNotification () {
        // pcHomeScreen.waitForToolbarIsShown();
        let isUpdateVersion = pcHomeScreen.notificationUpdateLabel.isDisplayed()
        if (isUpdateVersion) {
            pcHomeScreen.notificationNoButon.click();
        }
        pcHomeScreen.waitForNotificationSettingLabelIsShown();
        let isDiplayedNotification = pcHomeScreen.notificationSettingLabel.isDisplayed()
        if (isDiplayedNotification) {
            pcHomeScreen.notificationNoButon.click();
            // console.log(homeScreen.notificationSettingOnLabel.getText());
            pcHomeScreen.waitForOkButtonIsShown();
            pcHomeScreen.notificationOkButon.click();
        }
    }

    function checkIsLoggedIn () {
        let rakutenNameLabel = pcHomeScreen.rakutenNameLabel
        if (rakutenNameLabel.isDisplayed()) {
            // console.log(rakutenNameLabel.getText());
            return true;
        }
        return false;
    }

    function handleClickPointHistory () {
        pcHomeScreen.waitForPointHistoryIsShown();
        pcHomeScreen.pointHistoryIcon.click();
        // pcHomeScreen.waitForWebCloseButtonIsShown();
        // pcHomeScreen.webCloseButton.click();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        if (pcHomeScreen.pointHistoryIcon.isDisplayed()) {
            console.log("pointHistoryIcon still displayed");
            return;
        }
        driver.back();
        pcHomeScreen.waitForAdBannerIsShown();
    }

    function handleClickFirstAdBanner () {
        let firstAdBanner = pcHomeScreen.firstAdBanner
        if (firstAdBanner === null) {
            return;
        }
        firstAdBanner.click();
        // pcHomeScreen.waitForWebCloseTabButtonIsShown();
        // pcHomeScreen.webCloseTabButton.click();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        if (pcHomeScreen.firstAdBanner) {
            console.log("firstAdBanner still displayed");
            return;
        }
        driver.back();
        pcHomeScreen.waitForAdBannerIsShown();
    }

    function openRewardScreen (closeScreenWhenEnd: boolean = true): boolean {
        // pcHomeScreen.waitForRakutenNameLableIsShown();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        if (!pcHomeScreen.rakutenNameLabel.isDisplayed()) {
            return false;
        }
        pcHomeScreen.menuNavigationButton.click();
        // console.log("rakutenRewardNumberLabel: ", homeScreen.rakutenRewardNumberLabel?.getText());
        pcHomeScreen.waitForRakutenRewardLabelIsShown();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        pcHomeScreen.rakutenRewardLabel.click();
        
        pcRewardScreen.waitForIsShown();
        driver.pause(config.DEFAULT_TIMEOUT);
        let retryLableIsShown = pcRewardScreen.retryLabel.isDisplayed();
        let retryCount = 0;
        while (retryLableIsShown && retryCount < config.RAKUTEN_RETRY_MAX_COUNT) {
            pcRewardScreen.retryLabel.click();
            driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            retryLableIsShown = pcRewardScreen.retryLabel.isDisplayed();
            retryCount++;
        }
        if (retryCount >= config.RAKUTEN_RETRY_MAX_COUNT) {
            return false;
        }

        pcRewardScreen.waitForSuggestProductIsShown();
        let needLoginMoreTimeButton = pcRewardScreen.needLoginButton;
        if (needLoginMoreTimeButton) {
            needLoginMoreTimeButton.click();
            driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            handleLoginRequireAgain();
        }
        if (closeScreenWhenEnd) {
            pcRewardScreen.closeButton.click();
        }
        return true;
    }

    function handleLoginRequireAgain () {
        driver.pause(5000);
        if (!pcRewardScreen.requireLoginLabel.isDisplayed()) {
            return false;
        }
        Gestures.swipeUp(0.7);
        pcRewardScreen.userid.setValue(config.RAKUTEN_USERNAME);
        pcRewardScreen.password.setValue(config.RAKUTEN_PASSWORD);
        pcRewardScreen.loginButton.click();
        pcRewardScreen.waitForLoggedIn();
        console.log("logged in one again");
        return true;
    }

    function clickUnclaimButton () {
        let skipFlag = openRewardScreen(false);
        if (!skipFlag) {
            return;
        }
        
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let unclaimBox = pcRewardScreen.unclaimBox;
        if (!unclaimBox.isDisplayed()) {
            pcRewardScreen.closeButton.click();
            return;
        }
        // console.log("rewardScreen: ", unclaimBox?.getText());
        unclaimBox.click();

        pcRewardScreen.waitForUnclaimListIsShown();
        pcRewardScreen.waitForUnclaimListItemsIsShown();
        let unclaimListCount = pcRewardScreen.getUnclaimListItems?.length
        console.log("unclaimListCount: ", unclaimListCount);
        
        if (unclaimListCount) {
            for (let index = 0; index < unclaimListCount; index++) {
                if (index !== 0) {
                    pcRewardScreen.waitForUnclaimBoxIsShown();
                    unclaimBox.click();
                    pcRewardScreen.waitForUnclaimListIsShown();
                    pcRewardScreen.waitForUnclaimListItemsIsShown();
                }
                let unclaimListIndexButton = pcRewardScreen.getUnclaimListIndexButton(0);
                if (unclaimListIndexButton) {
                    console.log("unclaimText: ", pcRewardScreen.getUnclaimListIndexButton(index)?.getText());
                    unclaimListIndexButton.click();
                    let loginAgain = handleLoginRequireAgain();
                    if (loginAgain) {
                        return true;
                    }
                    pcRewardScreen.waitForGetPointDoneLabelIsShown();
                    console.log("getPointDoneLabel: ", pcRewardScreen.getPointDoneLabel?.getText());

                    pcRewardScreen.backButton.click();
                }
            }
        }
        pcRewardScreen.closeButton.click();
    }

    it('pc_first_login', () => {
        pcHomeScreen.waitForIsShown();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));

        let isLoggedIn = checkIsLoggedIn();
        if (!isLoggedIn) {
            handleFirstTimeCloseWarning();
            handleFirstTimeLogin();
            handleFirstTimeCloseNotification();
        }
    });

    it('pc_click_open_reward', () => {
        let isLoggedIn = checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < 3; index++) {
            openRewardScreen();
        }
    });

    it('pc_click_point_history', () => {
        let isLoggedIn = checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        handleClickPointHistory();
    });

    it('pc_click_first_ad_banner', () => {
        let isLoggedIn = checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        for (let index = 0; index < 5; index++) {
            handleClickFirstAdBanner();
        }
    });

    it('pc_get_point_from_reward', () => {
        let isLoggedIn = checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        clickUnclaimButton();
    });
});


