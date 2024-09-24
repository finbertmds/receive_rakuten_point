import config from "../../../config";
import { getByClassname, getByResouceId } from "../../helpers/UiSelectorHelper";

const SELECTORS = {
    BOTTOM_ICON: getByResouceId("jp.co.rakuten.slide:id/app_bottom_bar"),
    HOME_ICON: "~Home",
    LUCKY_COINT_ICON: getByResouceId("jp.co.rakuten.slide:id/lucky_coin"),
    POINT_HISTORY_ICON: getByResouceId("jp.co.rakuten.slide:id/point_history"),
};

export default class S_TabBar {
    static async openLuckyCoint () {
        await $(SELECTORS.LUCKY_COINT_ICON).click();
        let luckyCoinTabbar = (await $(SELECTORS.BOTTOM_ICON)).$(getByClassname("android.view.View", 3));
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
