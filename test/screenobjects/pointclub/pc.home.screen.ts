import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    HOME_SCREEN: getByResouceId("android:id/content"),
    TOOLBAR_ELEMENT: getByResouceId("rakuten-toolbar"),
    NOTIFICATION_UPDATE_LABEL: getByText("お知らせ"),
    NOTIFICATION_SETTING_LABEL: getByText("通知設定"),
    NOTIFICATION_NO_BUTTON: getByText("いいえ"),
    NOTIFICATION_SETTING_ON_LABEL: getByText("プッシュ通知を許可設定しました"),
    NOTIFICATION_OK_BUTTON: getByText("OK"),

    RAKUTEN_NAME_LABLEL: getByResouceId("member-rank__user-info"),
    MENU_NAVIGATION_BUTTON: getByClassname("android.view.View"),
    // RAKUTEN_REWARD_LABEL: getByClassnameAndText("android.widget.Image", "ic_rakutenreward"),
    RAKUTEN_REWARD_LABEL: getByText("楽天リワード (ポイントミッション)"),

    POINT_HISTORY_ICON: getByResouceId("point-history-icon"),
    WEB_CLOSE_BUTTON: "~Close Button",

    AD_BANNER: getByResouceId("banner-carousels"),
    WEB_CLOSE_TAB_BUTTON: "~Close tab",
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

    get notificationSettingOnLabel () {
        return $(SELECTORS.NOTIFICATION_SETTING_ON_LABEL);
    }

    async waitForOkButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.NOTIFICATION_OK_BUTTON);
    }

    get notificationOkButon () {
        return $(SELECTORS.NOTIFICATION_OK_BUTTON);
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
            let rakutenRewardNumber = this.rakutenRewardLabel.parent.$(getByClassname("android.view.View", 1)).$(getByClassname("android.widget.TextView"));
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

    get webCloseButton () {
        return $(SELECTORS.WEB_CLOSE_BUTTON);
    }

    async waitForWebCloseButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.WEB_CLOSE_BUTTON);
    }

    async firstAdBanner () {
        let adBannerList = $(SELECTORS.AD_BANNER);
        if (await adBannerList.isDisplayed()) {
            return adBannerList.$(getByClassname("android.widget.Image"));
        }
        return null;
    }

    async waitForAdBannerIsShown () {
        return this.waitForElementIsShown(SELECTORS.AD_BANNER);
    }

    get webCloseTabButton () {
        return $(SELECTORS.WEB_CLOSE_TAB_BUTTON);
    }

    async waitForWebCloseTabButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.WEB_CLOSE_TAB_BUTTON);
    }

}

export default new PC_HomeScreen();
