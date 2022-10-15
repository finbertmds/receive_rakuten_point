import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    FIRSTSTSRT_SCREEN: getByResouceId("android:id/content"),
    SKIP_BUTTON: getByResouceId("jp.co.rakuten.slide:id/atv2_button_skip"),
    MAINTENANCE_CONTAINER: getByResouceId("jp.co.rakuten.slide:id/activity_maintenance_v2_constraint_container"),
};

class S_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.FIRSTSTSRT_SCREEN);
    }

    get skipButon () {
        return $(SELECTORS.SKIP_BUTTON);
    }

    get maintenanceContainer () {
        return $(SELECTORS.MAINTENANCE_CONTAINER);
    }
}

export default new S_FirstStartScreen();
