import config from '../../../config';
import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    ENTER_LOGIN_BUTTON: getByResouceId("jp.co.rakuten.pointclub.android:id/btn_login"),
    LOGIN_SCREEN: getByResouceId("omni-container"),
    INPUT: getByResouceId("user_id"),
    PASSWORD: getByResouceId("password_current"),
    NEXT_BUTTON: getByResouceId("cta"),
    LOGIN_WITH_OTHER_BUTTON: getByResouceId("terz_182"),
};

class PC_LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.ENTER_LOGIN_BUTTON);
    }

    get enterLoginButton () {
        return $(SELECTORS.ENTER_LOGIN_BUTTON);
    }

    get nextButton () {
        return $(SELECTORS.NEXT_BUTTON);
    }

    get loginWithOtherButton () {
        return $(SELECTORS.LOGIN_WITH_OTHER_BUTTON);
    }

    get userid () {
        return $(SELECTORS.INPUT);
    }

    get password () {
        return $(SELECTORS.PASSWORD);
    }

    get loginScreen () {
        return $(SELECTORS.LOGIN_SCREEN);
    }

    async waitForEnterLoginScreen () {
        return $(SELECTORS.LOGIN_SCREEN).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    async waitForLoggedIn () {
        return $(SELECTORS.LOGIN_SCREEN).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new PC_LoginScreen();
