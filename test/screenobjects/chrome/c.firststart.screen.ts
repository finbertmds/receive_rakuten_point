import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    FIRSTSTSRT_SCREEN: getByResouceId("android:id/content"),
    ACCEPT_CONTINUE_BUTTON: getByResouceId("com.android.chrome:id/terms_accept"),
    NO_THANKS_BUTTON: getByResouceId("com.android.chrome:id/negative_button"),
};

class PC_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.FIRSTSTSRT_SCREEN);
    }

    get acceptContinueButton () {
        return $(SELECTORS.ACCEPT_CONTINUE_BUTTON);
    }

    get noThanksButton () {
        return $(SELECTORS.NO_THANKS_BUTTON);
    }

}

export default new PC_FirstStartScreen();
