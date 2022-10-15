import { getByResouceId, getByResouceIdInScrollable } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.recipe:id/scrollable_content"),
    CHOICE_1_OPTION_1: getByResouceIdInScrollable("jp.co.rakuten.recipe:id/scrollable_content", "jp.co.rakuten.recipe:id/family_structure_option_1"),
    CHOICE_2_OPTION_1: getByResouceIdInScrollable("jp.co.rakuten.recipe:id/scrollable_content", "jp.co.rakuten.recipe:id/cooking_duration_option_1"),
    CHOICE_3_OPTION_1: getByResouceIdInScrollable("jp.co.rakuten.recipe:id/scrollable_content", "jp.co.rakuten.recipe:id/cooking_skill_option_1"),
    
    RECOMMENDED: getByResouceId("jp.co.rakuten.recipe:id/login_prompt"),
    SERVEY_OK_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/survey_ok_button"),
    SERVEY_CANCEL_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/survey_cancel_button"),
    COMPLETION_MESSAGE: getByResouceId("jp.co.rakuten.recipe:id/survey_completion_message"),
    SERVEY_COMPLETION_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/survey_completion_ok_button"),
};

class R_HomeSettingScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get scrollView () {
        return $(SELECTORS.DEFAULT_SELECTOR);
    }

    get choice1Option1 () {
        return $(SELECTORS.CHOICE_1_OPTION_1);
    }

    get choice2Option1 () {
        return $(SELECTORS.CHOICE_2_OPTION_1);
    }

    get choice3Option1 () {
        return $(SELECTORS.CHOICE_3_OPTION_1);
    }

    get serveyOkButton () {
        return $(SELECTORS.SERVEY_OK_BUTTON);
    }

    get serveyCancelButton () {
        return $(SELECTORS.SERVEY_CANCEL_BUTTON);
    }

    async waitForRecommendedIsShown () {
        return this.waitForElementIsShown(SELECTORS.RECOMMENDED);
    }

    async waitForCompletionMessagesShown () {
        return this.waitForElementIsShown(SELECTORS.COMPLETION_MESSAGE);
    }

    get serveyCompletionButton () {
        return $(SELECTORS.SERVEY_COMPLETION_BUTTON);
    }


}

export default new R_HomeSettingScreen();
