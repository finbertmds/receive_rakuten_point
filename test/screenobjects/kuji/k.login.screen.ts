import config from '../../../config';
import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    LOGIN_SCREEN: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/user__logo"),
    INPUT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/user__userid"),
    PASSWORD: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/user__password"),
    LOGIN_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/user__login"),
};

class K_LoginScreen extends AppScreen {
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

    waitForLoggedIn () {
        return $(SELECTORS.INPUT).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new K_LoginScreen();
