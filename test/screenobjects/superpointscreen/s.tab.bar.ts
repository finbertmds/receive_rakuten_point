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

    static async openSearch () {
        if (await this.bottomIconIsDisplayed()) {
            let searchTabbar = (await $(SELECTORS.BOTTOM_ICON)).$(
                './android.view.View/android.view.View/android.view.View/android.view.View[2]'
            );
            if (await (await searchTabbar).isDisplayed()) {
                await (await searchTabbar).click();
            }
        }
    }

    static async openChirashi () {
        if (await this.bottomIconIsDisplayed()) {
            let chirashiTabbar = (await $(SELECTORS.BOTTOM_ICON)).$(
                './android.view.View/android.view.View/android.view.View/android.view.View[3]'
            );
            if (await (await chirashiTabbar).isDisplayed()) {
                await (await chirashiTabbar).click();
            }
        }
    }

    static async openLuckyCoint () {
        if (await this.bottomIconIsDisplayed()) {
            let luckyCoinTabbar = (await $(SELECTORS.BOTTOM_ICON)).$(
                './android.view.View/android.view.View/android.view.View/android.view.View[4]'
            );
            if (await (await luckyCoinTabbar).isDisplayed()) {
                await (await luckyCoinTabbar).click();
            }
        }
    }

    static async waitForTabBarShown () {
        return $(SELECTORS.BOTTOM_ICON).waitForDisplayed({
            timeout: 3 * config.DEFAULT_TIMEOUT,
        });
    }
}
