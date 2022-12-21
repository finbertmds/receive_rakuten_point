import config from '../../../config';
import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    LOGIN_SCREEN: getByResouceId("jp.co.rakuten.slide:id/login_outer_container"),
    INPUT: getByResouceId("jp.co.rakuten.slide:id/manual_username"),
    PASSWORD: getByResouceId("jp.co.rakuten.slide:id/manual_password"),
    LOGIN_BUTTON: getByResouceId("jp.co.rakuten.slide:id/manual_login_button"),
};

class S_LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.LOGIN_SCREEN);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get userid () {
        return $(SELECTORS.INPUT);
    }

    get password () {
        return $(SELECTORS.PASSWORD);
    }

    async waitForLoggedIn () {
        return $(SELECTORS.INPUT).waitForDisplayed({
            timeout: 15 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new S_LoginScreen();
