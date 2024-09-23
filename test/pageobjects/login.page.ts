import config from '../../config';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername() { return $('[name="u"]') }
    get inputPassword() { return $('[name="p"]') }
    get btnSubmit() { return $('[name="submit"]') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

    async isNotLoggedIn(): Promise<boolean> {
        return await (await this.inputUsername).isDisplayed();
    }

    async login(username: string, password: string): Promise<void> {
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
    open() {
        return super.open(config.LOGIN_PAGE);
    }
}

export default new LoginPage();
