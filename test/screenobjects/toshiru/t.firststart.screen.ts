import config from '../../../config';
import { getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    FIRSTSTSRT_SCREEN: getByResouceId("android:id/content"),
    ENTER_LOGIN_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/rakutenLoginButton"),
    WARNING_OK_BUTTON: getByText("OK"),
    
    MODAL_CLAIM: getByResouceId("jp.co.rakutensec.toshiru:id/rakutenreward_modal_claim_layout"),
    POINT_LOGO_CLAINM_BUTTON: "~point logo",

    RECOMMENDED_IMAGE: getByResouceId("jp.co.rakutensec.toshiru:id/recommended_image"),
    COMMON_NEXT_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/commonNextButton"),
    START_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/startButton"),
    
    PARENT_PANEL: getByResouceId("jp.co.rakutensec.toshiru:id/parentPanel"),
    NO_BUTTON: getByResouceId("android:id/button2"),
};

class T_FirstStartScreen extends AppScreen {
    constructor () {
        super(SELECTORS.FIRSTSTSRT_SCREEN);
    }

    async waitForEnterLoginButtonIsShown () {
        return $(SELECTORS.ENTER_LOGIN_BUTTON).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get enterLoginButton () {
        return $(SELECTORS.ENTER_LOGIN_BUTTON);
    }

    get warningOkButton () {
        return $(SELECTORS.WARNING_OK_BUTTON);
    }

    async waitForModalClaimIsShown () {
        return this.waitForElementIsShown(SELECTORS.MODAL_CLAIM);
    }

    get modalClaim () {
        return $(SELECTORS.MODAL_CLAIM);
    }

    get pointLogoClaimButton () {
        return $(SELECTORS.POINT_LOGO_CLAINM_BUTTON);
    }

    async waitForRecommendedImageIsShown () {
        return this.waitForElementIsShown(SELECTORS.RECOMMENDED_IMAGE);
    }

    get recommendedImage () {
        return $(SELECTORS.RECOMMENDED_IMAGE);
    }

    get commonNextButton () {
        return $(SELECTORS.COMMON_NEXT_BUTTON);
    }

    get startButton () {
        return $(SELECTORS.START_BUTTON);
    }

    get parentPanel () {
        return $(SELECTORS.PARENT_PANEL);
    }

    get noButton () {
        return $(SELECTORS.NO_BUTTON);
    }
}

export default new T_FirstStartScreen();
