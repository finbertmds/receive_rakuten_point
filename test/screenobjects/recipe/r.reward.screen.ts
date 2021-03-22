import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    REWARD_SCREEN: getByText("楽天リワード"),
    NEED_ONE_MORE_TIME_LOGIN_BUTTON: getByText("ログインする"),
    RETRY_LABEL: getByText("再試行"),
    SUGGEST_PRODUCT_LABEL: getByText("おすすめ商品とおトク情報"),
    UNCLAIM_BOX: getByResouceId("unclaim-box"),
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

    waitForUnclaimBoxIsShown () {
        return $(SELECTORS.UNCLAIM_BOX).waitForDisplayed({
            timeout: 10000,
            reverse: false,
        });
    }

    waitForSuggestProductIsShown () {
        return this.waitForElementIsShown(SELECTORS.SUGGEST_PRODUCT_LABEL);
    }

    waitForUnclaimListIsShown () {
        return this.waitForElementIsShown(SELECTORS.UNCLAIM_LIST);
    }

    get getUnclaimList () {
        return $(SELECTORS.UNCLAIM_LIST);
    }

    get getUnclaimListItems () {
        if (this.getUnclaimList.isExisting()) {
            return this.getUnclaimList.$$(SELECTORS.UNCLAIM_LIST_ITEMS);
        }
        return null;
    }

    getUnclaimListIndexButton (index: number) {
        let unclaimListItems =  this.getUnclaimListItems;
        if (unclaimListItems === null) {
            return null;
        }
        if (unclaimListItems.length > index) {
            return unclaimListItems[index].$(getByClassname("android.widget.Button"));
        }
    }

    getButtonCountInHeader () {
        return $(SELECTORS.REWARD_SCREEN).parent.$$(getByClassname("android.widget.ImageButton")).length;
    }

    waitForGetPointDoneLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.GET_POINT_DONE_LABEL);
    }

    get getPointDoneLabel () {
        return $(SELECTORS.GET_POINT_DONE_LABEL);
    }

    get closeButton () {
        return $(SELECTORS.REWARD_SCREEN).parent.$(getByClassname("android.widget.ImageButton", this.getButtonCountInHeader() - 1));
    }

    get backButton () {
        return $(SELECTORS.REWARD_SCREEN).parent.$(getByClassname("android.widget.ImageButton", 0));
    }
}

export default new R_RewardScreen();
