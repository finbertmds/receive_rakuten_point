import { getByResouceId } from "../../helpers/UiSelectorHelper";

const SELECTORS = {
    BOTTOM_ICON: getByResouceId("jp.co.rakuten.slide:id/bottom_nav_view"),
    HOME_ICON: "~Home",
    LUCKY_COINT_ICON: getByResouceId("jp.co.rakuten.slide:id/lucky_coin"),
    POINT_HISTORY_ICON: getByResouceId("jp.co.rakuten.slide:id/point_history"),
};

export default class S_TabBar {
    static openHome () {
        $(SELECTORS.BOTTOM_ICON).click();
    }

    static openLuckyCoint () {
        $(SELECTORS.LUCKY_COINT_ICON).click();
    }

    static openPointHistory () {
        $(SELECTORS.POINT_HISTORY_ICON).click();
    }

    static waitForTabBarShown () {
        $(SELECTORS.BOTTOM_ICON).waitForDisplayed({
            timeout: 20000,
        });
    }
}
