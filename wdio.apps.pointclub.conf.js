const { config } = require('./wdio.conf');

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
config.capabilities = capabilities;

exports.config = config;
