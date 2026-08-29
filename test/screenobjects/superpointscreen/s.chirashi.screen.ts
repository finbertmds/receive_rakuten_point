import {
  getByClassname,
  getByResouceId,
  getByText,
  getByTextInScrollable,
} from "../../helpers/UiSelectorHelper";
import AppScreen from "../AppScreen";

const SELECTORS = {
  DEFAULT_SELECTOR: getByResouceId("android:id/content"),
  ADSPOT: getByResouceId("rdn-adspot"),
  FIRST_CLOSE_BUTTON: getByClassname("android.widget.Button", 0),
  FIRST_NEW_FLYER: getByText("In Progress"),
  OK_BUTTON: getByText("OK"),
  GO_BACK_BUTTON: getByText("Go back"),
};

class R_ChirashiScreen extends AppScreen {
  constructor() {
    super(SELECTORS.DEFAULT_SELECTOR);
  }

  get adSpot() {
    return $(SELECTORS.ADSPOT);
  }

  get firstCloseButton() {
    return $(SELECTORS.FIRST_CLOSE_BUTTON);
  }

  get newFlyers() {
    return $(getByTextInScrollable("branch-top", "New Flyers"));
  }

  async firstNewFlyer() {
    return $(SELECTORS.FIRST_NEW_FLYER);
  }

  get okButton() {
    return $(SELECTORS.OK_BUTTON);
  }

  get goBackButton() {
    return $(SELECTORS.GO_BACK_BUTTON);
  }
}

export default new R_ChirashiScreen();
