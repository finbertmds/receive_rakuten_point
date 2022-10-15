import config from '../../config';
import Gestures from '../helpers/Gestures';
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

    async function handleMaintenance () {
        return sFirststartScreen.maintenanceContainer.isDisplayed();
    }

    async function handleSkipButton () {
        await sFirststartScreen.waitForIsShown();
        if (await sFirststartScreen.skipButon.isExisting()) {
            await sFirststartScreen.skipButon.click();
        }
    }
    async function handleFirstLogin () {
        sHomeScreen.waitForLoginButtonIsShown();
        let loginButton = sHomeScreen.loginButton
        if (await loginButton.isDisplayed()) {
            await loginButton.click();
            
            await sLoginScreen.waitForIsShown();
            await sLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
            await sLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
            await sLoginScreen.loginButton.click();
            await sLoginScreen.waitForLoggedIn();
        }
    }

    async function handleCloseAlert () {
        await driver.pause(2000);
        if (! await sHomeAlertScreen.alertContainer.isExisting()) {
            return;
        }
        let message1 = await sHomeAlertScreen.alertContainerMessage.getText();
        await sHomeAlertScreen.alertContainerOkButton.click();
        await sHomeAlertScreen.waitForMessageIsChanged(message1);
        await sHomeAlertScreen.alertContainerOkButton.click();
        
        // await permission.waitForIsShown();
        await driver.pause(3000);
        await permission.allowButton.click();
        
        await sHomeAlertScreen.waitForIsShown();
        await sHomeAlertScreen.alertContainerOkButton.click();
    }

    async function handleClosePermissionRequestAlert () {
        await driver.pause(2000);
        if (! await sHomeAlertScreen.alertContainer.isExisting()) {
            return false;
        }
        let permissionRequestAlertText = await sHomeAlertScreen.alertContainerMessage.getText();
        console.log("permissionRequestAlertText: ", permissionRequestAlertText);
        await sHomeAlertScreen.alertContainerOkButton.click();
        await driver.pause(2000);

        if (await permission.settingsContainer.isExisting()) {
            await permission.settingsSwitchRadio.click();
            await driver.back();
            await driver.pause(2000);
        }
        return true;
    }

    async function handleClickPointNumber () {
        await sHomeScreen.waitForIsShown();
        await Gestures.swipeOnPercentage(
            Gestures.calculateXY({ x: 50, y: 50 }, 1),
            Gestures.calculateXY({ x: 50, y: 85 }, 1)
        );
        let pointNumberClickedIndex = 0;
        let swipeCount = config.RAKUTEN_SUPER_POINT_SCREEN_MAX_SWIPE_COUNT;
        for (let index = 0; index < swipeCount; index++) {
            let pointNumberButtonList = await sHomeScreen.pointNumberButtonList();
            if (pointNumberButtonList) {
                console.log("pointNumberButtonListCount: ", pointNumberButtonList?.length);
                for (let buttonIndex = 0; buttonIndex < pointNumberButtonList.length; buttonIndex++) {
                    const pointNumberButton = pointNumberButtonList[buttonIndex];
                    // console.log(`swipeUp ${index}: pointNumberButton ${buttonIndex}: `, await pointNumberButton.getText());
                    await pointNumberButton.click();
                    
                    let needClosePermissionRequestAlert = await handleClosePermissionRequestAlert();
                    if (needClosePermissionRequestAlert) {
                        await pointNumberButton.click();
                    }

                    await sHomeGetpointScreen.waitForIsShown();
                    await sHomeGetpointScreen.waitForDoneButtonIsShown();
                    await sHomeGetpointScreen.closeButton.click();
                    
                    pointNumberClickedIndex++;
                    console.log("pointNumberClickedIndex: ", pointNumberClickedIndex);
                }
            }
            console.log("swipeUp: ", index);
            await Gestures.swipeOnPercentage(
                Gestures.calculateXY({ x: 50, y: 85 }, 1),
                Gestures.calculateXY({ x: 50, y: 50 }, 1),
            );
        }
        console.log(`todayPointLabel: `, await sHomeScreen.todayPointLabel.getText());
    }

    async function handleClickGetPoint () {
        await sLuckycountScreen.waitForIsShown();
        await driver.pause(2000);
        let getButton = sLuckycountScreen.getButton;
        if (await getButton.isExisting()) {
            await getButton.click();
            await sLuckycountScreen.waitForGetDoneButtonIsShown();
            await sLuckycountScreen.getDoneButton.click();
        }
    }

    async function handleClickPlay () {
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
            }
        }
    }

    async function handleClickChallenge () {
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


