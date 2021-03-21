import config from "../../config";

const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '-ios predicate string:type == \'XCUIElementTypePickerWheel\'',
    DONE: '~header-Dropdown',
};

class Picker {
    /**
     * Wait for the picker to be shown
     *
     * @param {boolean} isShown
     */
    static waitForIsShown (isShown: boolean = true) {
        const selector = driver.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        $(selector).waitForExist({
            timeout: config.DEFAULT_TIMEOUT,
            reverse: !isShown,
        });
    }

    /**
     * Select a value from the picker
     *
     * @param {string} value The value that needs to be selected
     */
    static selectValue (value: string) {
        this.waitForIsShown(true);
        if (driver.isIOS) {
            this._setIosValue(value);
        } else {
            this._setAndroidValue(value);
        }
        this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     *
     * @param {string} value
     *
     * @private
     */
    static _setAndroidValue (value: string) {
        $(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`).click();
    }

    /**
     * Set the value for IOS
     *
     * @param {string} value
     *
     * @private
     */
    static _setIosValue (value: string) {
        $(SELECTORS.IOS_PICKERWHEEL).addValue(value);
        $(SELECTORS.DONE).click();
    }
}

export default Picker;
