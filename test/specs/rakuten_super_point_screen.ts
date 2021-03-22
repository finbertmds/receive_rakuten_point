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

describe('rakuten_super_point_screen', () => {
    beforeAll(() => {
        driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
        driver.pause(5000);
    })

    afterAll(() => {
        driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    })

    function handleSkipButton () {
        sFirststartScreen.waitForIsShown();
        driver.pause(2000);
        if (sFirststartScreen.skipButon.isExisting()) {
            sFirststartScreen.skipButon.click();
        }
    }
    function handleFirstLogin () {
        // sHomeScreen.waitForIsShown();
        driver.pause(2000);
        let loginButton = sHomeScreen.loginButton
        if (loginButton.isDisplayed()) {
            loginButton.click();
            
            sLoginScreen.waitForIsShown();
            sLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
            sLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
            sLoginScreen.loginButton.click();
            sLoginScreen.waitForLoggedIn();
        }
    }

    function handleCloseAlert () {
        driver.pause(2000);
        if (!sHomeAlertScreen.alertContainer.isExisting()) {
            return;
        }
        let message1 = sHomeAlertScreen.alertContainerMessage.getText();
        sHomeAlertScreen.alertContainerOkButton.click();
        sHomeAlertScreen.waitForMessageIsChanged(message1);
        sHomeAlertScreen.alertContainerOkButton.click();
        
        // permission.waitForIsShown();
        driver.pause(3000);
        permission.allowButton.click();
        
        sHomeAlertScreen.waitForIsShown();
        sHomeAlertScreen.alertContainerOkButton.click();
    }

    function handleClickPointNumber () {
        sHomeScreen.waitForIsShown();
        Gestures.swipeOnPercentage(
            Gestures._calculateXY({ x: 50, y: 50 }, 1),
            Gestures._calculateXY({ x: 50, y: 85 }, 1)
        );
        let pointNumberClickedIndex = 0;
        let swipeCount = 10;
        for (let index = 0; index < swipeCount; index++) {
            driver.pause(2000);
            let pointNumberButtonList = sHomeScreen.pointNumberButtonList;
            if (pointNumberButtonList) {
                console.log("pointNumberButtonListCount: ", pointNumberButtonList?.length);
                for (let buttonIndex = 0; buttonIndex < pointNumberButtonList.length; buttonIndex++) {
                    const pointNumberButton = pointNumberButtonList[buttonIndex];
                    // console.log(`swipeUp ${index}: pointNumberButton ${buttonIndex}: `, pointNumberButton.getText());
                    pointNumberButton.click();

                    sHomeGetpointScreen.waitForIsShown();
                    sHomeGetpointScreen.waitForDoneButtonIsShown();
                    sHomeGetpointScreen.closeButton.click();
                    
                    pointNumberClickedIndex++;
                    console.log("pointNumberClickedIndex: ", pointNumberClickedIndex);
                }
            }
            console.log("swipeUp: ", index);
            Gestures.swipeUp(7 / swipeCount);
        }
        console.log(`todayPointLabel: `, sHomeScreen.todayPointLabel.getText());
    }

    function handleClickGetPoint () {
        sLuckycountScreen.waitForIsShown();
        driver.pause(2000)
        let getButton = sLuckycountScreen.getButton;
        if (getButton.isExisting()) {
            getButton.click();
            sLuckycountScreen.waitForGetDoneButtonIsShown();
            sLuckycountScreen.getDoneButton.click();
        }
    }

    function handleClickChallenge () {
        driver.pause(2000)
        let challengeButton = sLuckycountScreen.challengeButton
        if (challengeButton.isExisting()) {
            challengeButton.click();
            sLuckycountScreen.waitForChallengePlayButtonIsShown();
            sLuckycountScreen.challengePlayButton.click();

            sLuckycountScreen.waitForChallengeCardIsShown();
            sLuckycountScreen.challengeCard.click();

            sLuckycountScreen.waitForChallengePlayButtonIsShown();
        }
    }

    it('sps_click_point_number', () => {
        driver.pause(7000);

        handleSkipButton();
        handleFirstLogin();
        handleCloseAlert();
        handleClickPointNumber();
        
        driver.pause(2000)
    });

    it('sps_get_point_and_challenge', () => {
        handleCloseAlert();
        S_TabBar.openLuckyCoint();
        handleClickGetPoint();
        handleClickChallenge();

        driver.pause(2000)
    });

});


