import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/constraint_layout"),
    LOGIN_BUTTON: getByText("LOGIN"),
    POINT_NUMBER_BUTTON: getByText("1"),
    TODAY_POINT_LABEL: getByResouceId("jp.co.rakuten.slide:id/home_this_week_points_value"),

    CARD_AD_IMAGE: getByResouceId("jp.co.rakuten.slide:id/card_ad_image"),
    PR_MARK: getByResouceId("jp.co.rakuten.slide:id/PR_mark"),
    GO_SETTING: getByText("Go Setting"),
    OK_UNDERSTOOD_BUTTON: getByText("Ok, Understood"),
    OK_BUTTON: getByText("OK"),
};

class S_HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    async waitForLoginButtonIsShown () {
        return this.waitForElementIsShown(SELECTORS.LOGIN_BUTTON);
    }

    get loginButton () {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get todayPointLabel () {
        return $(SELECTORS.TODAY_POINT_LABEL);
    }

    async pointNumberButtonList () {
        let pointNumberButtonRes = [];
        let pointNumberButtonTmp = await $$(SELECTORS.POINT_NUMBER_BUTTON);
        if (pointNumberButtonTmp.length > 0) {
            for (let index = 0; index < pointNumberButtonTmp.length; index++) {
                const element = pointNumberButtonTmp[index];
                let poinMark = element.parent.$(getByClassname("android.widget.ImageView", 1));
                if (await poinMark.isExisting()) {
                    if (await poinMark.isDisplayed()) {
                        pointNumberButtonRes.push(element);
                    }
                }
            }
        }
        return pointNumberButtonRes;
    }

    get cardAdImage () {
        return $(SELECTORS.CARD_AD_IMAGE);
    }

    get prMark () {
        return $(SELECTORS.PR_MARK);
    }

    get goSettingButton () {
        return $(SELECTORS.GO_SETTING);
    }

    get okUnderStoodButton () {
        return $(SELECTORS.OK_UNDERSTOOD_BUTTON);
    }

    get okButton () {
        return $(SELECTORS.OK_BUTTON);
    }
}

export default new S_HomeScreen();
