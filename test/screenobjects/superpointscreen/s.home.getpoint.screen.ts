import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/toolbar"),
    // DONE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/circlecheck"),
    DONE_BUTTON: getByText("Done"),
    CLOSE_BUTTON: "~close",
    NEXT_BUTTON: getByText("Next"),
    AD_CARD_OPEN_TEXT: getByResouceId("jp.co.rakuten.slide:id/ad_card_open_text"),
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

    get nextButton () {
        return $(SELECTORS.NEXT_BUTTON);
    }

    get adCardOpenText () {
        return $(SELECTORS.AD_CARD_OPEN_TEXT);
    }
}

export default new S_HomeGetPointScreen();
