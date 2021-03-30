import config from '../../../config';
import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/parentPanel"),
    LOGO_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/logo"),
    WARNING_LABEL: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/alertTitle"),
    CLOSE_LABEL: getByResouceId("android:id/button1"),
    NO_BUTTON: getByResouceId("android:id/button2"),
};

class K_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    waitForWarningLablelIsShown () {
        return $(SELECTORS.WARNING_LABEL).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get warningLabel () {
        return $(SELECTORS.WARNING_LABEL);
    }

    get closeLabel () {
        return $(SELECTORS.CLOSE_LABEL);
    }

    get noButton () {
        return $(SELECTORS.NO_BUTTON);
    }
}

export default new K_FirstStartScreen();
