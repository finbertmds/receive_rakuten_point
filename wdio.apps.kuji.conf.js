const { config } = require('./wdio.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_kuji.ts',
];

exports.config = config;
