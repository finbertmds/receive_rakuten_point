import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.recipe:id/action_bar_root"),
    START_LABEL: getByText("今すぐはじめる"),
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

}

export default new R_FirstStartScreen();
