import config from '../../config';
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
        pcHomeScreen.waitForNotificationSettingLabelIsShown();
        let isDiplayedNotification = pcHomeScreen.notificationSettingLabel.isDisplayed()
        if (isDiplayedNotification) {
            pcHomeScreen.notificationYesButon.click();
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
        driver.pause(10000);
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
        driver.pause(10000);
        driver.back();
        pcHomeScreen.waitForAdBannerIsShown();
    }

    function openRewardScreen (closeScreenWhenEnd: boolean = true) {
        pcHomeScreen.waitForRakutenNameLableIsShown();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        pcHomeScreen.menuNavigationButton.click();
        // console.log("rakutenRewardNumberLabel: ", homeScreen.rakutenRewardNumberLabel?.getText());
        pcHomeScreen.waitForRakutenRewardLabelIsShown();
        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        pcHomeScreen.rakutenRewardLabel.click();
        
        pcRewardScreen.waitForIsShown();
        pcRewardScreen.waitForSuggestProductIsShown();
        if (closeScreenWhenEnd) {
            pcRewardScreen.closeButton.click();
        }
    }

    function clickUnclaimButton () {
        openRewardScreen(false);
        
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
        driver.pause(7000);

        let isLoggedIn = checkIsLoggedIn();
        if (!isLoggedIn) {
            handleFirstTimeCloseWarning();
            handleFirstTimeLogin();
            handleFirstTimeCloseNotification();
        }
    });

    it('pc_click_point_history', () => {
        let currentDate = new Date().getDay();
        if (currentDate !== 2) {
            console.log(`today donot run pc_click_point_history`);
            return;
        }
        handleClickPointHistory();
    });

    it('pc_click_first_ad_banner', () => {
        let currentDate = new Date().getDay();
        if (currentDate !== 2) {
            console.log(`today donot run pc_click_first_ad_banner`);
            return;
        }
        for (let index = 0; index < 3; index++) {
            handleClickFirstAdBanner();
        }
    });

    it('pc_get_point_from_reward', () => {
        for (let index = 0; index < 2; index++) {
            openRewardScreen();
        }
        clickUnclaimButton();
    });
});


