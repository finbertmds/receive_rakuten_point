import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    FIRSTSTSRT_SCREEN: getByResouceId("android:id/content"),
    SKIP_BUTTON: getByResouceId("jp.co.rakuten.slide:id/atv2_button_skip"),
};

class S_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.FIRSTSTSRT_SCREEN);
    }

    get skipButon () {
        return $(SELECTORS.SKIP_BUTTON);
    }
}

export default new S_FirstStartScreen();
