import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    FIRSTSTSRT_SCREEN: getByResouceId("android:id/content"),
    WARNING_LABEL: getByText("警告"),
    NEVER_DISPLAY_CHECKBOX: getByResouceId("never-display"),
    CLOSE_LABEL: getByText("閉じる"),
    SKIP_BUTTON: getByText("SKIP"),
};

class PC_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.FIRSTSTSRT_SCREEN);
    }

    get warningLabel () {
        return $(SELECTORS.WARNING_LABEL);
    }

    get neverDisplayCheckbox () {
        return $(SELECTORS.NEVER_DISPLAY_CHECKBOX);
    }

    get closeLabel () {
        return $(SELECTORS.CLOSE_LABEL);
    }

    get skipButon () {
        return $(SELECTORS.SKIP_BUTTON);
    }
}

export default new PC_FirstStartScreen();
