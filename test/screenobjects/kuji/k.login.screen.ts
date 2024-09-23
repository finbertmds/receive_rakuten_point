import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    CONTENT: getByResouceId("android:id/content"),
    LOGIN_SCREEN: getByResouceId("h4k5-container"),
    HELP_LABEL: getByText("Help"),
    INPUT: getByResouceId("user_id"),
    PASSWORD: getByResouceId("password_current"),
    NEXT_BUTTON: getByResouceId("cta001"),
    SIGNIN_BUTTON: getByResouceId("cta011"),
    LOGIN_CONTINUE_BUTTON: getByResouceId("form_81"),
    LOGIN_WITH_OTHER_BUTTON: getByResouceId("textl_182"),
};

class K_LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.CONTENT);
    }

    get enterLoginButton () {
        return $(SELECTORS.CONTENT);
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
        return $(SELECTORS.HELP_LABEL).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT
        });
    }

    async waitForLoggedIn () {
        return $(SELECTORS.LOGIN_SCREEN).waitForDisplayed({
            timeout: 3 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new K_LoginScreen();
