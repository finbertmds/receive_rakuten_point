import config from "../../config";
import timeHelper from "../helpers/timeHelper";
import infoseekPage from "../pageobjects/infoseek.page";

describe("Infoseek", () => {
  beforeEach(async function () {
    await browser.reloadSession();
    const windows = await browser.getWindowHandles();
    await browser.switchToWindow(windows[0]);
  });

  async function credentials() {
    await infoseekPage.open();
    await browser.pause(config.DEFAULT_TIMEOUT);
    await infoseekPage.handleCloseInterstitialModal();
    await infoseekPage.closeModalContents();
    await infoseekPage.closeNotificationModal();
    if (await infoseekPage.isNeedLogin()) {
      await infoseekPage.loginV2(
        config.RAKUTEN_USERNAME,
        config.RAKUTEN_PASSWORD,
      );
    }
  }

  it("infoseek__join_mission", async () => {
    try {
      await credentials();
      await browser.pause(2000);

      // await infoseekPage.handleCloseInterstitialModal();
      // await infoseekPage.closeModalContents();
      await infoseekPage.joinMission();
    } catch (error) {
      console.error("Error in infoseek__join_mission test: ", error);
    }
  });

  it("infoseek__get_point", async () => {
    try {
      await credentials();
      await browser.pause(2000);

      await infoseekPage.handleCloseInterstitialModal();
      await infoseekPage.closeModalContents();
      await infoseekPage.handleClickGetPoint();
    } catch (error) {
      console.error("Error in infoseek__get_point test: ", error);
    }
  });

  it("infoseek__read_articles", async () => {
    await credentials();
    await browser.pause(2000);

    try {
      await infoseekPage.handleCloseInterstitialModal();
      await infoseekPage.closeModalContents();
      let index = timeHelper.randomFollowTime(
        config.INFO_SEEK_RANKING_PAGE.length - 1,
      );
      console.log("random index: " + index);
      const rankingPage = config.INFO_SEEK_RANKING_PAGE[index];
      console.log("rankingPage: " + rankingPage);
      await infoseekPage.readArticleAtRankingPage(rankingPage, credentials);
      await browser.pause(2000);
      let rankingPage2;
      if (index < config.INFO_SEEK_RANKING_PAGE.length - 1) {
        rankingPage2 = config.INFO_SEEK_RANKING_PAGE[index + 1];
      } else {
        rankingPage2 = config.INFO_SEEK_RANKING_PAGE[0];
      }
      console.log("rankingPage2: " + rankingPage2);
      await infoseekPage.readArticleAtRankingPage(rankingPage2, credentials);
    } catch (error) {
      console.error("Error in infoseek__read_articles test: ", error);
    }
  });

  // it('infoseek__visit_mission', async () => {
  //     await credentials();
  //     await browser.pause(2000);

  //     await infoseekPage.closeModalContents();
  //     await infoseekPage.visitMissionPage();
  // });
});
