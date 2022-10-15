import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/toolbar"),
    // DONE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/circlecheck"),
    DONE_BUTTON: getByText("Done"),
    CLOSE_BUTTON: "~close",
};

class S_HomeGetPointScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get doneButton () {
        return $(SELECTORS.DONE_BUTTON);
    }

    async waitForDoneButtonIsShown () {
        return this.doneButton.waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get closeButton () {
        return $(SELECTORS.CLOSE_BUTTON);
    }
}

export default new S_HomeGetPointScreen();
