# How to Run
This is a step-by-step guide how to run the example:

1. System Requirements
- You’ll need [Node.js](http://nodejs.org/) installed
  - Install at least v12.16.1 or higher as this is the oldest active LTS version
  - Only releases that are or will become an LTS release are officially supported
- [Npm](https://www.npmjs.com/) Or [Yarn](https://yarnpkg.com/getting-started/install)

2. Run

```bash
export RAKUTEN_USERNAME='xxx' // Your rakuten username
export RAKUTEN_PASSWORD='xxx' // Your rakuten password
yarn
yarn test // browser: firefox
```

3. Other command

```bash
yarn test:chrome // browser: chrome
yarn test:firefox // browser: firefox
```

## Note
Because when running the extension `楽天ウェブ検索` will be automatically installed, so chrome cannot be run in headless mode.