import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/announcement"),
    ENTRY_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/entry"),
    ANIMATION_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/animation"),
    OK_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/ok"),
};

class K_LuckyKujiScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get announcement () {
        return $(SELECTORS.DEFAULT_SELECTOR);
    }

    get entry () {
        return $(SELECTORS.ENTRY_SELECTOR);
    }

    get animation () {
        return $(SELECTORS.ANIMATION_SELECTOR);
    }

    get okButton () {
        return $(SELECTORS.OK_BUTTON);
    }
}

export default new K_LuckyKujiScreen();
