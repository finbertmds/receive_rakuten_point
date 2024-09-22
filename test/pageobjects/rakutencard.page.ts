import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class RakutenCardPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername() { return $('#u') }
    get inputPassword() { return $('#p') }
    get btnLogin() { return $('.loginButton') }

    /**
     * new login page require
     */
    get inputUsernameV2() { return $('#user_id') }
    get inputPasswordV2() { return $('#password_current') }
    get btnNextV2() { return $$('.h4k5-e2e-button__submit') }
    get btnLoginConfirmV2() { return $('#prim_continue') }

    get labelClickPointCountTxt() { return $('.sprite-ico_rc_enavi_point_01 > .top-edit-total-click-point') }
    get btnClickPointCountLink() { return $('.sprite-ico_rc_enavi_point_01') }
    get clickPointList() { return $$('.click-point-banner') }

    get videoBtn() { return $('#vjs_video_3 > button') }
    get videoGetPointImg() { return $('.js-movie-point-finish') }

    get btnClickShoppingLink() { return $('.pNav03 > a') }
    get btnClickShoppingTxt() { return $('.pNav03 > a > span') }
    get btnClickShoppingReceivePoint() { return $('#js-coreppo-receive') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async isNeedLogin(): Promise<boolean> {
        let btnNextList = await this.btnNextV2;
        if (btnNextList.length > 0) {
            let isBtnNextListDisplayed = await (btnNextList[0]).isDisplayed();
            return isBtnNextListDisplayed;
        }
        return false;
    }

    async clickBtnLogin(): Promise<void> {
        await (await this.btnLogin).click();
    }

    async login(username: string, password: string): Promise<void> {
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnLogin).click();
        await browser.pause(2000);
    }

    async isNotLoggedInV2(): Promise<boolean> {
        let inputUsernameIsDisplayed = await (await this.inputUsernameV2).isDisplayed();
        let inputPasswordIsDisplayed = await (await this.inputPasswordV2).isDisplayed();
        return inputUsernameIsDisplayed || inputPasswordIsDisplayed
    }

    async loginV2(username: string, password: string): Promise<void> {
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
            await (btnNextList[1]).click();
            await browser.pause(2000);
        }
        if (await (await this.btnLoginConfirmV2).isDisplayed()) {
            await (await this.btnLoginConfirmV2).click();
        }
        await browser.pause(config.DEFAULT_TIMEOUT)
    }

    async getLableClickPointCountTxt(): Promise<number> {
        return parseInt(await (await this.labelClickPointCountTxt).getText());
    }

    async handleClickPointCountLink(): Promise<void> {
        await (await this.btnClickPointCountLink).click();
    }

    async getClickPointListCount(): Promise<number> {
        return (await this.clickPointList).length;
    }

    async canClickPointNewIndex(index: number): Promise<boolean> {
        return await (await (await this.clickPointList)[index]).isExisting();
    }

    async handleClickPointNewIndex(index: number): Promise<void> {
        await (await (await this.clickPointList)[index]).click();
    }

    async handleClickShoppingLink(): Promise<void> {
        await (await this.btnClickShoppingLink).click();
        await browser.pause(2000);
    }

    async getBtnClickShoppingTxtValue(): Promise<string> {
        return await (await this.btnClickShoppingTxt).getText();
    }

    async canClickShoppingReceivePointFromLabel(): Promise<boolean> {
        return (await this.getBtnClickShoppingTxtValue()).localeCompare("新着") === 0;
    }

    async canClickShoppingReceivePointFromBtn(): Promise<boolean> {
        return await (await this.btnClickShoppingReceivePoint).isClickable();
    }


    async handleClickShoppingReceivePoint(): Promise<void> {
        await (await this.btnClickShoppingReceivePoint).click();
    }

    async handlClickVideo() {
        let videoBtn = await this.videoBtn
        if (! await videoBtn.isDisplayed()) {
            return;
        }
        await videoBtn.scrollIntoView()
        await videoBtn.click();
        await browser.waitUntil(async () => {
            try {
                return await (await this.videoGetPointImg).isDisplayed();
            } catch (error) {
                return true
            }
        },
            {
                timeout: 300000,
                timeoutMsg: 'expected video end after 5m'
            })
        console.log("view video end");
        await (await this.videoGetPointImg).click();

        await browser.pause(3000)
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open() {
        return super.open(config.RAKUTENCARD_HOME_PAGE);
    }
}

export default new RakutenCardPage();
