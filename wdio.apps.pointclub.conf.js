const { config } = require('./wdio.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_1_point_club.ts',
];

exports.config = config;
