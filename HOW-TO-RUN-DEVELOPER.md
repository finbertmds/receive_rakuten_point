# How to Run
This is a step-by-step guide how to run the example:

## Installing Appium on a local machine
See [Installing Appium on a local machine](./docs/APPIUM.md)

## Setting up Android and iOS on a local machine
To setup your local machine to use an Android emulator and an iOS simulator see [Setting up Android and iOS on a local machine](./docs/ANDROID_IOS_SETUP.md)

1. System Requirements
- You’ll need [Node.js](http://nodejs.org/) installed
  - Use Node.js v26.12.1 (see `.nvmrc` and `package.json`)
- [Npm](https://www.npmjs.com/) Or [Yarn](https://yarnpkg.com/getting-started/install)

2. Run

```bash
export RAKUTEN_USERNAME='xxx'
export RAKUTEN_PASSWORD='xxx'
nvm use
yarn install --frozen-lockfile
yarn test
```

Appium and UiAutomator2 are project dependencies; WebdriverIO starts the local Appium server. TypeScript runs through WebdriverIO's `tsx` loader, so `ts-node` is not needed.

Run `yarn typecheck` to check test sources. `skipLibCheck` is enabled because the current Node, DOM and URLPattern polyfill declarations overlap; dependency declaration files are excluded from this check.

3. Other command

```bash
yarn test:pointclub // app: 楽天ポイントクラブ
yarn test:recipe // app: 楽天レシピ
yarn test:superpointscreen // app: 楽天 Super Point Screen
```
