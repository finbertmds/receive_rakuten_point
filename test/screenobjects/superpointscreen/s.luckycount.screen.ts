import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/nav_host_fragment"),
    GET_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_get"),
    GET_DONE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/ok"),
    PLAY_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_play"),
    PLAY_ICON: getByResouceId("jp.co.rakuten.slide:id/play_icon"),
    CLOSE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/close"),
    CLOSE_AD_BUTTON: getByResouceId("dismiss-button"),
    REWARD_GRANTED_TEXT: getByText("Reward granted"),

    CHALLENGE_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_challenge"),
    CHALLENGE_PLAY_BUTTON: getByResouceId("jp.co.rakuten.slide:id/btn_play"),
    CHALLENGE_CARD_BUTTON: getByResouceId("jp.co.rakuten.slide:id/card" + String(Math.floor(Math.random() * 4) + 1)),
    VIEW_FULL_SCREEN_OK: getByResouceId("android:id/ok"),
    
    ALERT_CLOSE_BUTTON: getByClassname("android.widget.FrameLayout", 3),
    ALERT_CONTENT: getByResouceId("alrtb_ssp_centered_content"),
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

    get closeAdButton () {
        return $(SELECTORS.CLOSE_AD_BUTTON)
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

    get alertContent () {
        return $(SELECTORS.ALERT_CONTENT)
    }

    get alertCloseButton () {
        return $(SELECTORS.ALERT_CLOSE_BUTTON)
    }

    get rewardGrantedText () {
        return $(SELECTORS.REWARD_GRANTED_TEXT)
    }

    async waitForRewardGrantedTextIsShown () {
        try {
            await this.rewardGrantedText.waitForDisplayed({ timeout: 90000 });
        } catch (error) {
            console.log("Reward granted text not found");
        }
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
