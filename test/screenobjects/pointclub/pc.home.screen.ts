import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    HOME_SCREEN: getByResouceId("android:id/content"),
    TOOLBAR_ELEMENT: getByResouceId("jp.co.rakuten.pointclub.android:id/toolbar"),
    NOTIFICATION_UPDATE_LABEL: getByText("お知らせ"),
    NOTIFICATION_SETTING_LABEL: getByResouceId("android:id/alertTitle"),
    NOTIFICATION_NO_BUTTON: getByResouceId("android:id/button2"),

    CUSTOM_PANEL: getByResouceId("android:id/customPanel"),
    CLOSE_CUSTOM_PANEL: getByResouceId("jp.co.rakuten.pointclub.android:id/iv_close"),
    CLOSE_CUSTOM_PANEL2: getByResouceId("jp.co.rakuten.pointclub.android:id/iv_cross"),

    RAKUTEN_ALL_TIME_POINT_LABLEL: getByResouceId("jp.co.rakuten.pointclub.android:id/tv_all_time_point"),
    MENU_NAVIGATION_BUTTON: getByClassname("android.widget.ImageButton"),
    // RAKUTEN_REWARD_LABEL: getByClassnameAndText("android.widget.Image", "ic_rakutenreward"),

    MENU_NAVIGATION_HOME: getByResouceId("jp.co.rakuten.pointclub.android:id/nav_home"),
    MENU_NAVIGATION_EARN: getByResouceId("jp.co.rakuten.pointclub.android:id/nav_earn"),
    MENU_NAVIGATION_DEPOSIT: getByResouceId("jp.co.rakuten.pointclub.android:id/nav_deposit"),
    MENU_NAVIGATION_USE: getByResouceId("jp.co.rakuten.pointclub.android:id/nav_use"),
    MENU_NAVIGATION_HISTORY: getByResouceId("jp.co.rakuten.pointclub.android:id/nav_history"),
    
    /** Point Mission */
    RAKUTEN_REWARD_LABEL: getByResouceId("jp.co.rakuten.pointclub.android:id/menu_point_mission"),
    /** Point History Report Button */
    POINT_HISTORY_ICON: getByResouceId("jp.co.rakuten.pointclub.android:id/tv_point_history"),

    AD_BANNER_GROUP: getByResouceId("jp.co.rakuten.pointclub.android:id/evolve_discover_main_view"),
    AD_BANNER_1: getByResouceId("jp.co.rakuten.pointclub.android:id/iv_banner"),
};

class PC_HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    async waitForRakutenAllTimePointLableIsShown () {
        return $(SELECTORS.RAKUTEN_ALL_TIME_POINT_LABLEL).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get notificationUpdateLabel () {
        return $(SELECTORS.NOTIFICATION_UPDATE_LABEL);
    }

    async waitForNotificationSettingLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.NOTIFICATION_SETTING_LABEL);
    }

    get notificationSettingLabel () {
        return $(SELECTORS.NOTIFICATION_SETTING_LABEL);
    }

    get notificationNoButon () {
        return $(SELECTORS.NOTIFICATION_NO_BUTTON);
    }

    get customPanel () {
        return $(SELECTORS.CUSTOM_PANEL);
    }

    get closeCustomPanelButon () {
        return $(SELECTORS.CLOSE_CUSTOM_PANEL);
    }

    get closeCustomPanel2Buton () {
        return $(SELECTORS.CLOSE_CUSTOM_PANEL2);
    }

    get rakutenAllTimePointLabel () {
        return $(SELECTORS.RAKUTEN_ALL_TIME_POINT_LABLEL);
    }

    get menuNavigationButton () {
        return $(SELECTORS.TOOLBAR_ELEMENT).$(SELECTORS.MENU_NAVIGATION_BUTTON);
    }

    async waitForRakutenRewardLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.RAKUTEN_REWARD_LABEL);
    }

    get rakutenRewardLabel () {
        return $(SELECTORS.RAKUTEN_REWARD_LABEL);
    }

    async rakutenRewardNumberLabel () {
        if (await this.rakutenRewardLabel.isExisting()) {
            // logo text: pointclub_logo
            let rakutenRewardNumber = (await this.rakutenRewardLabel.parent).$(getByClassname("android.view.View", 1)).$(getByClassname("android.widget.TextView"));
            if (await rakutenRewardNumber.isExisting()) {
                return rakutenRewardNumber;
            }
        }
        return null;
    }

    get pointHistoryIcon () {
        return $(SELECTORS.POINT_HISTORY_ICON);
    }

    async waitForPointHistoryIsShown () {
        return this.waitForElementIsShown(SELECTORS.POINT_HISTORY_ICON);
    }

    get adBannerGroup () {
        return $(SELECTORS.AD_BANNER_GROUP);
    }

    async firstAdBanner () {
        let adBannerList = $(SELECTORS.AD_BANNER_GROUP);
        if (await adBannerList.isDisplayed()) {
            return adBannerList.$(SELECTORS.AD_BANNER_1);
        }
        return null;
    }

    async waitForAdBannerIsShown () {
        return this.waitForElementIsShown(SELECTORS.AD_BANNER_GROUP);
    }

    get menuNavigationHome () {
        return $(SELECTORS.MENU_NAVIGATION_HOME);
    }

    get menuNavigationEarn () {
        return $(SELECTORS.MENU_NAVIGATION_EARN);
    }

    get menuNavigationDeposit () {
        return $(SELECTORS.MENU_NAVIGATION_DEPOSIT);
    }

    get menuNavigationUse () {
        return $(SELECTORS.MENU_NAVIGATION_USE);
    }

    get menuNavigationHistory () {
        return $(SELECTORS.MENU_NAVIGATION_HISTORY);
    }

}

export default new PC_HomeScreen();
