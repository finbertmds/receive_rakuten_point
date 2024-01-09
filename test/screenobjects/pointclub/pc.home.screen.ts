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

    RAKUTEN_NAME_LABLEL: getByResouceId("jp.co.rakuten.pointclub.android:id/tv_mem_name"),
    MENU_NAVIGATION_BUTTON: getByClassname("android.widget.ImageButton"),
    // RAKUTEN_REWARD_LABEL: getByClassnameAndText("android.widget.Image", "ic_rakutenreward"),
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

    async waitForRakutenNameLableIsShown () {
        return $(SELECTORS.RAKUTEN_NAME_LABLEL).waitForDisplayed({
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

    get rakutenNameLabel () {
        return $(SELECTORS.RAKUTEN_NAME_LABLEL);
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

}

export default new PC_HomeScreen();
