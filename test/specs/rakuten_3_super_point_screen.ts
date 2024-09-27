import config from '../../config';
import Gestures from '../helpers/Gestures';
import cFirststartScreen from '../screenobjects/chrome/c.firststart.screen';
import permission from '../screenobjects/components/permission';
import sFirststartScreen from '../screenobjects/superpointscreen/s.firststart.screen';
import sHomeAlertScreen from '../screenobjects/superpointscreen/s.home.alert.screen';
import sHomeGetpointScreen from '../screenobjects/superpointscreen/s.home.getpoint.screen';
import sHomeScreen from '../screenobjects/superpointscreen/s.home.screen';
import sLoginScreen from '../screenobjects/superpointscreen/s.login.screen';
import sLuckycountScreen from '../screenobjects/superpointscreen/s.luckycount.screen';
import S_TabBar from '../screenobjects/superpointscreen/s.tab.bar';

describe('rakuten_super_point_screen', async () => {
    before(async () => {
        await await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
        await await driver.pause(5000);
    })

    async function handleMaintenance() {
        return sFirststartScreen.maintenanceContainer.isDisplayed();
    }

    async function handleSkipButton() {
        await sFirststartScreen.waitForIsShown();
        if (await sFirststartScreen.skipButon.isExisting()) {
            await sFirststartScreen.skipButon.click();
        }
    }
    async function handleFirstLogin() {
        await driver.pause(5000);
        // sHomeScreen.waitForLoginButtonIsShown();
        let loginButton = sHomeScreen.loginButton
        if (!await loginButton.isDisplayed()) {
            console.log("logged in");
            return;
        }
        await loginButton.click();
        await handleChromeAction();
        await driver.pause(5000);
        // await sLoginScreen.waitForEnterLoginScreen();
        if (await (await sLoginScreen.loginContinueButton).isDisplayed()) {
            await sLoginScreen.loginContinueButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await sLoginScreen.waitForLoggedIn();
            return;
        }
        if (await (await sLoginScreen.loginWithOtherButton).isDisplayed()) {
            await sLoginScreen.loginWithOtherButton.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        }
        await sLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await driver.pause(3000);
        await sLoginScreen.nextButton.click();
        await driver.pause(3000);
        await sLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await driver.pause(3000);
        await sLoginScreen.signInButton.click();
        await driver.pause(3000);
        await sLoginScreen.waitForLoggedIn();
    }

    async function handleChromeAction() {
        let currentPackage = await driver.getCurrentPackage();
        console.log("currentPackage: " + currentPackage);
        if (currentPackage !== config.CHROME_APP_ID) {
            console.log("chrome app is not showing");
            return;
        }
        if (await (await sLoginScreen.loginContinueButton).isDisplayed()) {
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

    async function handleCloseAlert() {
        await driver.pause(2000);
        // if (! await sHomeAlertScreen.alertContainer.isExisting()) {
        //     return;
        // }
        // let message1 = await sHomeAlertScreen.alertContainerMessage.getText();
        // await sHomeAlertScreen.alertContainerOkButton.click();
        // await sHomeAlertScreen.waitForMessageIsChanged(message1);
        // await sHomeAlertScreen.alertContainerOkButton.click();

        let needAllow = false;
        if (await (await sHomeGetpointScreen.nextButton).isExisting()) {
            if (await (await sHomeGetpointScreen.nextButton).isDisplayed()) {
                await (await sHomeGetpointScreen.nextButton).click();
                await browser.pause(5000);
                needAllow = true;
            }
        }
        if (!needAllow) {
            console.log("permission is permitted");
            return;
        }
        // await permission.waitForIsShown();
        await driver.pause(3000);
        await permission.allowButton.click();
        await driver.pause(3000);
        await handleOkAlert();
        await handleOkAlert();
        // await sHomeAlertScreen.waitForIsShown();
        // await sHomeAlertScreen.alertContainerOkButton.click();
    }

    async function handleOkAlert() {
        if (await (await sHomeScreen.okButton).isExisting()) {
            if (await (await sHomeScreen.okButton).isDisplayed()) {
                await (await sHomeScreen.okButton).click();
                await driver.pause(5000);
            }
        }
    }

    async function handleDisplayOverOtherApps() {
        if (await permission.settingsContainer.isExisting()) {
            await permission.settingsSwitchRadio.click();
            await driver.back();
            await driver.pause(2000);
        }
        if (await sHomeScreen.okUnderStoodButton.isExisting()) {
            if (await (await sHomeScreen.okUnderStoodButton).isDisplayed()) {
                await (await sHomeScreen.okUnderStoodButton).click();
                await driver.pause(2000);
            }
        }
    }

    async function handleGuideSetting() {
        if (await (await sHomeScreen.cardAdImage).isDisplayed()) {
            if (await (await sHomeScreen.prMark).isDisplayed()) {
                await (await sHomeScreen.prMark).click();
                await driver.pause(5000);
            }
        }
        if (await (await sHomeScreen.goSettingButton).isExisting()) {
            if (await (await sHomeScreen.goSettingButton).isDisplayed()) {
                await (await sHomeScreen.goSettingButton).click();
                await driver.pause(5000);
            }
        }

        await handleDisplayOverOtherApps();
        await handleOkAlert();
        await handleOkAlert();
    }

    async function handleFirstGetPointAfterGuide() {
        if (await (await sHomeGetpointScreen.adCardOpenText).isExisting()) {
            if (await (await sHomeGetpointScreen.adCardOpenText).isDisplayed()) {
                await Gestures.swipeRight();

                await sHomeGetpointScreen.waitForDoneButtonIsShown();
                await driver.back();
                await browser.pause(5000);
            }
        }
    }

    async function handleClickPointNumber() {
        await driver.pause(5000);
        // await sHomeScreen.waitForIsShown();
        await Gestures.swipeOnPercentage(
            Gestures.calculateXY({ x: 50, y: 50 }, 1),
            Gestures.calculateXY({ x: 50, y: 85 }, 1)
        );
        let pointNumberClickedIndex = 0;
        let swipeCount = config.RAKUTEN_SUPER_POINT_SCREEN_MAX_SWIPE_COUNT;
        for (let index = 0; index < swipeCount; index++) {
            let pointNumberButtonList = await sHomeScreen.pointNumberButtonList();
            if (pointNumberButtonList.length > 0) {
                console.log("pointNumberButtonListCount: ", pointNumberButtonList?.length);
                for (let buttonIndex = 0; buttonIndex < pointNumberButtonList.length; buttonIndex++) {
                    const pointNumberButton = pointNumberButtonList[buttonIndex];
                    console.log(`swipeUp ${index}: pointNumberButton: ${buttonIndex}`);
                    await pointNumberButton.click();

                    // await sHomeGetpointScreen.waitForIsShown();
                    await browser.pause(5000);
                    if (!S_TabBar.bottomIconIsDisplayed()) {
                        await sHomeGetpointScreen.waitForDoneButtonIsShown();
                        // await sHomeGetpointScreen.closeButton.click();
                        await driver.back();
                        await browser.pause(5000);

                        await handleCloseAlert();

                        pointNumberClickedIndex++;
                        console.log("pointNumberClickedIndex: ", pointNumberClickedIndex);
                    }
                }
            }
            console.log("swipeUp: ", index);
            await Gestures.swipeOnPercentage(
                Gestures.calculateXY({ x: 50, y: 85 }, 1),
                Gestures.calculateXY({ x: 50, y: 50 }, 1),
            );
            await driver.pause(3000);
        }
    }

    async function handleClickGetPoint() {
        // await sLuckycountScreen.waitForIsShown();
        await driver.pause(2000);
        let getButton = sLuckycountScreen.getButton;
        if (await getButton.isExisting()) {
            await getButton.click();
            await sLuckycountScreen.waitForGetDoneButtonIsShown();
            await sLuckycountScreen.getDoneButton.click();
        }
    }

    async function handleClickPlay() {
        await driver.pause(2000);
        let playButton = sLuckycountScreen.playButton;
        if (await playButton.isExisting()) {
            await playButton.click();
            await sLuckycountScreen.waitForChallengePlayButtonIsShown();
            await sLuckycountScreen.waitForPlayIconIsShown();
            await sLuckycountScreen.challengePlayButton.click();
            await driver.pause(config.DEFAULT_TIMEOUT > 45000 ? 1.5 * config.DEFAULT_TIMEOUT : 45000);
            await driver.back();
            // await sLuckycountScreen.waitForGetDoneButtonIsShown();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            if (await sLuckycountScreen.getDoneButton.isDisplayed()) {
                await sLuckycountScreen.getDoneButton.click();
                await driver.pause(2000);
            }
        }
        await driver.back();
        await driver.pause(2000);
    }

    async function handleClickChallenge() {
        await driver.pause(2000);
        let challengeButton = sLuckycountScreen.challengeButton
        if (await challengeButton.isExisting()) {
            await challengeButton.click();
            await sLuckycountScreen.waitForChallengePlayButtonIsShown();
            await sLuckycountScreen.challengePlayButton.click();

            await sLuckycountScreen.waitForChallengeCardIsShown();
            await sLuckycountScreen.challengeCard.click();

            await sLuckycountScreen.waitForChallengePlayButtonIsShown();

            await handleClickPlay();
        }
    }

    it('sps_click_point_number', async () => {
        await driver.pause(7000);
        if (await handleMaintenance()) {
            return;
        }
        await handleSkipButton();
        await handleFirstLogin();
        await handleGuideSetting();
        await handleFirstGetPointAfterGuide();
        await handleCloseAlert();
        await handleClickPointNumber();
    });

    it('sps_get_point_and_challenge', async () => {
        if (await handleMaintenance()) {
            return;
        }
        await handleCloseAlert();
        await S_TabBar.openLuckyCoint();
        await handleClickGetPoint();
        await handleClickChallenge();
        await handleClickPlay();
    });

});


