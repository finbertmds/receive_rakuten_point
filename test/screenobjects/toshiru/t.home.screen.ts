import config from '../../../config';
import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    HOME_SCREEN: getByResouceId("android:id/content"),

    OVERLAY_BACKGROUND: getByResouceId("jp.co.rakutensec.toshiru:id/overlay_background"),
    CLOSE_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/close_button"),
    OVERLAY: getByResouceId("jp.co.rakutensec.toshiru:id/overlay"),

    LOGO_TITTLE: getByResouceId("jp.co.rakutensec.toshiru:id/logoTitle"),
    HEADER_MENU_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/headerMenuButton"),
    HEADER_REWARD_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/headerRewardButton"),

    RAKUTEN_REWARD_LABEL: getByText("ポイントミッション(楽天リワード)"),
    LOGOUT_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/rakutenLoginCellButton"),
    FOOTER_TOP_BORDERLINE_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/footerTopBorderline"),

    RECOMMEND_SECTION_FOOTER_TITLE: getByResouceId("jp.co.rakutensec.toshiru:id/recommendSectionFooterTitle"),
    RANKING_SECTION_FOOTER_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/rankingSectionFooterButton"),
    SECTION_FOOTER_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/sectionFooterButton"),

    HEADER_TITLE_LABEL: getByResouceId("jp.co.rakutensec.toshiru:id/headerTitleLabel"),
    ARTICLE_IMAGE_LIST: getByResouceId("jp.co.rakutensec.toshiru:id/articleImage"),
    CONTENTS: getByResouceId("contents"),
    FEEDBACK: getByResouceId("feedback"),
    FOOTER_DISCLAIMER: getByResouceId("footer-disclaimer"),
    COMMON_PREV_BUTTON: getByResouceId("jp.co.rakutensec.toshiru:id/commonPrevButton"),
    
    GET_POINT_DONE_LABEL: getByResouceId("jp.co.rakuten.pointclub.android:id/rakutenreward_claim_title"),
};

class T_HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    async waitForLogoTitleIsShown () {
        return $(SELECTORS.LOGO_TITTLE).waitForDisplayed({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }

    get logoTittle () {
        return $(SELECTORS.LOGO_TITTLE);
    }

    get overlayBackground () {
        return $(SELECTORS.OVERLAY_BACKGROUND);
    }

    get closeButton () {
        return $(SELECTORS.CLOSE_BUTTON);
    }

    get overlay () {
        return $(SELECTORS.OVERLAY);
    }

    async handleCloseOverlayBackground() {
        await driver.pause(5000);
        if (await (await this.overlayBackground).isDisplayed()) {
            if (await (await this.closeButton).isDisplayed()) {
                await (await this.closeButton).click();
            }
        }
        await driver.pause(5000);
        if (await (await this.overlay).isDisplayed()) {
            await (await this.overlay).click();
        }
    }
    
    get headerMenuButton () {
        return $(SELECTORS.HEADER_MENU_BUTTON);
    }

    async waitForRakutenRewardLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.RAKUTEN_REWARD_LABEL);
    }

    get rakutenRewardLabel () {
        return $(SELECTORS.RAKUTEN_REWARD_LABEL);
    }

    get logoutButton () {
        return $(SELECTORS.LOGOUT_BUTTON);
    }

    get footerTopBorderLineButton () {
        return $(SELECTORS.FOOTER_TOP_BORDERLINE_BUTTON);
    }

    async rakutenRewardNumberLabel () {
        if (await this.rakutenRewardLabel.isExisting()) {
            // logo text: pointclub_logo
            let rakutenRewardNumber = (await this.rakutenRewardLabel.parent).$(getByClassname("android.view.View", 1)).$(getByClassname("android.widget.TextView"));
            if (await rakutenRewardNumber.isExisting()) {
                return rakutenRewardNumber;
            }
        }
        return null;
    }

    get recommendSectionFooterTitle () {
        return $(SELECTORS.RECOMMEND_SECTION_FOOTER_TITLE);
    }

    get rankingSectionFooterButton () {
        return $(SELECTORS.RANKING_SECTION_FOOTER_BUTTON);
    }

    get sectionFooterButton () {
        return $(SELECTORS.SECTION_FOOTER_BUTTON);
    }

    async waitForHeaderTitleLabelIsShown () {
        return this.waitForElementIsShown(SELECTORS.HEADER_TITLE_LABEL);
    }
    
    get headerTitleLabel () {
        return $(SELECTORS.HEADER_TITLE_LABEL);
    }
    
    async articleImageList (groupId: string) {
        return $(getByResouceId(groupId)).$$(SELECTORS.ARTICLE_IMAGE_LIST);
    }

    async articleTitle (articleImage: WebdriverIO.Element) {
        let parent = articleImage.parent;
        return parent.$(getByResouceId("jp.co.rakutensec.toshiru:id/articleTitle"));
    }
    
    async waitForContentsIsShown () {
        return this.waitForElementIsShown(SELECTORS.CONTENTS);
    }

    get contents () {
        return $(SELECTORS.CONTENTS);
    }
    
    get feedback () {
        return $(SELECTORS.FEEDBACK);
    }
    
    get footerDisclaimer () {
        return $(SELECTORS.FOOTER_DISCLAIMER);
    }

    get commonPrevButton () {
        return $(SELECTORS.COMMON_PREV_BUTTON);
    }

    async waitForGetPointDoneLabelIsShown () {
        // return this.waitForElementIsShown(SELECTORS.GET_POINT_DONE_LABEL);
        return $(SELECTORS.GET_POINT_DONE_LABEL).waitForDisplayed({
            timeout: 2 * config.DEFAULT_TIMEOUT,
            reverse: false,
        });
    }
}

export default new T_HomeScreen();
