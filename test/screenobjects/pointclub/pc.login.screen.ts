import config from '../../../config';
import { getByClassname, getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    ENTER_LOGIN_BUTTON: getByResouceId("jp.co.rakuten.pointclub.android:id/btn_login"),
    LOGIN_SCREEN: getByResouceId("h4k5-container"),
    PROGRESS_BAR: getByClassname("android.widget.ProgressBar"),
    INPUT: getByResouceId("user_id"),
    PASSWORD: getByResouceId("password_current"),
    NEXT_BUTTON: getByResouceId("cta001"),
    SIGNIN_BUTTON: getByResouceId("cta011"),
    LOGIN_CONTINUE_BUTTON: getByResouceId("form_81"),
    LOGIN_WITH_OTHER_BUTTON: getByResouceId("textl_182"),
    SKIP_TO_SIGN_IN: getByResouceId("seco_473"),
};

class PC_LoginScreen extends AppScreen {
    constructor() {
        super(SELECTORS.ENTER_LOGIN_BUTTON);
    }

    get enterLoginButton() {
        return $(SELECTORS.ENTER_LOGIN_BUTTON);
    }

    get nextButton() {
        return $(SELECTORS.NEXT_BUTTON);
    }

    get signInButton() {
        return $(SELECTORS.SIGNIN_BUTTON);
    }

    get loginContinueButton() {
        return $(SELECTORS.LOGIN_CONTINUE_BUTTON);
    }

    get loginWithOtherButton() {
        return $(SELECTORS.LOGIN_WITH_OTHER_BUTTON);
    }

    get skipToSignIn() {
        return $(SELECTORS.SKIP_TO_SIGN_IN);
    }

    get userid() {
        return $(SELECTORS.INPUT);
    }

    get password() {
        return $(SELECTORS.PASSWORD);
    }

    get loginScreen() {
        return $(SELECTORS.LOGIN_SCREEN);
    }

    get progressBar() {
        return $(SELECTORS.PROGRESS_BAR);
    }

    async waitForProgressBarLoggedIn() {
        return $(SELECTORS.PROGRESS_BAR).waitForDisplayed({
            timeout: 3 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }

    async waitForEnterLoginScreen() {
        return $(SELECTORS.LOGIN_SCREEN).waitForDisplayed({
            timeout: 3 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    async waitForLoggedIn() {
        return $(SELECTORS.LOGIN_SCREEN).waitForDisplayed({
            timeout: 15 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new PC_LoginScreen();
