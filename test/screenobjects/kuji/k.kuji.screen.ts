import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/setting"),

    GROUP_KUJI: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/kuji_item_cell"),
};

class K_HomeScreen extends AppScreen {
    constructor() {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get kujiListLabel() {
        return $(SELECTORS.DEFAULT_SELECTOR);
    }

    get groupKuji() {
        return $$(SELECTORS.GROUP_KUJI);
    }
}

export default new K_HomeScreen();
