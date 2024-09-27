import config from '../../config';
import timeHelper from '../helpers/timeHelper';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class InfoseekPage extends Page {
    /**
     * define selectors using getter methods
     */
    get btnLogin() { return $('.button.login') }

    /**
     * login page require
     */
    get inputUsername() { return $('#loginInner_u') }
    get inputPassword() { return $('#loginInner_p') }
    get btnSubmit() { return $('[name="submit"]') }

    /**
     * new login page require
     */
    get inputUsernameV2() { return $('#user_id') }
    get inputPasswordV2() { return $('#password_current') }
    get btnNextV2() { return $$('.h4k5-e2e-button__submit') }
    get btnLoginConfirmV2() { return $('#prim_continue') }

    /**
     * notification modal
     * notification_close_button
     */
    get notificationModal() { return $('#notification_banner_modal') }
    get notificationCloseButton() { return $('#notification_close_button') }

    /**
     * modal contents
     * 
     */
    get modalContents() { return $('.modalClick_contents') }
    get modalContentsCloseButton() { return $('.modalClick_close') }

    get dialogContainer() { return $('.fc-monetization-dialog-container') }
    get dialogAdButton() { return $('.fc-rewarded-ad-button') }
    get adButtonAfter() { return $('#dismiss-button-element') }

    /**
     * mission page
     */
    get btnMissionJoinList() { return $$('.list-challenge .btn') }
    get btnMissionJoin() { return $('.list-challenge .btn') }
    get btnMissionAgree() { return $('//a[contains(text(),\'同意する\')]') }
    get btnGetPointList() { return $$('.list-acquired .btn') }
    get btnGetPoint() { return $('.list-acquired .btn') }

    /**
     * ranking list link
     */
    get sectionBox() { return $('section.section-box') }
    async rankingListTextLink() {
        let rankingListTextLinkList = await $$('.ranking-list__text-title');
        let visibleList = [];
        for (let index = 0; index < rankingListTextLinkList.length; index++) {
            const link = rankingListTextLinkList[index];
            if (await link.isDisplayed()) {
                visibleList.push(link);
            }
        }
        return visibleList;
    }
    get footerContainer() { return $('.footer-container') }

    /**
     * mission visit page
     */
    get getButton() { return $('.get-button') }

    /**
     * reaction
     */
    get reactionIconIine() { return $('.reaction-icon.-iine') }

    /**
     * mission point page
     */
    get pointGet() { return $('.point_get') }

    async closeNotificationModal() {
        await browser.pause(5000);
        if (await (await this.notificationModal).isExisting()) {
            if (await (await this.notificationModal).isDisplayed()) {
                if (await (await this.notificationCloseButton).isClickable()) {
                    await (await this.notificationCloseButton).click();
                }
            }
        }
    }

    async closeModalContents() {
        await browser.pause(5000);
        if (await (await this.modalContents).isExisting()) {
            if (await (await this.modalContents).isDisplayed()) {
                if (await (await this.modalContentsCloseButton).isClickable()) {
                    await (await this.modalContentsCloseButton).click();
                }
            }
        }
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async isNeedLogin(): Promise<boolean> {
        return await (await this.btnLogin).isDisplayed();
    }

    async clickBtnLogin(): Promise<void> {
        await (await this.btnLogin).click();
    }

    async isNotLoggedIn(): Promise<boolean> {
        return await (await this.inputUsername).isDisplayed();
    }

    async login(username: string, password: string): Promise<void> {
        await this.clickBtnLogin();
        await browser.pause(config.DEFAULT_TIMEOUT)
        if (!await this.isNotLoggedIn()) {
            return;
        }
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnSubmit).click();
        await browser.pause(config.DEFAULT_TIMEOUT)
    }

    async isNotLoggedInV2(): Promise<boolean> {
        let inputUsernameIsDisplayed = await (await this.inputUsernameV2).isDisplayed();
        let inputPasswordIsDisplayed = await (await this.inputPasswordV2).isDisplayed();
        return inputUsernameIsDisplayed || inputPasswordIsDisplayed
    }

    async loginV2(username: string, password: string): Promise<void> {
        await this.clickBtnLogin();
        await browser.pause(config.DEFAULT_TIMEOUT)
        if (!await this.isNotLoggedInV2()) {
            return;
        }
        if (await (await this.inputUsernameV2).isDisplayed()) {
            await (await this.inputUsernameV2).setValue(username);
            let btnNextList = await this.btnNextV2;
            await (btnNextList[0]).click();
            await browser.pause(2000);
        }
        if (await (await this.inputPasswordV2).isDisplayed()) {
            await (await this.inputPasswordV2).setValue(password);
            let btnNextList = await this.btnNextV2;
            if (btnNextList.length > 1) {
                await (btnNextList[1]).click();
            } else if (btnNextList.length > 0) {
                await (btnNextList[0]).click();
            }
            await browser.pause(2000);
        }
        if (await (await this.btnLoginConfirmV2).isDisplayed()) {
            await (await this.btnLoginConfirmV2).click();
        }
        await browser.pause(config.DEFAULT_TIMEOUT)
    }

    async canClickJoinMission(): Promise<boolean> {
        return (await this.btnMissionJoinList).length > 0;
    }

    async joinMission() {
        await super.open(config.INFO_SEEK_MISSION_PAGE);
        if (!await this.canClickJoinMission()) {
            return;
        }
        let missionList = await this.btnMissionJoinList;
        for (let index = 0; index < missionList.length; index++) {
            const mission = await this.btnMissionJoin;
            await mission.scrollIntoView();
            await mission.click();
            await browser.pause(5000);
            if (await (await this.btnMissionAgree).isDisplayed()) {
                await this.btnMissionAgree.scrollIntoView();
                await (await this.btnMissionAgree).click();
                await browser.pause(5000);
            }

            await super.open(config.INFO_SEEK_MISSION_PAGE);
        }
    }

    async handleOpenHomePageAndClickTab(tabName?: string) {
        await super.open(config.INFO_SEEK_PAGE);
        await (await this.sectionBox).scrollIntoView();

        if (tabName) {
            let tabNameElement = await $('.' + tabName);
            if (await tabNameElement.isDisplayed()) {
                await tabNameElement.click();
                await browser.pause(2000);

                let tabNameContentsId = tabName.replace('genre-tab__', 'ranking-');
                let tabNameContentsElement = await $('#' + tabNameContentsId);
                if (await tabNameContentsElement.isDisplayed()) {
                    await tabNameContentsElement.scrollIntoView();
                }
            }
        }
    }

    async handleReactionIine() {
        if (await (await this.reactionIconIine).isDisplayed()) {
            await (await this.reactionIconIine).scrollIntoView();
            if (await (await this.reactionIconIine).isClickable()) {
                await (await this.reactionIconIine).click()
                await browser.pause(2000);
            }
        }
    }

    async readArticle(tabName?: string) {
        await this.handleOpenHomePageAndClickTab(tabName);

        let urlClickedList = [];
        let titleClickedList = [];
        let oldRandomValue = -1;
        for (let index = 0; index < config.READ_ARTICLE_MAX_COUNT; index++) {
            let rankingListTextLink = await this.rankingListTextLink();
            let indexPage = timeHelper.randomFollowTime(rankingListTextLink.length - 1);
            if (indexPage === oldRandomValue) {
                indexPage = timeHelper.randomFollowTime(rankingListTextLink.length - 1);
            }
            console.log("readArticle: random indexPage: " + indexPage);
            const link = rankingListTextLink[indexPage];
            if (await link.isDisplayed()) {
                await link.click();
                await browser.pause(config.DEFAULT_READ_ARTICLE_TIME);
                let url = await browser.getUrl()
                urlClickedList.push(url);
                let title = await browser.getTitle()
                titleClickedList.push(title);
                await (await this.footerContainer).scrollIntoView();
                await this.handleReactionIine();
            }

            await this.handleOpenHomePageAndClickTab(tabName);
        }
        console.log("readArticle: rankingPage: " + tabName);
        console.log("readArticle: urlClickedList: " + urlClickedList);
        console.log("readArticle: titleClickedList: " + titleClickedList);
    }

    async handleOpenRankingPage(rankingPage: string) {
        await super.open(rankingPage);
        // await (await this.sectionBox).scrollIntoView();
    }

    async readArticleAtRankingPage(rankingPage: string) {
        await this.handleOpenRankingPage(rankingPage);

        let urlClickedList = [];
        let titleClickedList = [];
        let oldRandomValue = -1;
        for (let index = 0; index < config.READ_ARTICLE_MAX_COUNT; index++) {
            let rankingListTextLink = await this.rankingListTextLink();
            let indexPage = timeHelper.randomFollowTime(rankingListTextLink.length - 1);
            if (indexPage === oldRandomValue) {
                indexPage = timeHelper.randomFollowTime(rankingListTextLink.length - 1);
            }
            console.log("readArticleAtRankingPage: random indexPage: " + indexPage);
            const link = rankingListTextLink[indexPage];
            if (await link.isDisplayed()) {
                await link.scrollIntoView();
                await link.click();
                await browser.pause(config.DEFAULT_READ_ARTICLE_TIME);
                let url = await browser.getUrl()
                urlClickedList.push(url);
                let title = await browser.getTitle()
                titleClickedList.push(title);
                await (await this.footerContainer).scrollIntoView();
                await this.handleReactionIine();
            }

            await this.handleOpenRankingPage(rankingPage);
        }
        console.log("readArticleAtRankingPage: rankingPage: " + rankingPage);
        console.log("readArticleAtRankingPage: urlClickedList: " + urlClickedList);
        console.log("readArticleAtRankingPage: titleClickedList: " + titleClickedList);
    }

    async visitMissionPage() {
        await super.open(config.INFO_SEEK_MISSION_VISIT_PAGE);
        await browser.pause(2000);
    }

    async canClickGetPoint(): Promise<boolean> {
        return (await this.btnGetPointList).length > 0;
    }

    async handleClickGetPoint() {
        await super.open(config.INFO_SEEK_MISSION_PAGE);
        if (!await this.canClickGetPoint()) {
            return;
        }
        let getPointList = await this.btnGetPointList;
        for (let index = 0; index < getPointList.length; index++) {
            const getPoint = await this.btnGetPoint;
            await getPoint.scrollIntoView();
            await getPoint.click();
            await browser.pause(5000);
            await (await this.pointGet).waitForDisplayed();

            await super.open(config.INFO_SEEK_MISSION_PAGE);
        }
    }

    async handleCloseDialogContainer() {
        let needCloseAd = false;
        if (await (await this.dialogContainer).isDisplayed()) {
            if (await (await this.dialogAdButton).isClickable()) {
                await (await this.dialogAdButton).click()
                needCloseAd = true;
                await browser.pause(config.DEFAULT_TIMEOUT);
            }
        }
        if (needCloseAd) {
            if (await (await this.adButtonAfter).isDisplayed()) {
                if (await (await this.adButtonAfter).isClickable()) {
                    await (await this.adButtonAfter).click()
                    await browser.pause(config.DEFAULT_TIMEOUT);
                }
            } else {
                await browser.refresh();
            }
        }
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open() {
        return super.open(config.INFO_SEEK_PAGE);
    }
}

export default new InfoseekPage();
