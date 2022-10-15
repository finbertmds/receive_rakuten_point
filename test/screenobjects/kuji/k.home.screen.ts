import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByText("今日のミッション"),
    
    UNREAD_MESSAGE_COUNT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/unreadMessageCount"),
    MESSAGE_LABEL: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/message"),

    HOME_TAB_LABEL: getByText("HOME"),
    PLAY_MOVIE_ICON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/play_movie_icon"),
    
    MAIN_LAYOUT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/main_layout"),
    GROUP_KUJI: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/gridview_group_kuji"),
    CLOSEAPP_NO_BUTTON: getByText("いいえ"),
};

class K_HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get todayMission () {
        return $(SELECTORS.DEFAULT_SELECTOR);
    }

    get unreadMessageCount () {
        return $(SELECTORS.UNREAD_MESSAGE_COUNT);
    }

    get messageLabel () {
        return $(SELECTORS.MESSAGE_LABEL);
    }

    get homeTabLabel () {
        return $(SELECTORS.HOME_TAB_LABEL);
    }

    async waitForPlayMoviewIconIsShown () {
        return this.waitForElementIsShown(SELECTORS.PLAY_MOVIE_ICON);
    }

    get playMovieIcon () {
        return $(SELECTORS.PLAY_MOVIE_ICON);
    }

    async playMoviewIconDoneIsShown (): Promise<boolean> {
        if (await this.playMovieIcon.isExisting()) {
            let doneIcon = (await this.playMovieIcon.parent).$(getByResouceId("jp.co.rakuten.rakutenluckykuji:id/done_icon"));
            if (await doneIcon.isDisplayed()) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }

    get mainLayout () {
        return $(SELECTORS.MAIN_LAYOUT);
    }

    async waitForMainLayoutIsShown () {
        // return this.waitForElementIsShown(SELECTORS.MAIN_LAYOUT);
        return $(SELECTORS.MAIN_LAYOUT).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    async mainLayoutKujiList () {
        if (await this.mainLayout.isExisting()) {
            let kujiList = this.mainLayout.$$(getByClassname("android.widget.ImageView"));
            if (kujiList) {
                return kujiList;
            }
        }
        return null;
    }

    async mainLayoutKujiIndex (index: number) {
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

    get closeAppNoButton () {
        return $(SELECTORS.CLOSEAPP_NO_BUTTON);
    }

    get groupKuji () {
        return $(SELECTORS.GROUP_KUJI);
    }

    async waitForGroupKujiIsShown () {
        return this.waitForElementIsShown(SELECTORS.GROUP_KUJI);
    }

    async groupKujiLastKuji () {
        if (await this.groupKuji.isExisting()) {
            let kujiElementList = await this.groupKuji.$$(getByClassname("android.widget.ImageView"));
            if (kujiElementList) {
                return kujiElementList[kujiElementList.length - 1];
            }
        }
        return null;
    }

}

export default new K_HomeScreen();
