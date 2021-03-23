import config from '../../../config';
import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    ALERT_CONTAINER: getByResouceId("jp.co.rakuten.slide:id/container"),
    ALERT_CONTAINER_MESSAGE: getByResouceId("jp.co.rakuten.slide:id/message"),
    ALERT_CONTAINER_BUTTON: getByResouceId("jp.co.rakuten.slide:id/button"),
};

class S_HomeAlertScreen extends AppScreen {
    constructor () {
        super(SELECTORS.ALERT_CONTAINER);
    }

    get alertContainer () {
        return $(SELECTORS.ALERT_CONTAINER);
    }

    get alertContainerMessage () {
        return $(SELECTORS.ALERT_CONTAINER).$(SELECTORS.ALERT_CONTAINER_MESSAGE);
    }

    get alertContainerOkButton () {
        return $(SELECTORS.ALERT_CONTAINER).$(SELECTORS.ALERT_CONTAINER_BUTTON);
    }

    waitForMessageIsChanged (preMessage: string) {
        return this.alertContainerMessage.waitUntil(function () {
            return this.getText() !== preMessage;
        }, {
            timeout: config.DEFAULT_TIMEOUT,
            timeoutMsg: 'expected text to change after 5s'
        });
    }
}

export default new S_HomeAlertScreen();
