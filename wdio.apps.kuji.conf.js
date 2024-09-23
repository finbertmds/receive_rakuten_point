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
    './test/specs/rakuten_4_kuji.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
    }
];
// delete capabilities[0]['appium:otherApps'];
config.capabilities = capabilities;

exports.config = config;
