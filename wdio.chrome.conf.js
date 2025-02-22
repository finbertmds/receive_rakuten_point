
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
        browserName: 'chrome',
        'goog:chromeOptions': {
            // extensions: [
            //     (function () {
            //         try {
            //             const webExt = encode(path.resolve(__dirname, './websearch_extension.crx'))
            //             return webExt;
            //         } catch (e) {
            //             console.log(e, 'An error occurred while to parse extension file!');
            //         }
            //     })(),
            //     // (function () {
            //     //     try {
            //     //         const webExt = encode(path.resolve(__dirname, './adblock_plus.crx'))
            //     //         return webExt;
            //     //     } catch (e) {
            //     //         console.log(e, 'An error occurred while to parse extension file!');
            //     //     }
            //     // })(),
            // ],
            // to run chrome headless the following flags are required
            // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
            // args: ['--headless', '--disable-gpu'],
        }
    }
]

exports.config = config;
