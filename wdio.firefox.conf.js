
const path = require('path');

const fs = require('fs');
function encode(file) {
  var stream = fs.readFileSync(file);
  return new Buffer.from(stream).toString('base64');
}

const { config } = require('./wdio.shared.conf');

config.capabilities = [
    {
        maxInstances: 5,
        browserName: 'firefox',
        'moz:firefoxOptions': {
            args: ['--headless'],
        },
        //
        // Parameter to ignore some or all default flags
        // - if value is true: ignore all DevTools 'default flags' and Puppeteer 'default arguments'
        // - if value is an array: DevTools filters given default arguments
        // 'wdio:devtoolsOptions': {
        //    ignoreDefaultArgs: true,
        //    ignoreDefaultArgs: ['--disable-sync', '--disable-extensions'],
        // }
    }
]

exports.config = config;
