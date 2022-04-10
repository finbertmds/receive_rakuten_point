import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class BankLoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get gotoLoginPageBtn () { return $('.open-w') }

    get inputUsername () { return $('[name="LOGIN\:USER_ID"]') }
    get inputPassword () { return $('[name="LOGIN\:LOGIN_PASSWORD"]') }
    get btnSubmit () { return $('.btn-login-01') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

    async isNotLoggedIn (): Promise<boolean> {
        return await (await this.inputUsername).isDisplayed();
    }

    async login (username: string, password: string): Promise<void> {
        const windows = await browser.getWindowHandles();
        const window = windows[windows.length - 1];
        await browser.switchToWindow(window);
        
        if (!await this.isNotLoggedIn()) {
            return;
        }
        await (await this.inputUsername).setValue(username);
        await (await this.inputPassword).setValue(password);
        await (await this.btnSubmit).click();
        await browser.pause(2000);
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open(config.BANK_LOGIN_PAGE);
    }
}

export default new BankLoginPage();
