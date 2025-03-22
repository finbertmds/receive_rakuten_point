import config from '../../../config';
import { getByClassname, getByResouceId } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/nav_host_fragment"),
    GET_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_get"),
    GET_DONE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/ok"),
    PLAY_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_play"),
    PLAY_ICON: getByResouceId("jp.co.rakuten.slide:id/play_icon"),
    CLOSE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/close"),
    CLOSE_AD_BUTTON: getByClassname("android.widget.ImageButton"),

    CHALLENGE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_challenge"),
    CHALLENGE_PLAY_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_play"),
    CHALLENGE_CARD_BUTTON: getByResouceId("jp.co.rakuten.slide:id/card" + String(Math.floor(Math.random() * 4) + 1)),
    VIEW_FULL_SCREEN_OK: getByResouceId("android:id/ok"),
};

class R_LuckyCointScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get getButton () {
        return $(SELECTORS.GET_BUTTON)
    }

    get getDoneButton () {
        return $(SELECTORS.GET_DONE_BUTTON)
    }

    async waitForGetDoneButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.GET_DONE_BUTTON);
    }

    get playButton () {
        return $(SELECTORS.PLAY_BUTTON)
    }

    get playIcon () {
        return $(SELECTORS.PLAY_ICON)
    }

    get closeButton () {
        return $(SELECTORS.CLOSE_BUTTON)
    }

    async waitForPlayIconIsShown () {
        return this.playIcon.waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get challengeButton () {
        return $(SELECTORS.CHALLENGE_BUTTON)
    }

    get viewFullScreenOK () {
        return $(SELECTORS.VIEW_FULL_SCREEN_OK)
    }

    async waitForChallengePlayButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.CHALLENGE_PLAY_BUTTON);
    }

    get challengePlayButton () {
        return $(SELECTORS.CHALLENGE_PLAY_BUTTON)
    }

    async waitForChallengeCardIsShown () {
        return this.waitForElementIsShown(SELECTORS.CHALLENGE_CARD_BUTTON);
    }

    get challengeCard () {
        return $(SELECTORS.CHALLENGE_CARD_BUTTON)
    }
}

export default new R_LuckyCointScreen();
