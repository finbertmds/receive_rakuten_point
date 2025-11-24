const { config } = require('./wdio.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_3_super_point_screen.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
    }
];
config.capabilities = capabilities;

exports.config = config;
