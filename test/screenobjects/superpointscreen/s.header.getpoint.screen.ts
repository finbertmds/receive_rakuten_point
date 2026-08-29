import config from "../../../config";
import {
  getByClassname,
  getByResouceId,
  getByText,
} from "../../helpers/UiSelectorHelper";
import AppScreen from "../AppScreen";

const SELECTORS = {
  DEFAULT_SELECTOR: getByResouceId("jp.co.rakuten.slide:id/toolbar"),
  TOTAL_POINT_LABEL: getByText("Total Points"),
  // jp.co.rakuten.slide:id/rakutenrewardsdk_tab_unclaimtitle
  UNCLAIMED_POINT_LABEL: getByResouceId(
    "jp.co.rakuten.slide:id/rakutenrewardsdk_tab_unclaimtitle",
  ),
  // jp.co.rakuten.slide:id/rakutenreward_claimbutton
  CLAIM_BUTTON: getByResouceId(
    "jp.co.rakuten.slide:id/rakutenreward_claimbutton",
  ),
  // Earned points!
  EARNED_POINTS_LABEL: getByText("Earned points!"),
  // Close Portal
  ClOSE_PORTAL_BUTTON: "~Close Portal",
};

class S_HeaderGetPointScreen extends AppScreen {
  constructor() {
    super(SELECTORS.DEFAULT_SELECTOR);
  }

  get totalPointLabel() {
    return $(SELECTORS.TOTAL_POINT_LABEL);
  }

  async getPointButton() {
    let parent = await $(SELECTORS.TOTAL_POINT_LABEL).parent;
    let getPointButton = await parent.$(
      getByClassname("android.widget.Button", 0),
    );
    return getPointButton;
  }

  get unclaimedPointLabel() {
    return $(SELECTORS.UNCLAIMED_POINT_LABEL);
  }

  get claimButton() {
    return $(SELECTORS.CLAIM_BUTTON);
  }

  get earnedPointsLabel() {
    return $(SELECTORS.EARNED_POINTS_LABEL);
  }

  async waitForEarnedPointsLabel() {
    return $(SELECTORS.EARNED_POINTS_LABEL).waitForDisplayed({
      timeout: 3 * config.DEFAULT_TIMEOUT,
    });
  }

  get closePortalButton() {
    return $(SELECTORS.ClOSE_PORTAL_BUTTON);
  }
}

export default new S_HeaderGetPointScreen();
