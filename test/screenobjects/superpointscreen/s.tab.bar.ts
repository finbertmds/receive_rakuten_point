import config from "../../../config";
import { getByClassname, getByResouceId } from "../../helpers/UiSelectorHelper";

const SELECTORS = {
    BOTTOM_ICON: getByResouceId("jp.co.rakuten.slide:id/app_bottom_bar"),
    HOME_ICON: "~Home",
    LUCKY_COINT_ICON: getByResouceId("jp.co.rakuten.slide:id/lucky_coin"),
    POINT_HISTORY_ICON: getByResouceId("jp.co.rakuten.slide:id/point_history"),
};

export default class S_TabBar {
    static async bottomIconIsDisplayed () {
        if (await (await $(SELECTORS.BOTTOM_ICON)).isExisting()) {
            return await (await $(SELECTORS.BOTTOM_ICON)).isDisplayed();
        }
        return false;
    }

    static async openLuckyCoint () {
        let luckyCoinTabbar = (await $(SELECTORS.BOTTOM_ICON)).$(getByClassname("android.view.View", 6));
        if (await (await luckyCoinTabbar).isDisplayed()) {
            await (await luckyCoinTabbar).click();
        }
    }

    static async waitForTabBarShown () {
        return $(SELECTORS.BOTTOM_ICON).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
        });
    }
}
