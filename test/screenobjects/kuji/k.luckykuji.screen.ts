import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/announcement"),
    ENTRY_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/entry"),
    ANIMATION_SELECTOR: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/animation"),
    OK_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/ok"),

    KAGI_AREA: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/kagi_area"),
    KAGI_AREA_01: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/header_kagi_01"),
    // android.widget.ImageView
    TREASURE_DIALOG: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/treasure_dialog_bg"),
    TREASURE_PLAY_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/play_button"),
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

    get kagiArea () {
        return $(SELECTORS.KAGI_AREA);
    }

    get kagiArea01 () {
        return $(SELECTORS.KAGI_AREA_01);
    }

    get treasureDialog () {
        return $(SELECTORS.TREASURE_DIALOG);
    }

    get treasurePlayButton () {
        return $(SELECTORS.TREASURE_PLAY_BUTTON);
    }
}

export default new K_LuckyKujiScreen();
