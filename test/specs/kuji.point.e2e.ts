import config from "../../config";
import timeHelper from "../helpers/timeHelper";
import kujiPage from "../pageobjects/kuji.page";
import loginPage from "../pageobjects/login.page";
import rakutencardPage from "../pageobjects/rakutencard.page";

describe("Rakuten", () => {
  beforeEach(async function () {
    await browser.reloadSession();
    const windows = await browser.getWindowHandles();
    await browser.switchToWindow(windows[0]);
  });

  async function credentials() {
    await loginPage.open();
    await loginPage.login(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);

    await rakutencardPage.open();
    await browser.pause(5000);
    if (await rakutencardPage.isNeedLogin()) {
      await rakutencardPage.loginV2(
        config.RAKUTEN_USERNAME,
        config.RAKUTEN_PASSWORD,
      );
    }
  }

  it("kuji__get_point1", async () => {
    await credentials();
    await kujiPage.open();
    let kujiCount = await kujiPage.getKujiCount();
    let isAM = timeHelper.checkIsAM();
    if (kujiCount > 0) {
      let kujiCountHalf = Math.round(kujiCount / 2);
      let kujiCountQuarter = Math.round(kujiCountHalf / 2);
      let kujiCountThreeQuarters = Math.round((kujiCount * 3) / 4);
      let startIndex = isAM ? 0 : kujiCountHalf;
      let endIndex = isAM ? kujiCountQuarter : kujiCountThreeQuarters;
      for (let index = startIndex; index < endIndex; index++) {
        try {
          await kujiPage.open();
          console.log("open kuji 1 at " + index);
          let clickedKuji = await kujiPage.handleClickKujiElementIndex(index);
          if (clickedKuji) {
            await kujiPage.handleProcessAfterClickKuji(index, false);
          }
        } catch (error) {
          console.log(
            "open kuji 1 at " + index + " kuji__get_point1 error: " + error,
          );
          await browser.reloadSession();
          await credentials();
        }
      }
    }
    await browser.pause(2000);
  });

  it("kuji__get_point2", async () => {
    await credentials();
    await kujiPage.open();
    let kujiCount = await kujiPage.getKujiCount();
    let isAM = timeHelper.checkIsAM();
    if (kujiCount > 0) {
      let kujiCountHalf = Math.round(kujiCount / 2);
      let kujiCountQuarter = Math.round(kujiCountHalf / 2);
      let kujiCountThreeQuarters = Math.round((kujiCount * 3) / 4);
      let startIndex = isAM ? kujiCountQuarter : kujiCountThreeQuarters;
      let endIndex = isAM ? kujiCountHalf : kujiCount;
      for (let index = startIndex; index < endIndex; index++) {
        try {
          await kujiPage.open();
          console.log("open kuji 2 at " + index);
          let clickedKuji = await kujiPage.handleClickKujiElementIndex(index);
          if (clickedKuji) {
            await kujiPage.handleProcessAfterClickKuji(index, false);
          }
        } catch (error) {
          console.log(
            "open kuji 2 at " + index + " kuji__get_point2 error: " + error,
          );
          await browser.reloadSession();
          await credentials();
        }
      }
    }
    await browser.pause(2000);
  });

  it("kuji__default_get_point1", async () => {
    await credentials();
    for (let index = 0; index < config.KUJI_DEFAULT_LINK.length / 3; index++) {
      try {
        await kujiPage.open(config.KUJI_DEFAULT_LINK[index]);
        await kujiPage.handleProcessAfterClickKuji(index, true);
      } catch (error) {
        console.log("kuji__default_get_point1 error: " + error);
        await browser.reloadSession();
        await credentials();
      }
    }
    await browser.pause(2000);
  });

  it("kuji__default_get_point2", async () => {
    await credentials();
    for (
      let index = config.KUJI_DEFAULT_LINK.length / 3;
      index < (config.KUJI_DEFAULT_LINK.length / 3) * 2;
      index++
    ) {
      try {
        await kujiPage.open(config.KUJI_DEFAULT_LINK[index]);
        await kujiPage.handleProcessAfterClickKuji(index, true);
      } catch (error) {
        console.log("kuji__default_get_point2 error: " + error);
        await browser.reloadSession();
        await credentials();
      }
    }
    await browser.pause(2000);
  });

  it("kuji__default_get_point3", async () => {
    await credentials();
    for (
      let index = (config.KUJI_DEFAULT_LINK.length / 3) * 2;
      index < config.KUJI_DEFAULT_LINK.length;
      index++
    ) {
      try {
        await kujiPage.open(config.KUJI_DEFAULT_LINK[index]);
        await kujiPage.handleProcessAfterClickKuji(index, true);
      } catch (error) {
        console.log("kuji__default_get_point3 error: " + error);
        await browser.reloadSession();
        await credentials();
      }
    }
    await browser.pause(2000);
  });
});
