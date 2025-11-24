const { config } = require('./wdio.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_5_toshiru.ts',
];

let capabilities = [
    {
        ...config.capabilities[0],
    }
];
config.capabilities = capabilities;

exports.config = config;
