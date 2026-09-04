import { driver } from "@wdio/globals";
import config from "../../config";
import Gestures from "../helpers/Gestures";
import cFirststartScreen from "../screenobjects/chrome/c.firststart.screen";
import permission from "../screenobjects/components/permission";
import sFirststartScreen from "../screenobjects/superpointscreen/s.firststart.screen";
import sHomeGetpointScreen from "../screenobjects/superpointscreen/s.home.getpoint.screen";
import sHomeScreen from "../screenobjects/superpointscreen/s.home.screen";
import sLoginScreen from "../screenobjects/superpointscreen/s.login.screen";
import sLuckycountScreen from "../screenobjects/superpointscreen/s.luckycount.screen";
import S_TabBar from "../screenobjects/superpointscreen/s.tab.bar";
import sChirashiScreen from "../screenobjects/superpointscreen/s.chirashi.screen";
import sHeaderGetpointScreen from "../screenobjects/superpointscreen/s.header.getpoint.screen";
import sSearchScreen from "../screenobjects/superpointscreen/s.search.screen";
import { generateRakutenSearchKeyword } from "../helpers/rakutenSearchKeyword";

describe("rakuten_super_point_screen", async () => {
  before(async () => {
    await driver.terminateApp(config.RAKUTEN_POINT_CLUB_APP_ID);
    await driver.terminateApp(config.RAKUTEN_TOSHIRU_APP_ID);

    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(5000);
  });

  after(async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
  });

  async function handleMaintenance() {
    return sFirststartScreen.maintenanceContainer.isDisplayed();
  }

  async function handleSkipButton() {
    await sFirststartScreen.waitForIsShown();
    if (await sFirststartScreen.skipButon.isExisting()) {
      await sFirststartScreen.skipButon.click();
    }
  }

  async function handleFirstLogin() {
    await driver.pause(2000);
    // sHomeScreen.waitForLoginButtonIsShown();
    let loginButton = sHomeScreen.loginButton;
    if (!(await loginButton.isDisplayed())) {
      console.log("logged in");
      return;
    }
    await loginButton.click();
    await handleChromeAction();
    await driver.pause(2000);
    // await sLoginScreen.waitForEnterLoginScreen();
    if (await (await sLoginScreen.skipToSignIn).isDisplayed()) {
      await sLoginScreen.skipToSignIn.click();
      await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
      await sLoginScreen.waitForLoggedIn();
      return;
    }
    if (await (await sLoginScreen.loginContinueButton).isDisplayed()) {
      await sLoginScreen.loginContinueButton.click();
      await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
      await sLoginScreen.waitForLoggedIn();
      return;
    }
    if (await (await sLoginScreen.loginWithOtherButton).isDisplayed()) {
      await sLoginScreen.loginWithOtherButton.click();
      await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
    }
    // await driver.execute('mobile: shell', {
    //     command: 'input',
    //     args: ['tap', '410', '840'],
    //     includeStderr: true,
    //     timeout: 5000
    // });
    await driver.pause(2000);
    await driver.execute("mobile: shell", {
      command: "input",
      args: ["text", config.RAKUTEN_USERNAME],
      includeStderr: true,
      timeout: 5000,
    });
    await driver.pause(2000);
    await driver.execute("mobile: shell", {
      command: "input",
      args: ["keyevent", "66"], // KEYCODE_ENTER
      includeStderr: true,
      timeout: 5000,
    });
    await driver.pause(2000);
    // await driver.execute('mobile: shell', {
    //     command: 'input',
    //     args: ['tap', '410', '1100'],
    //     includeStderr: true,
    //     timeout: 5000
    // });

    await driver.pause(2000);
    await driver.execute("mobile: shell", {
      command: "input",
      args: ["text", config.RAKUTEN_PASSWORD],
      includeStderr: true,
      timeout: 5000,
    });
    await driver.execute("mobile: shell", {
      command: "input",
      args: ["keyevent", "66"], // KEYCODE_ENTER
      includeStderr: true,
      timeout: 5000,
    });
    await driver.pause(2000);
    // await driver.pause(2000);
    // await driver.execute('mobile: shell', {
    //     command: 'input',
    //     args: ['tap', '410', '1100'],
    //     includeStderr: true,
    //     timeout: 5000
    // });
    // await sLoginScreen.userid.setValue(config.RAKUTEN_USERNAME);
    // await driver.pause(3000);
    // await sLoginScreen.nextButton.click();
    // await driver.pause(3000);
    // await sLoginScreen.password.setValue(config.RAKUTEN_PASSWORD);
    // await driver.pause(3000);
    // await sLoginScreen.signInButton.click();
    // await driver.pause(3000);
    if (await (await sLoginScreen.skipToSignIn).isDisplayed()) {
      await sLoginScreen.skipToSignIn.click();
      await driver.pause(parseInt(String(config.DEFAULT_TIMEOUT / 3)));
    }
    await sLoginScreen.waitForLoggedIn();
  }

  async function handleChromeAction() {
    let currentPackage = await driver.getCurrentPackage();
    console.log("currentPackage: " + currentPackage);
    if (currentPackage !== config.CHROME_APP_ID) {
      console.log("chrome app is not showing");
      return;
    }
    if (await (await sLoginScreen.loginContinueButton).isDisplayed()) {
      console.log("login page is displayed");
      return;
    }

    // await cFirststartScreen.waitForIsShown();
    if (await (await cFirststartScreen.acceptContinueButton).isDisplayed()) {
      await (await cFirststartScreen.acceptContinueButton).click();
      await (await cFirststartScreen.noThanksButton).click();
      await driver.pause(2000);
    }
  }

  async function handleCloseAlert() {
    await driver.pause(2000);
    // if (! await sHomeAlertScreen.alertContainer.isExisting()) {
    //     return;
    // }
    // let message1 = await sHomeAlertScreen.alertContainerMessage.getText();
    // await sHomeAlertScreen.alertContainerOkButton.click();
    // await sHomeAlertScreen.waitForMessageIsChanged(message1);
    // await sHomeAlertScreen.alertContainerOkButton.click();

    let needAllow = false;
    if (await (await sHomeGetpointScreen.nextButton).isExisting()) {
      if (await (await sHomeGetpointScreen.nextButton).isDisplayed()) {
        await (await sHomeGetpointScreen.nextButton).click();
        await driver.pause(2000);
        needAllow = true;
      }
    }
    if (!needAllow) {
      console.log("permission is permitted");
      return;
    }
    await handleClickPermission();
    await handleOkAlert();
    await handleOkAlert();
    // await sHomeAlertScreen.waitForIsShown();
    // await sHomeAlertScreen.alertContainerOkButton.click();
  }

  async function handleClickPermission() {
    // await permission.waitForIsShown();
    await driver.pause(3000);
    if (await permission.allowButton.isDisplayed()) {
      await permission.allowButton.click();
      await driver.pause(3000);
    }
  }

  async function handleOkAlert() {
    await driver.pause(2000);
    if (await (await sHomeScreen.okButton).isExisting()) {
      if (await (await sHomeScreen.okButton).isDisplayed()) {
        await (await sHomeScreen.okButton).click();
        await driver.pause(3000);
      }
    }
  }

  async function handleDisplayOverOtherApps() {
    if (await permission.settingsContainer.isExisting()) {
      await permission.settingsSwitchRadio.click();
      await driver.back();
      await driver.pause(2000);
    }
    if (await sHomeScreen.okUnderStoodButton.isExisting()) {
      if (await (await sHomeScreen.okUnderStoodButton).isDisplayed()) {
        await (await sHomeScreen.okUnderStoodButton).click();
        await driver.pause(2000);
      }
    }
  }

  async function handleGuideSetting() {
    await driver.pause(2000);
    if (await (await sHomeScreen.cardAdImage).isDisplayed()) {
      if (await (await sHomeScreen.prMark).isDisplayed()) {
        await (await sHomeScreen.prMark).click();
        await driver.pause(2000);
      }
    }
    await driver.pause(2000);
    if (await (await sHomeScreen.goSettingButton).isExisting()) {
      if (await (await sHomeScreen.goSettingButton).isDisplayed()) {
        await (await sHomeScreen.goSettingButton).click();
        await driver.pause(2000);
      }
    }

    await handleDisplayOverOtherApps();
    await handleOkAlert();
    await handleOkAlert();
  }

  async function handleFirstGetPointAfterGuide() {
    await handleClickPermission();
    if (await (await sHomeGetpointScreen.adCardOpenText).isExisting()) {
      if (await (await sHomeGetpointScreen.adCardOpenText).isDisplayed()) {
        await Gestures.swipeRight();

        await handleClickPermission();
        await sHomeGetpointScreen.waitForDoneButtonIsShown();
        await driver.pause(2000);
        await driver.back();
        await driver.pause(2000);
      }
    }
  }

  async function handleClickPointNumber() {
    await driver.pause(2000);
    // await sHomeScreen.waitForIsShown();
    await Gestures.swipeOnPercentage(
      Gestures.calculateXY({ x: 50, y: 50 }, 1),
      Gestures.calculateXY({ x: 50, y: 85 }, 1),
    );
    await driver.pause(5000);
    let pointNumberClickedIndex = 0;
    let swipeCount = config.RAKUTEN_SUPER_POINT_SCREEN_MAX_SWIPE_COUNT;
    for (let index = 0; index < swipeCount; index++) {
      if (!(await S_TabBar.bottomIconIsDisplayed())) {
        console.log("bottomIcon is not displayed, break");
        break;
      }
      let pointNumberButtonList = await sHomeScreen.pointNumberButtonList();
      if (pointNumberButtonList.length > 0) {
        console.log(
          "pointNumberButtonListCount: ",
          pointNumberButtonList?.length,
        );
        for (
          let buttonIndex = 0;
          buttonIndex < pointNumberButtonList.length;
          buttonIndex++
        ) {
          const pointNumberButton = pointNumberButtonList[buttonIndex];
          console.log(`swipeUp ${index}: pointNumberButton: ${buttonIndex}`);
          await driver.pause(2000);
          await pointNumberButton.click();

          // await sHomeGetpointScreen.waitForIsShown();
          await driver.pause(2000);
          if (!(await sHomeGetpointScreen.totalPointLabel.isDisplayed())) {
            console.log("totalPointLabel is not displayed");
            await sHomeGetpointScreen.waitForDoneButtonIsShown();
            await driver.pause(2000);
            // await sHomeGetpointScreen.closeButton.click();
            await backToSuperPointApp();
            if (!(await S_TabBar.bottomIconIsDisplayed())) {
              await driver.back();
              await driver.pause(2000);
            }

            await handleCloseAlert();

            pointNumberClickedIndex++;
            console.log("pointNumberClickedIndex: ", pointNumberClickedIndex);
          } else {
            console.log("totalPointLabel is displayed");
            await backToSuperPointApp();
            if (!(await S_TabBar.bottomIconIsDisplayed())) {
              await driver.back();
              await driver.pause(2000);
            }
          }
        }
      }
      console.log("swipeUp: ", index);
      await Gestures.swipeOnPercentage(
        Gestures.calculateXY({ x: 50, y: 80 }, 1),
        Gestures.calculateXY({ x: 50, y: 40 }, 1),
      );
      await driver.pause(3000);
    }
  }

  async function handleClickGetPoint() {
    // await sLuckycountScreen.waitForIsShown();
    await driver.pause(2000);
    let getButton = sLuckycountScreen.getButton;
    if (await getButton.isExisting()) {
      await getButton.click();
      await sLuckycountScreen.waitForGetDoneButtonIsShown();
      await sLuckycountScreen.getDoneButton.click();
    }
    await driver.pause(2000);
    let isCloseAdButtonDisplayed = await (
      await sLuckycountScreen.closeAdButton
    ).isDisplayed();
    if (isCloseAdButtonDisplayed) {
      await (await sLuckycountScreen.closeAdButton).click();
      await driver.pause(2000);
    }
  }

  async function handleClickPlay() {
    await driver.pause(2000);
    if (await (await sLuckycountScreen.playButton).isDisplayed()) {
      await (await sLuckycountScreen.playButton).click();
      await sLuckycountScreen.waitForChallengePlayButtonIsShown();
      await sLuckycountScreen.waitForPlayIconIsShown();
      await (await sLuckycountScreen.challengePlayButton).click();
      if (await (await sLuckycountScreen.viewFullScreenOK).isDisplayed()) {
        await (await sLuckycountScreen.viewFullScreenOK).click();
      }
      // await driver.pause(60000);
      await sLuckycountScreen.waitForRewardGrantedTextIsShown();
      let isRewardGrantedTextDisplayed = await (
        await sLuckycountScreen.rewardGrantedText
      ).isDisplayed();
      let isCloseAdButtonDisplayed = await (
        await sLuckycountScreen.closeAdButton
      ).isDisplayed();

      if (isRewardGrantedTextDisplayed) {
        console.log("rewardGrantedText is displayed");
        await (await sLuckycountScreen.rewardGrantedText).click();
      } else if (isCloseAdButtonDisplayed) {
        console.log("closeAdButton is displayed");
        await (await sLuckycountScreen.closeAdButton).click();
        await driver.pause(2000);
      } else {
        for (let index = 0; index < 3; index++) {
          await driver.execute("mobile: shell", {
            command: "input",
            args: ["tap", "1000", "95"],
            includeStderr: true,
            timeout: 2000,
          });
          await driver.pause(2000);
          // await driver.execute("mobile: shell", {
          //   command: "input",
          //   args: ["tap", "1000", "95"],
          //   includeStderr: true,
          //   timeout: 2000,
          // });
          // check current package, if not rakuten super point screen, then back to rakuten super point screen
          let currentPackage = await driver.getCurrentPackage();
          console.log("currentPackage: " + currentPackage);
          if (currentPackage === config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID) {
            break;
          }
          await driver.pause(2000);
          await backToSuperPointApp();
          await driver.pause(45000);
        }

        if (!(await S_TabBar.bottomIconIsDisplayed())) {
          await driver.back();
          await driver.pause(2000);
        }
      }

      if (await (await sLuckycountScreen.alertContent).isDisplayed()) {
        if (await sLuckycountScreen.alertCloseButton.isDisplayed()) {
          await sLuckycountScreen.alertCloseButton.click();
        }
      }

      // await sLuckycountScreen.waitForGetDoneButtonIsShown();
      await driver.pause(2000);
      if (await sLuckycountScreen.getDoneButton.isDisplayed()) {
        await sLuckycountScreen.getDoneButton.click();
        await driver.pause(2000);
      }
    }
    await backToSuperPointApp();
    if (!(await S_TabBar.bottomIconIsDisplayed())) {
      await driver.back();
      await driver.pause(2000);
    }
  }

  async function backToSuperPointApp() {
    // check current package, if not rakuten super point screen, then back to rakuten super point screen
    let currentPackage = await driver.getCurrentPackage();
    console.log("currentPackage: " + currentPackage);
    if (currentPackage !== config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID) {
      await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
      await driver.pause(2000);
    }
  }

  async function handleClickChallenge() {
    await driver.pause(2000);
    if (await (await sLuckycountScreen.challengeButton).isDisplayed()) {
      await (await sLuckycountScreen.challengeButton).click();
      await sLuckycountScreen.waitForChallengePlayButtonIsShown();
      await (await sLuckycountScreen.challengePlayButton).click();

      await sLuckycountScreen.waitForChallengeCardIsShown();
      await (await sLuckycountScreen.challengeCard).click();

      await sLuckycountScreen.waitForChallengePlayButtonIsShown();

      await handleClickPlay();
    }
  }

  async function handleChirashiNewFlyerSwipe() {
    await driver.pause(2000);
    try {
      let isAdSpotDisplayed = await (
        await sChirashiScreen.adSpot
      ).isDisplayed();
      console.log("isAdSpotDisplayed: ", isAdSpotDisplayed);
      if (isAdSpotDisplayed) {
        const isFirstCloseButtonDisplayed = await (
          await sChirashiScreen.firstCloseButton
        ).isDisplayed();
        if (isFirstCloseButtonDisplayed) {
          console.log("firstCloseButton is displayed");
          await (await sChirashiScreen.firstCloseButton).click();
        }
      }

      let isNewFlyersDisplayed = await (
        await sChirashiScreen.newFlyers
      ).isDisplayed();
      console.log("isNewFlyersDisplayed: ", isNewFlyersDisplayed);
      if (isNewFlyersDisplayed) {
        await driver.execute("mobile: shell", {
          command: "input",
          args: ["tap", "700", "1600"],
          includeStderr: true,
          timeout: 2000,
        });
        await driver.pause(2000);
        if (await (await sChirashiScreen.okButton).isDisplayed()) {
          await (await sChirashiScreen.okButton).click();
          await driver.pause(1000);
        }
        for (
          let index = 0;
          index < config.RAKUTEN_SUPER_POINT_SCREEN_MAX_CHIRASHI_SWIPE_COUNT;
          index++
        ) {
          await Gestures.swipeLeft(0.7);
          await driver.pause(1000);
        }
        await (await sChirashiScreen.goBackButton).click();
        await driver.pause(1000);
        await driver.back();
        await driver.pause(1000);
      }
    } catch (error) {}
  }

  async function handleSearchInput() {
    await driver.pause(2000);
    const keyword = generateRakutenSearchKeyword();
    let previousSearchKeyword = "";
    try {
      for (
        let index = 0;
        index < config.RAKUTEN_SUPER_POINT_SCREEN_MAX_SEARCH_COUNT;
        index++
      ) {
        let searchInput = await sSearchScreen.searchInput(
          index === 0 ? "" : previousSearchKeyword,
        );
        let isSearchInputDisplayed = await searchInput.isDisplayed();
        console.log("isSearchInputDisplayed: ", isSearchInputDisplayed);
        if (isSearchInputDisplayed) {
          await searchInput.click();
          await sSearchScreen.clearButton.click();
          await driver.pause(1000);
          const tempKeywordToSearch = `${keyword} ${index + 1}`;
          console.log("tempKeywordToSearch: ", tempKeywordToSearch);
          await sSearchScreen.enterSearchKeyword(tempKeywordToSearch);
          let searchButton = await sSearchScreen.searchButton;
          if (await searchButton.isDisplayed()) {
            await searchButton.click();
            previousSearchKeyword = tempKeywordToSearch;
            await driver.pause(1000);
          }
        }
      }
      await driver.back();
      await driver.pause(1000);
    } catch (error) {}
  }

  async function handleSearchNews(keyword: string) {
    await driver.pause(2000);
    try {
      let newsLabel = await sSearchScreen.getNewsLabel(keyword);
      if (await newsLabel.isDisplayed()) {
        console.log("newsLabel is displayed: ", keyword);
        await newsLabel.click();
        await driver.pause(2000);
        const newsCount = await sSearchScreen.getNewsRowCount();
        console.log("newsCount: ", newsCount);
        for (let index = 0; index < newsCount; index++) {
          // const newsLabelInScrollable =
          //   await sSearchScreen.getNewsLabelInScrollable(2 * index);
          const newsRowIndex = await sSearchScreen.getNewsRowIndex(index);
          if (await newsRowIndex.isDisplayed()) {
            console.log(
              `newsRowIndex is displayed: ${keyword} in index: ${index}`,
            );
            await newsRowIndex.click();
            await driver.pause(2000);
            await driver.back();
            await driver.pause(2000);
          }

          newsLabel = await sSearchScreen.getNewsLabel(keyword);
          if (await newsLabel.isDisplayed()) {
            await newsLabel.click();
            await driver.pause(2000);
          }
        }
      }
    } catch (error) {
      console.error("Error occurred while handling search news:", error);
    }
  }

  it("sps_prepare", async () => {
    if (await handleMaintenance()) {
      return;
    }
    await handleSkipButton();
    await handleFirstLogin();
    await handleGuideSetting();
    await handleFirstGetPointAfterGuide();
    await handleCloseAlert();
  });

  it("sps_get_point", async () => {
    if (await handleMaintenance()) {
      return;
    }
    await handleCloseAlert();
    if (await S_TabBar.bottomIconIsDisplayed()) {
      await S_TabBar.openLuckyCoint();
      await handleClickChallenge();
      await handleClickGetPoint();
      await handleClickPlay();
    }
  });

  it("sps_chirashi", async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(2000);
    await S_TabBar.waitForTabBarShown();
    if (await handleMaintenance()) {
      return;
    }
    if (await S_TabBar.bottomIconIsDisplayed()) {
      for (
        let index = 0;
        index < config.RAKUTEN_SUPER_POINT_SCREEN_MAX_CHIRASHI_NEW_FLYER_COUNT;
        index++
      ) {
        await S_TabBar.openChirashi();
        await handleChirashiNewFlyerSwipe();
      }
    }
  });

  it("sps_search_input", async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(2000);
    await S_TabBar.waitForTabBarShown();
    if (await handleMaintenance()) {
      return;
    }
    if (await S_TabBar.bottomIconIsDisplayed()) {
      await S_TabBar.openSearch();
      await handleSearchInput();
    }
  });

  it("sps_search_news", async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(2000);
    await S_TabBar.waitForTabBarShown();
    if (await handleMaintenance()) {
      return;
    }
    if (await S_TabBar.bottomIconIsDisplayed()) {
      await S_TabBar.openSearch();
      for (
        let index = 0;
        index < config.RAKUTEN_SUPER_POINT_SCREEN_SEARCH_NEWS_LABELS.length;
        index++
      ) {
        const news =
          config.RAKUTEN_SUPER_POINT_SCREEN_SEARCH_NEWS_LABELS[index];
        console.log("news: ", news);
        await handleSearchNews(news);
      }
    }
  });

  it("sps_header_get_point", async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(2000);
    await S_TabBar.waitForTabBarShown();
    if (await handleMaintenance()) {
      return;
    }
    if (await S_TabBar.bottomIconIsDisplayed()) {
      let getPointButton = await sHeaderGetpointScreen.getPointButton();
      if (await getPointButton.isDisplayed()) {
        await getPointButton.click();
        await driver.pause(1000);
        if (await sHeaderGetpointScreen.unclaimedPointLabel.isDisplayed()) {
          console.log("unclaimedPointLabel is displayed");
          await sHeaderGetpointScreen.unclaimedPointLabel.click();
          await driver.pause(1000);
          const claimButton = await sHeaderGetpointScreen.claimButton;
          if (await claimButton.isDisplayed()) {
            console.log("claimButton is displayed");
            await claimButton.click();
            await sHeaderGetpointScreen.waitForEarnedPointsLabel();
            await driver.back();
            await driver.pause(5000);
            const closePortalButton =
              await sHeaderGetpointScreen.closePortalButton;
            if (await closePortalButton.isDisplayed()) {
              console.log("closePortalButton is displayed");
              await closePortalButton.click();
              await driver.pause(1000);
            }
          }
        }
      }
    }
  });

  it("sps_click_point_number", async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(2000);
    await S_TabBar.waitForTabBarShown();
    if (await handleMaintenance()) {
      return;
    }
    if (await S_TabBar.bottomIconIsDisplayed()) {
      await handleClickPointNumber();
    }
  });

  it("sps_challenge", async () => {
    await driver.terminateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.activateApp(config.RAKUTEN_SUPER_POINT_SCREEN_APP_ID);
    await driver.pause(2000);
    await S_TabBar.waitForTabBarShown();

    if (await handleMaintenance()) {
      return;
    }
    await handleCloseAlert();
    if (await S_TabBar.bottomIconIsDisplayed()) {
      await S_TabBar.openLuckyCoint();
      await handleClickChallenge();
      await handleClickGetPoint();
      await handleClickPlay();
    }
  });
});
