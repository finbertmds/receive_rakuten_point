import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

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

    waitForDoneButtonIsShown () {
        return this.doneButton.waitForDisplayed({
            timeout: 30000,
            reverse: false,
        });
    }

    get closeButton () {
        return $(SELECTORS.CLOSE_BUTTON);
    }
}

export default new S_HomeGetPointScreen();
