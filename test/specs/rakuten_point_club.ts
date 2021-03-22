import config from '../../config';
import { CONTEXT_REF } from "../helpers/WebView";
import pcFirststartScreen from "../screenobjects/pointclub/pc.firststart.screen";
import pcHomeScreen from '../screenobjects/pointclub/pc.home.screen';
import pcLoginScreen from "../screenobjects/pointclub/pc.login.screen";
import pcRewardScreen from '../screenobjects/pointclub/pc.reward.screen';
import webviewScreen from "../screenobjects/webview.screen";

describe('rakuten_point_club', () => {
    afterAll(() => {
        driver.terminateApp(config.RAKUTEN_POINT_CLUB_APP_ID);
        driver.pause(5000)
    })

    function handleFirstTimeCloseWarning () {
        pcFirststartScreen.waitForIsShown();
        driver.pause(5000)
        let isDiplayedWarning = pcFirststartScreen.warningLabel.isDisplayed()
        if (isDiplayedWarning) {
            pcFirststartScreen.neverDisplayCheckbox.click()
            driver.pause(2000)
            pcFirststartScreen.closeLabel.click()
        }
        driver.pause(3000)
    }

    function handleFirstTimeLogin () {
        webviewScreen.switchToContext(CONTEXT_REF.WEBVIEW);
        let loginButtonWebView = $('//*[contains(text(),"ログイン")]')
        if (loginButtonWebView.isExisting()) {
            loginButtonWebView.click();
            driver.pause(2000)
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
        driver.pause(2000)
        let isDiplayedNotification = pcHomeScreen.notificationSettingLabel.isDisplayed()
        if (isDiplayedNotification) {
            pcHomeScreen.notificationYesButon.click();
            driver.pause(3000)
            // console.log(homeScreen.notificationSettingOnLabel.getText());
            pcHomeScreen.notificationOkButon.click();
            driver.pause(3000)
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
        driver.pause(2000)
        pcHomeScreen.waitForWebCloseButtonIsShown();
        driver.pause(6000)
        pcHomeScreen.webCloseButton.click();
        pcHomeScreen.waitForAdBannerIsShown();
    }

    function handleClickFirstAdBanner () {
        pcHomeScreen.firstAdBanner?.click();
        driver.pause(2000)
        pcHomeScreen.waitForWebCloseTabButtonIsShown();
        driver.pause(3000)
        pcHomeScreen.webCloseTabButton.click();
        pcHomeScreen.waitForAdBannerIsShown();
    }

    function openRewardScreen (closeScreenWhenEnd: boolean = true) {
        driver.pause(2000);
        pcHomeScreen.menuNavigationButton.click();
        driver.pause(2000);
        // console.log("rakutenRewardNumberLabel: ", homeScreen.rakutenRewardNumberLabel?.getText());
        pcHomeScreen.rakutenRewardLabel.click();
        
        pcRewardScreen.waitForIsShown();
        pcRewardScreen.waitForSuggestProductIsShown();
        if (closeScreenWhenEnd) {
            pcRewardScreen.closeButton.click();
        }
    }

    function clickUnclaimButton () {
        openRewardScreen(false);
        
        driver.pause(2000)
        let unclaimBox = pcRewardScreen.unclaimBox;
        if (unclaimBox.isDisplayed()) {
            // console.log("rewardScreen: ", unclaimBox?.getText());
            unclaimBox.click();

            pcRewardScreen.waitForUnclaimListIsShown();
            let unclaimListCount = pcRewardScreen.getUnclaimListItems?.length
            console.log("unclaimListCount: ", unclaimListCount);
            
            if (unclaimListCount) {
                for (let index = 0; index < unclaimListCount; index++) {
                    // pcRewardScreen.waitForUnclaimBoxIsShown();
                    let unclaimListIndexButton = pcRewardScreen.getUnclaimListIndexButton(0);
                    if (unclaimListIndexButton) {
                        // console.log("unclaimText: ", pcRewardScreen.getUnclaimListIndexButton(index)?.getText());
                        unclaimListIndexButton.click();
                        
                        pcRewardScreen.waitForGetPointDoneLabelIsShown();
                        driver.pause(7000);
                        // console.log("getPointDoneLabel: ", pcRewardScreen.getPointDoneLabel?.getText());

                        pcRewardScreen.backButton.click();
                        driver.pause(3000);
                    }
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
        driver.pause(2000)
    });

    it('pc_click_point_history', () => {
        handleClickPointHistory();
        driver.pause(2000)
    });

    it('pc_click_first_ad_banner', () => {
        handleClickFirstAdBanner();
        driver.pause(2000);
    });

    it('pc_get_point_from_reward', () => {
        for (let index = 0; index < 2; index++) {
            openRewardScreen();
        }
        clickUnclaimButton();
        driver.pause(2000)
    });
});


