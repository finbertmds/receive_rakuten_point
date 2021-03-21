const { config }  = require('./wdio.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_super_point_screen.ts',
];

exports.config = config;
