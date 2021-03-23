import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    HOME_SCREEN: getByResouceId("android:id/content"),
    TOOLBAR_ELEMENT: getByResouceId("rakuten-toolbar"),
    NOTIFICATION_SETTING_LABEL: getByText("通知設定"),
    NOTIFICATION_YES_BUTTON: getByText("はい"),
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

    waitForRakutenNameLableIsShown (): boolean | void {
        return $(SELECTORS.RAKUTEN_NAME_LABLEL).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    waitForNotificationSettingLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.NOTIFICATION_SETTING_LABEL);
    }

    get notificationSettingLabel () {
        return $(SELECTORS.NOTIFICATION_SETTING_LABEL);
    }

    get notificationYesButon () {
        return $(SELECTORS.NOTIFICATION_YES_BUTTON);
    }

    get notificationSettingOnLabel () {
        return $(SELECTORS.NOTIFICATION_SETTING_ON_LABEL);
    }

    waitForOkButtonIsShown () {
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

    waitForRakutenRewardLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.RAKUTEN_REWARD_LABEL);
    }

    get rakutenRewardLabel () {
        return $(SELECTORS.RAKUTEN_REWARD_LABEL);
    }

    get rakutenRewardNumberLabel () {
        if (this.rakutenRewardLabel.isExisting()) {
            // logo text: pointclub_logo
            let rakutenRewardNumber = this.rakutenRewardLabel.parent.$(getByClassname("android.view.View", 1)).$(getByClassname("android.widget.TextView"));
            if (rakutenRewardNumber.isExisting()) {
                return rakutenRewardNumber;
            }
        }
        return null;
    }

    get pointHistoryIcon () {
        return $(SELECTORS.POINT_HISTORY_ICON);
    }

    waitForPointHistoryIsShown () {
        return this.waitForElementIsShown(SELECTORS.POINT_HISTORY_ICON);
    }

    get webCloseButton () {
        return $(SELECTORS.WEB_CLOSE_BUTTON);
    }

    waitForWebCloseButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.WEB_CLOSE_BUTTON);
    }

    get firstAdBanner () {
        let adBannerList = $(SELECTORS.AD_BANNER);
        if (adBannerList.isDisplayed()) {
            return adBannerList.$(getByClassname("android.widget.Image"));
        }
        return null;
    }

    waitForAdBannerIsShown () {
        return this.waitForElementIsShown(SELECTORS.AD_BANNER);
    }

    get webCloseTabButton () {
        return $(SELECTORS.WEB_CLOSE_TAB_BUTTON);
    }

    waitForWebCloseTabButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.WEB_CLOSE_TAB_BUTTON);
    }

}

export default new PC_HomeScreen();
