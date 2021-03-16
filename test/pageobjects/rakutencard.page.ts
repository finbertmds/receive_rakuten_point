import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class RakutenCardPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername () { return $('#u') }
    get inputPassword () { return $('#p') }
    get btnLogin () { return $('.loginButton') }
    
    get labelClickPointCountTxt () { return $('.sprite-ico_rc_enavi_point_01 > .rce-number') }
    get btnClickPointCountLink () { return $('.sprite-ico_rc_enavi_point_01') }
    get clickPointList () { return $$('.topArea') }
    get btnClickShoppingLink () { return $('.pNav03 > a') }
    get btnClickShoppingTxt () { return $('.pNav03 > a > span') }
    get btnClickShoppingReceivePoint () { return $('#js-coreppo-receive') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async isNeedLogin (): Promise<boolean> {
        return await (await this.btnLogin).isDisplayed();
    }

    async clickBtnLogin (): Promise<void> {
        await (await this.btnLogin).click();
    }

    async login (username: string, password: string): Promise<void> {
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnLogin).click();
        await browser.pause(2000);
    }

    async getLableClickPointCountTxt (): Promise<number> {
        return parseInt(await (await this.labelClickPointCountTxt).getText());
    }

    async handleClickPointCountLink (): Promise<void> {
        await (await this.btnClickPointCountLink).click();
    }

    async getClickPointListCount (): Promise<number> {
        return (await this.clickPointList).length;
    }

    async canClickPointNewIndex (index: number): Promise<boolean> {
        return await (await (await this.clickPointList)[index].$('./div[1]/p/img')).isExisting();
    }

    async handleClickPointNewIndex (index: number): Promise<void> {
        await (await (await this.clickPointList)[index].$('./div[2]/div[1]/a[1]')).click();
    }

    async handleClickShoppingLink (): Promise<void> {
        await (await this.btnClickShoppingLink).click();
        await browser.pause(2000);
    }

    async getBtnClickShoppingTxtValue (): Promise<string> {
        return await (await this.btnClickShoppingTxt).getText();
    }

    async canClickShoppingReceivePointFromLabel (): Promise<boolean> {
        return (await this.getBtnClickShoppingTxtValue()).localeCompare("新着") === 0;
    }

    async canClickShoppingReceivePointFromBtn (): Promise<boolean> {
        return await (await this.btnClickShoppingReceivePoint).isClickable();
    }


    async handleClickShoppingReceivePoint (): Promise<void> {
        await (await this.btnClickShoppingReceivePoint).click();
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open(config.RAKUTENCARD_HOME_PAGE);
    }
}

export default new RakutenCardPage();
