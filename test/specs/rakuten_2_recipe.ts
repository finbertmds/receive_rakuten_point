import config from '../../config';
import Gestures from '../helpers/Gestures';
import rFirststartScreen from '../screenobjects/recipe/r.firststart.screen';
import sHomeModalScreen from '../screenobjects/recipe/r.home.modal.screen';
import rHomeScreen from '../screenobjects/recipe/r.home.screen';
import rHomeSettingScreen from '../screenobjects/recipe/r.home.setting.screen';
import rLoginScreen from '../screenobjects/recipe/r.login.screen';
import rMypageScreen from '../screenobjects/recipe/r.mypage.screen';
import rRewardScreen from '../screenobjects/recipe/r.reward.screen';
import rTabBar from '../screenobjects/recipe/r.tab.bar';

describe('rakuten_recipe', async () => {
    before(async () => {
        await driver.activateApp(config.RAKUTEN_RECIPE_APP_ID);
        await driver.pause(5000);
    })

    async function handleFirstTimeEnterApp (completeServey: boolean = false) {
        // await rFirststartScreen.waitForStartLablelIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        if (await rFirststartScreen.cancelUpgradeLabel.isDisplayed()) {
            await rFirststartScreen.cancelUpgradeLabel.click();
            await driver.pause(5000);
        }
        if (! await rFirststartScreen.startLabel.isDisplayed()) {
            return;
        }
        await rFirststartScreen.startLabel.click();
        await rHomeSettingScreen.waitForIsShown();
        if (await rHomeSettingScreen.scrollView.isDisplayed()) {
            if (completeServey) {
                await rHomeSettingScreen.choice1Option1.click();
                await Gestures.swipeUp();
                await rHomeSettingScreen.choice2Option1.click();
                await rHomeSettingScreen.choice3Option1.click();
                
                console.log("click ok button");
                
                await rHomeSettingScreen.serveyOkButton.click();
                await rHomeSettingScreen.waitForRecommendedIsShown();
                await rHomeSettingScreen.serveyOkButton.click();
                await rHomeSettingScreen.waitForRecommendedIsShown();
                await rHomeSettingScreen.serveyOkButton.click();
                await rHomeSettingScreen.waitForCompletionMessagesShown();
                await rHomeSettingScreen.serveyCompletionButton.click();

            } else {
                console.log("click cancel button");
                await rHomeSettingScreen.serveyCancelButton.click();
            }
        }
        await driver.pause(10000);
    }

    async function handleFirstTimeEnterAppNew () {
        if (await rFirststartScreen.welcomeSkipButton.isDisplayed()) {
            await rFirststartScreen.welcomeSkipButton.click();
        }
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        if (await rFirststartScreen.surveyCancelButton.isDisplayed()) {
            await rFirststartScreen.surveyCancelButton.click();
        }
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
    }

    async function handleOpenTabMyPageAndLogin () {
        await rTabBar.waitForTabBarShown();
        await rTabBar.openMyPage();

        await driver.pause(2000);
        if (await rMypageScreen.loginButton.isDisplayed()) {
            await rMypageScreen.loginButton.click();

            await handleFirstTimeLogin();
        }
    }

    async function handleFirstTimeLogin () {
        await rLoginScreen.waitForIsShown();
        await rLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await rLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await rLoginScreen.loginButton.click();
        await rLoginScreen.waitForLoggedIn();
        console.log("logged in");
    }

    async function handleCloseModal () {
        await driver.pause(3000);
        if (await sHomeModalScreen.modalContainer.isDisplayed()) {
            await sHomeModalScreen.modalNotShowButton.click();
            await sHomeModalScreen.closeButton.click();
            await driver.pause(3000);
        }
    }

    async function openRewardScreen () {
        // await Gestures.swipeUp(0.7);
        if (! await rMypageScreen.rewardButton.isDisplayed()) {
            return false;
        }
        await rMypageScreen.rewardButton.click();

        await rRewardScreen.waitForIsShown();
        // await rRewardScreen.waitForSuggestProductIsShown();
        await driver.pause(config.DEFAULT_TIMEOUT);
        let retryLableIsShown = await rRewardScreen.retryLabel.isDisplayed();
        let retryCount = 0;
        while (retryLableIsShown && retryCount < config.RAKUTEN_RETRY_MAX_COUNT) {
            await rRewardScreen.retryLabel.click();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
            retryLableIsShown = await rRewardScreen.retryLabel.isDisplayed();
            retryCount++;
        }
        if (retryCount >= config.RAKUTEN_RETRY_MAX_COUNT) {
            return false;
        }
        // await rRewardScreen.waitForSuggestProductIsShown();
        let needLoginMoreTimeButton = rRewardScreen.needLoginButton;
        if (await needLoginMoreTimeButton.isDisplayed()) {
            // await rRewardScreen.closeButton.click();
            await driver.back();
            return false;
        }
        return true;
    }
    
    async function clickUnclaimButton () {
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        let unclaimBox = rRewardScreen.unclaimBox;
        if (await unclaimBox.isDisplayed()) {
            await unclaimBox.click();

            await rRewardScreen.waitForUnclaimListIsShown();
            await rRewardScreen.waitForUnclaimListItemsIsShown();
            let unclaimListCount = (await rRewardScreen.getUnclaimListItems())?.length
            console.log("unclaimListCount: ", unclaimListCount);
            
            if (unclaimListCount) {
                for (let index = 0; index < unclaimListCount; index++) {
                    if (index !== 0) {
                        await rRewardScreen.waitForUnclaimBoxIsShown();
                        await unclaimBox.click();
                        await rRewardScreen.waitForUnclaimListIsShown();
                        await rRewardScreen.waitForUnclaimListItemsIsShown();
                    }
                    let unclaimListIndexButton = await rRewardScreen.getUnclaimListIndexButton(0);
                    if (unclaimListIndexButton) {
                        console.log("unclaimText: ", await (await rRewardScreen.getUnclaimListIndexButton(index))?.getText());
                        unclaimListIndexButton.click();
                        
                        let loginAgain = await handleLoginRequireAgain();
                        if (loginAgain) {
                            return true;
                        }
                        await rRewardScreen.waitForGetPointDoneLabelIsShown();
                        console.log("getPointDoneLabel: ", await rRewardScreen.getPointDoneLabel.getText());

                        // @ts-ignore
                        await (await rRewardScreen.backButton()).click();
                    }
                }                
            }
        }
        // await (await rRewardScreen.closeButton()).click();
        await driver.back();
        return false;
    }

    async function handleLoginRequireAgain () {
        await driver.pause(5000);
        if (! await rRewardScreen.requireLoginLabel.isDisplayed()) {
            return false;
        }
        await Gestures.swipeUp(0.7);
        await rRewardScreen.userid.setValue(config.RAKUTEN_USERNAME);
        await rRewardScreen.password.setValue(config.RAKUTEN_PASSWORD);
        await rRewardScreen.loginButton.click();
        await rRewardScreen.waitForLoggedIn();
        console.log("logged in one again");
        return true;
    }
    
    async function openRewardGetPoint() {
        let loggedIn = await openRewardScreen();
        let retryCount = 0;
        while (!loggedIn && retryCount < config.RAKUTEN_RETRY_MAX_COUNT) {
            loggedIn = await openRewardScreen();
            retryCount++;
        }
        if (!loggedIn) {
            return;
        }
        // await rRewardScreen.closeButton.click();
        await driver.back();
        for (let index = 0; index < 4; index++) {
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            if (! await rMypageScreen.rewardButton.isDisplayed()) {
                return false;
            }
            await rMypageScreen.rewardButton.click();
            await rRewardScreen.waitForIsShown();
            // await rRewardScreen.closeButton.click();
            await driver.back();
        }
    }

    async function handleClickUnClaim() {
        let loggedIn = await openRewardScreen();
        let retryCount = 0;
        while (!loggedIn && retryCount < config.RAKUTEN_RETRY_MAX_COUNT) {
            loggedIn = await openRewardScreen();
            retryCount++;
        }
        if (!loggedIn) {
            return;
        }
        let requireLoginAgain = await clickUnclaimButton();
        if (requireLoginAgain) {
            requireLoginAgain = await clickUnclaimButton();
        }
    }

    async function openHomeScreen() {
        await rTabBar.waitForTabBarShown();
        await rTabBar.openHome();
        await driver.pause(2000);
    }

    async function handleClickReceipe() {
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
        await handleCloseModal();
        let firstReceipeImage = await rHomeScreen.firstRecipeImage();
        if (firstReceipeImage) {
            await firstReceipeImage.click();
            await handleCloseModal();
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            if (await rHomeScreen.swipeGuideImage.isDisplayed()) {
                await rHomeScreen.swipeGuideImage.click();
            }
            await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            await driver.back();
            // await rHomeScreen.waitForBackButtonIsShown();
            // await rHomeScreen.backButton.click();
        }
    }

    it('r_first_login', async () => {
        await driver.pause(7000);
        
        await handleFirstTimeEnterApp();
        await handleFirstTimeEnterAppNew();
        await handleOpenTabMyPageAndLogin();
    });

    it('r_click_recipe', async () => {
        await handleCloseModal();
        await openHomeScreen();
        await handleCloseModal();
        await rHomeScreen.tabbarPopularLabel.click();
        for (let index = 0; index < config.RAKUTEN_RECIPE_CLICK_RECEIPE_COUNT; index++) {
            await handleClickReceipe();
        }
    });

    it('r_open_reward', async () => {
        await handleOpenTabMyPageAndLogin();
        await handleCloseModal();
        await Gestures.swipeUp(0.7);
        await openRewardGetPoint();
    });

    it('r_claim_point', async () => {
        await handleOpenTabMyPageAndLogin();
        await handleCloseModal();
        await handleClickUnClaim();
    });

});


