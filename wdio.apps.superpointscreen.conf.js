const { join } = require('path');
const { config } = require('./wdio.conf');
const apks = require('./apks');

function getAppPath (fileName) {
    return join(process.cwd(), './apps/' + fileName);
}

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_3_super_point_screen.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
        'appium:app': getAppPath(apks.RAKUTEN_SUPER_POINT_SCREEN_APK_NAME),
    }
];
delete capabilities[0]['appium:otherApps'];
config.capabilities = capabilities;

exports.config = config;
