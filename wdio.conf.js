const { join } = require('path');
const { config } = require('./wdio.shared.conf');
const configConst = require('./config');

// ============
// Specs
// ============
config.specs = [
    './test/specs/**/*.ts',
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // The defaults you need to have in your config
        platformName: 'Android',
        maxInstances: 1,
        // For W3C the appium capabilities need to have an extension prefix
        // http://appium.io/docs/en/writing-running-appium/caps/
        // This is `appium:` for all Appium Capabilities which can be found here
        'appium:deviceName': 'Android Emulator',
        'appium:platformVersion': '10',
        'appium:orientation': 'PORTRAIT',
        // `automationName` will be mandatory, see
        // https://github.com/appium/appium/releases/tag/v1.13.0
        'appium:automationName': 'UiAutomator2',
        // The path to the app
        'appium:app': join(process.cwd(), './apps/' + configConst.default.RAKUTEN_POINT_CLUB_APK_NAME),
        'appium:otherApps': `["${join(process.cwd(), './apps/' + configConst.default.RAKUTEN_RECIPE_APK_NAME)}","${join(process.cwd(), './apps/' + configConst.default.RAKUTEN_SUPER_POINT_SCREEN_APK_NAME)}"]`,
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        'appium:noReset': true,
        'appium:newCommandTimeout': 240,
        'appium:nativeWebScreenshot': true,
        'appium:androidInstallTimeout': 900000,
        'appium:uiautomator2ServerLaunchTimeout': 900000,
        'appium:uiautomator2ServerInstallTimeout': 900000,
    },
];

exports.config = config;
