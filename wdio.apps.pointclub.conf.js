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
    './test/specs/rakuten_1_point_club.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
    }
];
// delete capabilities[0]['appium:otherApps'];
config.capabilities = capabilities;

exports.config = config;
