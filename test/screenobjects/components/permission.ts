import { getByResouceId } from "../../helpers/UiSelectorHelper";
import AppScreen from "../app.screen";

const SELECTORS = {
  DEFAULT_SELECTOR: getByResouceId("com.android.permissioncontroller:id/grant_dialog"),
  ALLOW_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_allow_foreground_only_button"),
  // ONE_TIME_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_allow_one_time_button"),
  DENY_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_deny_button"),
  SETTINGS_CONTAINER: getByResouceId("com.android.settings:id/content_frame"),
  SETTINGS_SWITCH_RADIO: getByResouceId("android:id/switch_widget"),
};

class Permission extends AppScreen {
  constructor () {
    super(SELECTORS.DEFAULT_SELECTOR);
  }

  get allowButton () {
    return $(SELECTORS.ALLOW_BUTTON);
  }

  // get oneTimeButton () {
  //   return $(SELECTORS.ONE_TIME_BUTTON);
  // }

  get denyButton () {
    return $(SELECTORS.DENY_BUTTON);
  }

  get settingsContainer () {
    return $(SELECTORS.SETTINGS_CONTAINER);
  }

  get settingsSwitchRadio () {
    return $(SELECTORS.SETTINGS_SWITCH_RADIO);
  }
}

export default new Permission();
