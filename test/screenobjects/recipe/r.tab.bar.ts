import { getByResouceId } from "../../helpers/UiSelectorHelper";

const SELECTORS = {
    BOTTOM_ICON: getByResouceId("jp.co.rakuten.recipe:id/bottom_navigation_small_item_icon"),
};

export default class R_TabBar {
    static openHome () {
        $$(SELECTORS.BOTTOM_ICON)[0].click();
    }

    static openSearch () {
        $$(SELECTORS.BOTTOM_ICON)[1].click();
    }

    static openHistory () {
        $$(SELECTORS.BOTTOM_ICON)[2].click();
    }

    static openBookmark () {
        $$(SELECTORS.BOTTOM_ICON)[3].click();
    }

    static openMyPage () {
        $$(SELECTORS.BOTTOM_ICON)[4].click();
    }

    static waitForTabBarShown () {
        $(SELECTORS.BOTTOM_ICON).waitForDisplayed({
            timeout: 20000,
        });
    }
}
