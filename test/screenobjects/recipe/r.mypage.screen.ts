import { getByResouceId, getByTextInScrollable } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("android:id/content"),
    DEFAULT_SELECTOR_AFTER_LOGIN: getByResouceId("jp.co.rakuten.recipe:id/mypage_container"),
    NICKNAME_LABEL: getByResouceId("jp.co.rakuten.recipe:id/nickname"),
    USERNAME_LABEL: getByResouceId("jp.co.rakuten.recipe:id/user_name"),
    LOGIN_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/mypage_login"),
    MYPAGE_SETTING_MENU_CONTAINER: getByResouceId("jp.co.rakuten.recipe:id/mypage_setting_menu"),
    REWARD_BUTTON: getByTextInScrollable("jp.co.rakuten.recipe:id/action_bar_root", "楽天リワード（ポイントミッション）"),
};

class R_MyPageScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get nicknameLabel () {
        return $(SELECTORS.NICKNAME_LABEL);
    }

    get usernameLabel () {
        return $(SELECTORS.USERNAME_LABEL);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get rewardButton () {
        return $(SELECTORS.REWARD_BUTTON);
    }

}

export default new R_MyPageScreen();
