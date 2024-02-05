import config from '../../../config';
import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    LOGIN_SCREEN: getByResouceId("h4k5-container"),
    INPUT: getByResouceId("user_id"),
    PASSWORD: getByResouceId("password_current"),
    NEXT_BUTTON: getByResouceId("cta001"),
    SIGNIN_BUTTON: getByResouceId("cta011"),
    LOGIN_CONTINUE_BUTTON: getByResouceId("form_81"),
    LOGIN_WITH_OTHER_BUTTON: getByResouceId("textl_182"),
};

class T_LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.LOGIN_SCREEN);
    }

    get nextButton () {
        return $(SELECTORS.NEXT_BUTTON);
    }

    get signInButton () {
        return $(SELECTORS.SIGNIN_BUTTON);
    }

    get loginContinueButton () {
        return $(SELECTORS.LOGIN_CONTINUE_BUTTON);
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
            timeout: 3 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    async waitForLoggedIn () {
        return $(SELECTORS.LOGIN_SCREEN).waitForDisplayed({
            timeout: 15 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new T_LoginScreen();
