import { getByResouceId } from "../../helpers/UiSelectorHelper";
import AppScreen from "../app.screen";

const SELECTORS = {
  DEFAULT_SELECTOR: getByResouceId("com.android.permissioncontroller:id/grant_dialog"),
  ALLOW_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_allow_foreground_only_button"),
  ONE_TIME_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_allow_one_time_button"),
  DENY_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_deny_button"),
};

class Permission extends AppScreen {
  constructor () {
    super(SELECTORS.DEFAULT_SELECTOR);
  }

  get allowButton () {
    return $(SELECTORS.ALLOW_BUTTON);
  }

  get oneTimeButton () {
    return $(SELECTORS.ONE_TIME_BUTTON);
  }

  get denyButton () {
    return $(SELECTORS.DENY_BUTTON);
  }
}

export default new Permission();
