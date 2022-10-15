import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    MODAL_CONTAINER: getByResouceId("jp.co.rakuten.recipe:id/modal_layout"),
    CLOSE_BUTTON: "~close button",
    MODAL_NOT_SHOW_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/opt_out_checkbox"),
};

class S_HomeModalScreen extends AppScreen {
    constructor () {
        super(SELECTORS.MODAL_CONTAINER);
    }
    
    get modalContainer () {
        return $(SELECTORS.MODAL_CONTAINER);
    }
    
    get modalNotShowButton () {
        return $(SELECTORS.MODAL_NOT_SHOW_BUTTON);
    }
    
    get closeButton () {
        return $(SELECTORS.CLOSE_BUTTON);
    }
}

export default new S_HomeModalScreen();
