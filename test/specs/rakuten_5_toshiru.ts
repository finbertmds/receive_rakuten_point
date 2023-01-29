import config from '../../config';
import Gestures from '../helpers/Gestures';
import cFirststartScreen from '../screenobjects/chrome/c.firststart.screen';
import tFirststartScreen from "../screenobjects/toshiru/t.firststart.screen";
import tHomeScreen from '../screenobjects/toshiru/t.home.screen';
import tLoginScreen from '../screenobjects/toshiru/t.login.screen';

describe('rakuten_toshiru', async () => {
    before(async () => {
        await driver.activateApp(config.RAKUTEN_TOSHIRU_APP_ID);
        await driver.pause(5000);
    })

    async function handleFirstTimeLogin () {
        await tFirststartScreen.waitForIsShown();
        if (await (await tFirststartScreen.enterLoginButton).isDisplayed()) {
            await tFirststartScreen.enterLoginButton.click();
            await driver.pause(5000);
            await handleChromeAction();

            if (await (await tFirststartScreen.warningOkButton).isDisplayed()) {
                await tFirststartScreen.warningOkButton.click();
                await driver.pause(5000);
            }
            let isEnterLoginButtonDisplay = true;
            while (isEnterLoginButtonDisplay) {
                if (await (await tFirststartScreen.enterLoginButton).isDisplayed()) {
                    await tFirststartScreen.enterLoginButton.click();
                    await driver.pause(5000);
                    isEnterLoginButtonDisplay = await (await tFirststartScreen.enterLoginButton).isDisplayed();
                }
            }
            
            await tLoginScreen.waitForEnterLoginScreen();
            if (await (await tLoginScreen.loginContinueButton).isDisplayed()) {
                await tLoginScreen.loginContinueButton.click();
                await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
                await tLoginScreen.waitForLoggedIn();
                return;
            }
            if (await (await tLoginScreen.loginWithOtherButton).isDisplayed()) {
                await tLoginScreen.loginWithOtherButton.click();
                await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
            }
            await tLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
            await driver.pause(3000);
            await tLoginScreen.nextButton.click();
            await driver.pause(3000);
            await tLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
            await driver.pause(3000);
            await tLoginScreen.nextButton.click();
            await driver.pause(3000);
            await tLoginScreen.waitForLoggedIn();
        }
    }

    async function handleChromeAction() {
        await driver.activateApp(config.CHROME_APP_ID);
        await driver.pause(5000);

        await cFirststartScreen.waitForIsShown();
        if (await (await cFirststartScreen.acceptContinueButton).isDisplayed()) {
            await (await cFirststartScreen.acceptContinueButton).click();
            await (await cFirststartScreen.noThanksButton).click();
            await driver.pause(10000);
        }

        await driver.activateApp(config.RAKUTEN_TOSHIRU_APP_ID);
        await driver.pause(5000);
    }

    async function handleClaimPoint() {
        await driver.pause(2000);
        let modalClaimIsDisplayed = await tFirststartScreen.modalClaim.isDisplayed()
        if (modalClaimIsDisplayed) {
            await tFirststartScreen.pointLogoClaimButton.click();
            await tHomeScreen.waitForGetPointDoneLabelIsShown();
            await driver.back();
            return true;
        }
        return false;
    }

    async function handleFirstTimeEnterApp () {
        await handleClaimPoint();

        await tFirststartScreen.waitForRecommendedImageIsShown();
        if (await (await tFirststartScreen.commonNextButton).isDisplayed()) {
            await (await tFirststartScreen.commonNextButton).click();
        }
        if (await (await tFirststartScreen.commonNextButton).isDisplayed()) {
            await (await tFirststartScreen.commonNextButton).click();
        }
        if (await (await tFirststartScreen.commonNextButton).isDisplayed()) {
            await (await tFirststartScreen.commonNextButton).click();
        }
        if (await (await tFirststartScreen.startButton).isDisplayed()) {
            await (await tFirststartScreen.startButton).click();
        }
        await driver.pause(5000);
        if (await (await tFirststartScreen.parentPanel).isDisplayed()) {
            await (await tFirststartScreen.noButton).click();
        }
        await tHomeScreen.handleCloseOverlayBackground();
    }

    async function checkIsLoggedIn () {
        if (await (await tHomeScreen.headerMenuButton).isDisplayed()) {
            await (await tHomeScreen.headerMenuButton).click();
            await tHomeScreen.waitForRakutenRewardLabelIsShown();
            
            await Gestures.swipeUp();
            if (await (await tHomeScreen.logoutButton).isDisplayed()) {
                await driver.back();
                return true;
            }
        }
        return false;
    }

    async function checkSwipeUntilNextArticle(groupId: string, articleTitleReadList: string[]) {
        let articleImageListNew = await tHomeScreen.articleImageList(groupId);
        if (articleImageListNew == null) {
            return true;
        }
        for (let index = 0; index < articleImageListNew.length; index++) {
            let articleImage = articleImageListNew[index];
            let articleTitle = await (await tHomeScreen.articleTitle(articleImage)).getText();
            if (articleTitleReadList.indexOf(articleTitle) == -1) {
                return true;
            }
        }
        return false;
    }

    async function readArticles() {
        let i = 0;
        let groupId = '';
        while (groupId == '') {
            i++
            await Gestures.swipeOnPercentage(
                Gestures.calculateXY({ x: 50, y: 85 }, 1),
                Gestures.calculateXY({ x: 50, y: 50 }, 1),
            );
            if (await (await tHomeScreen.recommendSectionFooterTitle).isDisplayed()) {
                await (await tHomeScreen.recommendSectionFooterTitle).click();
                groupId = 'jp.co.rakutensec.toshiru:id/simpleArticleListView';
                break;
            }
            if (await (await tHomeScreen.rankingSectionFooterButton).isDisplayed()) {
                await (await tHomeScreen.rankingSectionFooterButton).click();
                groupId = 'jp.co.rakutensec.toshiru:id/rankingListContentsView';
                break;
            }
            if (await (await tHomeScreen.sectionFooterButton).isDisplayed()) {
                await (await tHomeScreen.sectionFooterButton).click();
                groupId = 'jp.co.rakutensec.toshiru:id/simpleArticleListView';
                break;
            }
            if (i >= config.RAKUTEN_TOSHIRU_SCROLL_HOME_COUNT) {
                break;
            }
        }
        if (groupId == '') {
            return;
        }
        // await tHomeScreen.waitForHeaderTitleLabelIsShown();
        await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
        let articleImageList = await tHomeScreen.articleImageList(groupId);
        if (articleImageList == null) {
            return;
        }
        console.log("articleImageList count: " + articleImageList.length);
        
        let articleTitleReadList = [];
        let maxCount = config.RAKUTEN_TOSHIRU_READ_ARTICLES_COUNT;
        for (let i = 0; i < maxCount; i++) {
            if (i >= articleImageList.length) {
                let isNextArticle = false;
                while (!isNextArticle) {
                    await Gestures.swipeUp();
                    await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 2)));
                    isNextArticle = await checkSwipeUntilNextArticle(groupId, articleTitleReadList);
                }
                maxCount = config.RAKUTEN_TOSHIRU_READ_ARTICLES_COUNT - i;
                i = 0;
            }
            console.log('read article ' + i);
            let articleImageListNew = await tHomeScreen.articleImageList(groupId);
            if (articleImageListNew == null) {
                return;
            }
            let articleImage = articleImageListNew[i];
            let articleTitle = await (await tHomeScreen.articleTitle(articleImage)).getText();
            console.log('articleTitle: ' + articleTitle);
            articleTitleReadList.push(articleTitle);
            await driver.pause(2000);
            await articleImage.click();
            await driver.pause(2000);
            await tHomeScreen.waitForContentsIsShown();

            for (let j = 0; j < config.RAKUTEN_TOSHIRU_SCROLL_ARTICLE_COUNT; j++) {
                console.log('read article ' + i + ' -- scroll article ' + j);
                await Gestures.swipeUp();
                let isClaim = await handleClaimPoint();
                if (isClaim) {
                    await driver.back();
                    await driver.back();
                    return;
                }
            }
            await driver.back();
        }
        await driver.back();
    }
    
    it('t_login', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            await handleFirstTimeLogin();
            await handleFirstTimeEnterApp();
        }
    });

    it('t_read_articles', async () => {
        let isLoggedIn = await checkIsLoggedIn();
        if (!isLoggedIn) {
            return;
        }
        await readArticles();
    });
});


