import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    REWARD_SCREEN: getByText("Home"),
    REQUIRE_LOGIN_LABEL: getByText("[Rakuten]Login"),
    LOGIN_INPUT: getByResouceId("username"),
    LOGIN_PASSWORD: getByResouceId("password"),
    LOGIN_BUTTON: getByText("Login"),
    NEED_ONE_MORE_TIME_LOGIN_BUTTON: getByText("ログインする"),
    RETRY_LABEL: getByText("再試行"),
    SUGGEST_PRODUCT_LABEL: getByText("あなたにおすすめの商品"),
    /** Unclaimed Points tabbar */
    UNCLAIM_BOX: getByText("Unclaimed Points"),
    // UNCLAIM_BOX: getByResouceId("unclaim-box"),
    UNCLAIM_LIST: getByResouceId("unclaimed-list"),
    UNCLAIM_LIST_ITEMS: getByResouceId("unclaimed-list-items"),

    GET_POINT_DONE_LABEL: getByResouceId("claimads-claimend"),
};

class R_RewardScreen extends AppScreen {
    constructor () {
        super(SELECTORS.REWARD_SCREEN);
    }

    get suggestProductLabel () {
        return $(SELECTORS.SUGGEST_PRODUCT_LABEL);
    }

    get retryLabel () {
        return $(SELECTORS.RETRY_LABEL);
    }

    get needLoginButton () {
        return $(SELECTORS.NEED_ONE_MORE_TIME_LOGIN_BUTTON);
    }

    get unclaimBox () {
        return $(SELECTORS.UNCLAIM_BOX);
    }

    async waitForUnclaimBoxIsShown () {
        return $(SELECTORS.UNCLAIM_BOX).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    async waitForSuggestProductIsShown () {
        return this.waitForElementIsShown(SELECTORS.SUGGEST_PRODUCT_LABEL);
    }

    async waitForUnclaimListIsShown () {
        return this.waitForElementIsShown(SELECTORS.UNCLAIM_LIST);
    }

    get getUnclaimList () {
        return $(SELECTORS.UNCLAIM_LIST);
    }

    async waitForUnclaimListItemsIsShown () {
        if (await this.getUnclaimList.isExisting()) {
            return this.getUnclaimList.$(SELECTORS.UNCLAIM_LIST_ITEMS).waitForDisplayed({
                timeout: config.DEFAULT_TIMEOUT,
                reverse: false,
            });
        }
    }

    async getUnclaimListItems () {
        if (await this.getUnclaimList.isExisting()) {
            return this.getUnclaimList.$$(SELECTORS.UNCLAIM_LIST_ITEMS);
        }
        return null;
    }

    async getUnclaimListIndexButton (index: number) {
        let unclaimListItems = await this.getUnclaimListItems();
        if (unclaimListItems === null) {
            return null;
        }
        if (unclaimListItems.length > index) {
            return unclaimListItems[index].$(getByClassname("android.widget.Button"));
        }
    }

    async getButtonCountInHeader () {
        return (await $(SELECTORS.REWARD_SCREEN).parent).$$(getByClassname("android.widget.ImageButton")).length;
    }

    async waitForGetPointDoneLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.GET_POINT_DONE_LABEL);
    }

    get getPointDoneLabel () {
        return $(SELECTORS.GET_POINT_DONE_LABEL);
    }

    async closeButton () {
        return (await $(SELECTORS.REWARD_SCREEN).parent).$(getByClassname("android.widget.ImageButton", await this.getButtonCountInHeader() - 1));
    }

    async backButton () {
        return (await $(SELECTORS.REWARD_SCREEN).parent).$(getByClassname("android.widget.ImageButton", 0));
    }

    get requireLoginLabel () {
        return $(SELECTORS.REQUIRE_LOGIN_LABEL);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get userid () {
        return $(SELECTORS.LOGIN_INPUT);
    }

    get password () {
        return $(SELECTORS.LOGIN_PASSWORD);
    }

    async waitForLoggedIn () {
        return $(SELECTORS.LOGIN_INPUT).waitForDisplayed({
            timeout: 15 * config.DEFAULT_TIMEOUT,
            reverse: true,
        });
    }
}

export default new R_RewardScreen();
