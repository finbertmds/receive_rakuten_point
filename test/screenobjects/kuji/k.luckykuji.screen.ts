import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/announcement"),
    OK_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/ok"),
};

class K_LuckyKujiScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get announcement () {
        return $(SELECTORS.DEFAULT_SELECTOR);
    }

    get okButton () {
        return $(SELECTORS.OK_BUTTON);
    }
}

export default new K_LuckyKujiScreen();
