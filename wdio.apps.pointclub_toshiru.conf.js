const { join } = require('path');
const { config } = require('./wdio.conf');
const configConst = require('./config');

function getAppPath (fileName) {
    return join(process.cwd(), './apps/' + fileName);
}

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_1_point_club.ts',
    './test/specs/rakuten_5_toshiru.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
        'appium:app': getAppPath(configConst.default.RAKUTEN_POINT_CLUB_APK_NAME),
        'appium:otherApps': `["${getAppPath(configConst.default.RAKUTEN_TOSHIRU_APK_NAME)}"]`,
    }
];
config.capabilities = capabilities;

exports.config = config;
