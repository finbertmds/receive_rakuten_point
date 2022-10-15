import { getByResouceId, getByText } from "../../helpers/UiSelectorHelper";
import AndroidSettings from "../AndroidSettings";
import AppScreen from "../AppScreen";

const SELECTORS = {
  DEFAULT_SELECTOR: getByResouceId("com.android.permissioncontroller:id/grant_dialog"),
  ALLOW_BUTTON_API29: getByResouceId("com.android.permissioncontroller:id/permission_allow_foreground_only_button"),
  ALLOW_BUTTON: getByText("ALLOW"),
  // ONE_TIME_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_allow_one_time_button"),
  // DENY_BUTTON: getByResouceId("com.android.permissioncontroller:id/permission_deny_button"),
  DENY_BUTTON: getByText("DENY"),
  SETTINGS_CONTAINER: getByResouceId("com.android.settings:id/content_frame"),
  SETTINGS_SWITCH_RADIO: getByResouceId("android:id/switch_widget"),
};

class Permission extends AppScreen {
  constructor () {
    super(SELECTORS.DEFAULT_SELECTOR);
  }

  get allowButton () {
    let result = $(SELECTORS.ALLOW_BUTTON);
    if (AndroidSettings.platformVersion == 10) {
      result = $(SELECTORS.ALLOW_BUTTON_API29);
    }
    return result;
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
