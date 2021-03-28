import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByText("今日のミッション"),
    
    UNREAD_MESSAGE_COUNT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/unreadMessageCount"),
    MESSAGE_LABEL: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/message"),

    PLAY_MOVIE_ICON: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/play_movie_icon"),
    
    MAIN_LAYOUT: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/main_layout"),
    GROUP_KUJI: getByResouceId("jp.co.rakuten.rakutenluckykuji:id/gridview_group_kuji"),

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

    waitForPlayMoviewIconIsShown () {
        return this.waitForElementIsShown(SELECTORS.PLAY_MOVIE_ICON);
    }

    get playMovieIcon () {
        return $(SELECTORS.PLAY_MOVIE_ICON);
    }

    get playMoviewIconDoneIsShown () {
        if (this.playMovieIcon.isExisting()) {
            let doneIcon = this.playMovieIcon.parent.$(getByResouceId("jp.co.rakuten.rakutenluckykuji:id/done_icon"));
            if (doneIcon.isDisplayed()) {
                return true;
            }
        }
        return false;
    }

    get mainLayout () {
        return $(SELECTORS.MAIN_LAYOUT);
    }

    waitForMainLayoutIsShown () {
        return this.waitForElementIsShown(SELECTORS.MAIN_LAYOUT);
    }

    get mainLayoutKujiList () {
        if (this.mainLayout.isExisting()) {
            let kujiList = this.mainLayout.$$(getByClassname("android.widget.ImageView"));
            if (kujiList) {
                return kujiList;
            }
        }
        return null;
    }

    get groupKuji () {
        return $(SELECTORS.GROUP_KUJI);
    }

    waitForGroupKujiIsShown () {
        return this.waitForElementIsShown(SELECTORS.GROUP_KUJI);
    }

    get groupKujiLastKuji () {
        if (this.groupKuji.isExisting()) {
            let kujiElementList = this.groupKuji.$$(getByClassname("android.widget.ImageView"));
            if (kujiElementList) {
                return kujiElementList[kujiElementList.length - 1];
            }
        }
        return null;
    }

}

export default new K_HomeScreen();
