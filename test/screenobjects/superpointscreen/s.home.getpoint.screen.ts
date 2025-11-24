import { driver } from '@wdio/globals';
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
        let clickedAfterTime = new Date();
        await driver.waitUntil(async () => {
            try {
                let now = new Date();
                let diffMs = (now.valueOf() - clickedAfterTime.valueOf());
                let isDone = await (await this.doneButton).isDisplayed();
                if (isDone) {
                    console.log(`done is displayed`);
                    return true;
                }
                if (diffMs >= 2 * config.DEFAULT_TIMEOUT - 5000) {
                    console.log(`diffMs greater than timeout`);
                    return true;
                }
                console.log(`diffMs less than timeout`);
                return false;
            } catch (error) {
                return true;
            }
        },
            {
                timeout: config.DEFAULT_TIMEOUT * 2,
                timeoutMsg: 'expected done is displayed',
                interval: 5000
            })
        // return this.doneButton.waitForDisplayed({
        //     timeout: 2 * config.DEFAULT_TIMEOUT,
        //     reverse: false,
        // });
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
