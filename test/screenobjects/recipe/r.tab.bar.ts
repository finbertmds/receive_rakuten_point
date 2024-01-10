import config from "../../../config";
import { getByResouceId } from "../../helpers/UiSelectorHelper";

const SELECTORS = {
    BOTTOM_ICON: getByResouceId("jp.co.rakuten.recipe:id/bottom_navigation_small_item_icon"),
};

export default class R_TabBar {
    static async openHome () {
        await $$(SELECTORS.BOTTOM_ICON)[0].click();
    }

    static async openMyPage () {
        await $$(SELECTORS.BOTTOM_ICON)[5].click();
    }

    static async waitForTabBarShown () {
        return $(SELECTORS.BOTTOM_ICON).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
        });
    }
}
