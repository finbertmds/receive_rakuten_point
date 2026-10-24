# Installing Appium on a local machine

> There are several documents and instructions on the internet to install Appium on your local machine.
This is just one of the many ;-)

To setup the local test environment the following needs to be installed:

- [Appium](https://github.com/appium/appium) and the UiAutomator2 driver are installed locally by `yarn install --frozen-lockfile`.
- [appium-inspector](https://github.com/appium/appium-inspector). This one needs to be downloaded from [here](https://github.com/appium/appium-inspector/releases) and pick the latest stable releases

## Setup a local machine

### Appium

```bash
nvm use
yarn install --frozen-lockfile
yarn appium driver list --installed
```

When appium-doctor can, it will fix the problems for you, otherwise fix them manually. If you have some ENV issues make sure you have set them like this

```bash
export ANDROID_HOME=/Users/wswebcreation/Library/Android/sdk
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools/adb:$ANDROID_HOME/build-tools:$JAVA_HOME/bin
# This one is used for the `start.android.emulator` script
export emulator=/Users/wswebcreation/Library/Android/sdk/emulator
```

### Appium
Check the local Appium version with `yarn appium --version`. WebdriverIO starts this local server automatically when running tests.

```bash
➜  yarn appium --version
3.8.0
➜ 
```

> Always make sure to check the Appium site if there is a new version. New Appium version are released mostly when Android/iOS release new versions.
Bugfixes can also be released. Just check the [changelog](https://github.com/appium/appium/blob/master/CHANGELOG.md) for a clear overview

## Appium inspector

```js
{
  "app": "/Users/wswebcreation/git/appium-boilerplate/apps/Android-NativeDemoApp-0.2.0.apk",
  "platformName": "Android",
  "deviceName": "config/wdio.android.app.conf.js",
  "platformVersion": "7.1.1",
  "noReset": true,
  "automationName": "UiAutomator2"
}
```

And the following settings for iOS (also check [here](../config/wdio.ios.app.conf.js))


```js
{
  "app": "/Users/wswebcreation/git/appium-boilerplate/apps/iOS-NativeDemoApp-0.2.0.zip",
  "platformName": "iOS",
  "deviceName": "iPhone 6",
  "platformVersion": "11.1",
  "noReset": true
}
```
