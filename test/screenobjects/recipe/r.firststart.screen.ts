import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.recipe:id/action_bar_root"),
    START_LABEL: getByText("今すぐはじめる"),
    CANCEL_UPGRADE_LABEL: getByText("キャンセル"),
    WELCOME_SKIP_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/welcome_reg_button_skip"),
    SURVEY_CANCEL_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/survey_cancel_button"),
};

class R_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    waitForStartLablelIsShown () {
        return $(SELECTORS.START_LABEL).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get startLabel () {
        return $(SELECTORS.START_LABEL);
    }

    get cancelUpgradeLabel () {
        return $(SELECTORS.CANCEL_UPGRADE_LABEL);
    }

    get welcomeSkipButton () {
        return $(SELECTORS.WELCOME_SKIP_BUTTON);
    }

    get surveyCancelButton () {
        return $(SELECTORS.SURVEY_CANCEL_BUTTON);
    }

}

export default new R_FirstStartScreen();
