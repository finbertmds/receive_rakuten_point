import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByText("今日のミッション"),

    UNREAD_MESSAGE_COUNT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/unreadMessageCount"),
    MESSAGE_LABEL: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/header_message_box"),

    HOME_TAB_LABEL: getByText("HOME"),
    KUJI_TAB_LABEL: getByText("くじ"),
    PLAY_MOVIE_ICON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/play_movie_icon"),

    AD_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/floating_btn"),
    AD_CLOSE_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/iv_close_button"),
    MISSIONS_ALERT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/missions"),

    MAIN_LAYOUT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/main_layout"),
    GROUP_KUJI: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/gridview_group_kuji"),
    CLOSEAPP_NO_BUTTON: getByText("いいえ"),

    START_PAGE_BG: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/start_page_bg"),
    GACHA_START_BUTTON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/gacha_start_btn"),
    GACHA_ANIMATION: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/gacha_animation"),
};

class K_HomeScreen extends AppScreen {
    constructor() {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get todayMission() {
        return $(SELECTORS.DEFAULT_SELECTOR);
    }

    get unreadMessageCount() {
        return $(SELECTORS.UNREAD_MESSAGE_COUNT);
    }

    get messageLabel() {
        return $(SELECTORS.MESSAGE_LABEL);
    }

    get homeTabLabel() {
        return $(SELECTORS.HOME_TAB_LABEL);
    }

    get kujiTabLabel() {
        return $(SELECTORS.KUJI_TAB_LABEL);
    }

    async waitForPlayMoviewIconIsShown() {
        return this.waitForElementIsShown(SELECTORS.PLAY_MOVIE_ICON);
    }

    get playMovieIcon() {
        return $(SELECTORS.PLAY_MOVIE_ICON);
    }

    async playMoviewIconDoneIsShown(): Promise<boolean> {
        if (await this.playMovieIcon.isExisting()) {
            let doneIcon = (await this.playMovieIcon.parent).$(getByResouceId("jp.co.rakuten.rakutenluckykuji:id/done_icon"));
            if (await doneIcon.isDisplayed()) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }

    get mainLayout() {
        return $(SELECTORS.MAIN_LAYOUT);
    }

    async waitForMainLayoutIsShown() {
        // return this.waitForElementIsShown(SELECTORS.MAIN_LAYOUT);
        return $(SELECTORS.MAIN_LAYOUT).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    async mainLayoutKujiList() {
        if (await this.mainLayout.isExisting()) {
            let kujiList = this.mainLayout.$$(getByClassname("android.widget.ImageView"));
            if (kujiList) {
                return kujiList;
            }
        }
        return null;
    }

    async mainLayoutKujiIndex(index: number) {
        let kujiList = await this.mainLayoutKujiList();
        if (kujiList === null) {
            return null;
        }
        if (kujiList.length > index) {
            let kujiElement = this.mainLayout.$(getByClassname("android.widget.ImageView", index));
            if (kujiElement) {
                return kujiElement;
            }
        }
        return null;
    }

    get closeAppNoButton() {
        return $(SELECTORS.CLOSEAPP_NO_BUTTON);
    }

    get groupKuji() {
        return $(SELECTORS.GROUP_KUJI);
    }

    async waitForGroupKujiIsShown() {
        return this.waitForElementIsShown(SELECTORS.GROUP_KUJI);
    }

    async groupKujiLastKuji() {
        if (await this.groupKuji.isExisting()) {
            let kujiElementList = await this.groupKuji.$$(getByClassname("android.widget.ImageView"));
            if (kujiElementList) {
                return kujiElementList[kujiElementList.length - 1];
            }
        }
        return null;
    }

    get startPageBg() {
        return $(SELECTORS.START_PAGE_BG);
    }

    get gachaStartButton() {
        return $(SELECTORS.GACHA_START_BUTTON);
    }

    get gachaAnimation() {
        return $(SELECTORS.GACHA_ANIMATION);
    }

    async handleStartGacha() {
        await browser.pause(5000);
        if (await (await this.startPageBg).isDisplayed()) {
            await (await this.gachaStartButton).click();
        } else {
            console.log("gacha is not showing");
            return;
        }
        await driver.pause(config.DEFAULT_TIMEOUT > 45000 ? 1.5 * config.DEFAULT_TIMEOUT : 45000);
        await driver.back();
        await browser.pause(10000);
    }
    
    async kujiLayoutKujiList() {
        if (await this.mainLayout.isExisting()) {
            let kujiList = this.mainLayout.$$(getByClassname("android.widget.ImageView"));
            if (kujiList) {
                return kujiList;
            }
        }
        return null;
    }

    get adButton() {
        return $(SELECTORS.AD_BUTTON);
    }

    get adCloseButton() {
        return $(SELECTORS.AD_CLOSE_BUTTON);
    }

    get missionAlert() {
        return $(SELECTORS.MISSIONS_ALERT);
    }
}

export default new K_HomeScreen();
