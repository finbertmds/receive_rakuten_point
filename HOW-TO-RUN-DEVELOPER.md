# How to Run
This is a step-by-step guide how to run the example:

## Installing Appium on a local machine
See [Installing Appium on a local machine](./docs/APPIUM.md)

## Setting up Android and iOS on a local machine
To setup your local machine to use an Android emulator and an iOS simulator see [Setting up Android and iOS on a local machine](./docs/ANDROID_IOS_SETUP.md)

1. System Requirements
- You’ll need [Node.js](http://nodejs.org/) installed
  - Install at least v12.16.1 or higher as this is the oldest active LTS version
  - Only releases that are or will become an LTS release are officially supported
- [Npm](https://www.npmjs.com/) Or [Yarn](https://yarnpkg.com/getting-started/install)

2. Run

```bash
export RAKUTEN_USERNAME='xxx'
export RAKUTEN_PASSWORD='xxx'
yarn
yarn test
```

3. Other command

```bash
yarn test:pointclub // app: 楽天ポイントクラブ
yarn test:recipe // app: 楽天レシピ
yarn test:superpointscreen // app: 楽天 Super Point Screen
```