import { getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/toolbar_app_logo"),
    LOGIN_BUTTON: getByResouceId("jp.co.rakuten.slide:id/vgl_button_login"),
    POINT_NUMBER_BUTTON: getByResouceId("jp.co.rakuten.slide:id/status_bar_point_num"),
    TODAY_POINT_LABEL: getByResouceId("jp.co.rakuten.slide:id/home_this_week_points_value"),
};

class S_HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    async waitForLoginButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.LOGIN_BUTTON);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get todayPointLabel () {
        return $(SELECTORS.TODAY_POINT_LABEL);
    }

    async pointNumberButtonList () {
        let pointNumberButton = await $$(SELECTORS.POINT_NUMBER_BUTTON);
        if (pointNumberButton.length > 0) {
            return pointNumberButton;
        }
        return null
    }
}

export default new S_HomeScreen();
