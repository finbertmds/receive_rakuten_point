import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    FIRSTSTSRT_SCREEN: getByResouceId("android:id/content"),

    customPanel: getByResouceId("android:id/customPanel"),
    aerr_close: getByResouceId("android:id/aerr_close"),

    tc_end: getByText("©Rakuten Group, Inc."),
    rakuten_tc_checkBox: getByResouceId("jp.co.rakuten.toolbar.raws:id/rakuten_tc_checkBox"),
    rakuten_tc_start_button: getByResouceId("jp.co.rakuten.toolbar.raws:id/rakuten_tc_start_button"),

    rakuten_pop_up_actions_layout: getByResouceId("jp.co.rakuten.toolbar.raws:id/rakuten_pop_up_actions_layout"),
    NO: getByText("NO"),

    close_message: "~close message",

    MODAL_CLAIM: getByResouceId("jp.co.rakutensec.toshiru:id/rakutenreward_modal_claim_layout"),
    POINT_LOGO_CLAINM_BUTTON: "~point logo",
    GET_POINT_DONE_LABEL: getByResouceId("jp.co.rakutensec.toshiru:id/rakutenreward_claim_title"),
};

class T_FirstStartScreen extends AppScreen {
    constructor() {
        super(SELECTORS.FIRSTSTSRT_SCREEN);
    }

    get customPanel() {
        return $(SELECTORS.customPanel);
    }

    get aerr_close() {
        return $(SELECTORS.aerr_close);
    }

    get tc_end() {
        return $(SELECTORS.tc_end);
    }

    get rakuten_tc_checkBox() {
        return $(SELECTORS.rakuten_tc_checkBox);
    }

    get rakuten_tc_start_button() {
        return $(SELECTORS.rakuten_tc_start_button);
    }

    get rakuten_pop_up_actions_layout() {
        return $(SELECTORS.rakuten_pop_up_actions_layout);
    }

    get NO() {
        return $(SELECTORS.NO);
    }

    get close_message() {
        return $(SELECTORS.close_message);
    }

    get modalClaim() {
        return $(SELECTORS.MODAL_CLAIM);
    }

    get pointLogoClaimButton() {
        return $(SELECTORS.POINT_LOGO_CLAINM_BUTTON);
    }

    async waitForGetPointDoneLabelIsShown() {
        // return this.waitForElementIsShown(SELECTORS.GET_POINT_DONE_LABEL);
        return $(SELECTORS.GET_POINT_DONE_LABEL).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }
}

export default new T_FirstStartScreen();
