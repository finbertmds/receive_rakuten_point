import config from '../../../config';
import { getByClassname, getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/parentPanel"),
    LOGO_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/logo"),
    WARNING_LABEL: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/buttonPanel"),
    CLOSE_LABEL: getByResouceId("android:id/button1"),
    NO_BUTTON: getByResouceId("android:id/button2"),
    TUTORIAL_SKIP_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/tutorial_skip_button"),
    PROGRESS_BAR: getByClassname("android.widget.ProgressBar"),
};

class K_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    async waitForWarningLablelIsShown () {
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

    get tutorialSkipButton () {
        return $(SELECTORS.TUTORIAL_SKIP_BUTTON);
    }

    get waitForProgressBarIsHidden () {
        return this.waitForElementIsShown(SELECTORS.PROGRESS_BAR, false);
    }
}

export default new K_FirstStartScreen();
