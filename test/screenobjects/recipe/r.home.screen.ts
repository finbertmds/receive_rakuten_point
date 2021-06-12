import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../app.screen';

const SELECTORS = {
    DEFAULT_SELECTOR: getByResouceId("android:id/content"),
    TABBAR_POPULAR_LABEL: getByText("人気"),
    RECIPE_IMAGE: getByResouceId("jp.co.rakuten.recipe:id/recipe_image"),
    SWIPE_GUIDE_IMAGE: getByResouceId("jp.co.rakuten.recipe:id/swipeguide_image"),
    BACK_BUTTON: getByResouceId("jp.co.rakuten.recipe:id/back_button"),
};

class R_HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.DEFAULT_SELECTOR);
    }

    get tabbarPopularLabel () {
        return $(SELECTORS.TABBAR_POPULAR_LABEL);
    }

    get firstRecipeImage () {
        let recipeImageList = $$(SELECTORS.RECIPE_IMAGE);
        if (recipeImageList.length > 0) {
            return recipeImageList[0];
        }
        return null;
    }

    get swipeGuideImage () {
        return $(SELECTORS.SWIPE_GUIDE_IMAGE);
    }

    get backButton () {
        return $(SELECTORS.BACK_BUTTON);
    }

    waitForBackButtonIsShown () {
        return $(SELECTORS.BACK_BUTTON).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

}

export default new R_HomeScreen();
