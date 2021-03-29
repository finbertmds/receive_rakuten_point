import config from "../../config";
import kFirststartScreen from "../screenobjects/kuji/k.firststart.screen";
import kHomeScreen from "../screenobjects/kuji/k.home.screen";
import kLoginScreen from "../screenobjects/kuji/k.login.screen";
import kLuckykujiScreen from "../screenobjects/kuji/k.luckykuji.screen";
import kMessageboxScreen from "../screenobjects/kuji/k.messagebox.screen";

describe('rakuten_kuji', () => {
    beforeAll(() => {
        driver.activateApp(config.RAKUTEN_KUJI_APP_ID);
        driver.pause(5000);
    })

    function handleFirstTimeEnterApp () {
        if (!kFirststartScreen.warningLabel.isDisplayed()) {
            return;
        }
        kFirststartScreen.closeLabel.click();
        handleFirstTimeLogin();
    }

    function handleFirstTimeLogin () {
        kLoginScreen.waitForIsShown();
        kLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        kLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        kLoginScreen.loginButton.click();
        kLoginScreen.waitForLoggedIn();
    }

    function handleClickMainLayoutKuji () {
        kHomeScreen.waitForMainLayoutIsShown();
        let kujiList = kHomeScreen.mainLayoutKujiList;
        console.log("kujiCount: ", kujiList?.length);
        
        if (kujiList && kujiList.length > 0) {
            for (let index = 0; index < kujiList.length; index++) {
                handleLuckyKuji();
                const kujiElement = kHomeScreen.mainLayoutKujiIndex(index);
                if (!kujiElement) {
                    continue;
                }
                kujiElement.click();
                driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
                if (!kHomeScreen.playMovieIcon.isDisplayed()) {
                    driver.pause(config.DEFAULT_TIMEOUT);
                    if (kFirststartScreen.noButton.isDisplayed()) {
                        kFirststartScreen.noButton.click();
                        driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
                    }
                    driver.back();
                    driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
                    driver.back();
                }
            }
        }
    }

    function handleClickAd () {
        kHomeScreen.waitForPlayMoviewIconIsShown();
        kHomeScreen.playMovieIcon.click();
        driver.pause(5000);
        if (!kHomeScreen.playMovieIcon.isDisplayed()) {
            driver.pause(config.DEFAULT_TIMEOUT > 45000 ? config.DEFAULT_TIMEOUT : 45000);
            driver.back();
        }
    }

    function handleClickMessage () {
        let unreadMessageCount = kHomeScreen.unreadMessageCount.getText();
        if (!unreadMessageCount) {
            return;
        }
        kHomeScreen.messageLabel.click();
        kMessageboxScreen.waitForIsShown();
        kMessageboxScreen.waitForMessageIsShown();
        let messageList = kMessageboxScreen.messageThumbnailList;
        for (let index = 0; index < messageList.length; index++) {
            const messageElement = messageList[index];
            messageElement.click();
            driver.pause(5000);
            driver.back();
        }
        driver.back();
    }

    function handleLuckyKuji () {
        driver.pause(5000);
        if (kLuckykujiScreen.announcement.isDisplayed()) {
            kLuckykujiScreen.okButton.click();
        }
    }

    it('k_click_mainlayout_kuji', () => {
        driver.pause(7000);

        handleFirstTimeEnterApp();
        handleLuckyKuji();
        handleClickMainLayoutKuji();
    });

    it('k_click_message', () => {
        handleLuckyKuji();
        handleClickMessage();
    });

    it('k_click_ad', () => {
        handleLuckyKuji();
        handleClickAd();
    });
});


