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
    './test/specs/rakuten_5_toshiru.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
    }
];
config.capabilities = capabilities;

exports.config = config;
