const { config } = require('./wdio.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/rakuten_2_recipe.ts',
];

exports.config = config;
