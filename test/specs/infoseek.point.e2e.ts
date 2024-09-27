import config from '../../config';
import timeHelper from '../helpers/timeHelper';
import infoseekPage from '../pageobjects/infoseek.page';

describe('Infoseek', () => {
    beforeEach(async function () {
        const windows = await browser.getWindowHandles();
        await browser.switchToWindow(windows[0]);
    })

    async function credentials() {
        await infoseekPage.open();
        await browser.pause(config.DEFAULT_TIMEOUT);
        await infoseekPage.closeModalContents();
        await infoseekPage.closeNotificationModal();
        if (await infoseekPage.isNeedLogin()) {
            await infoseekPage.loginV2(config.RAKUTEN_USERNAME, config.RAKUTEN_PASSWORD);
        }
    }

    it('infoseek:join_mission', async () => {
        await credentials();
        await browser.pause(2000);

        await infoseekPage.closeModalContents();
        await infoseekPage.joinMission();
    });

    it('infoseek:read_articles', async () => {
        await credentials();
        await browser.pause(2000);

        await infoseekPage.closeModalContents();
        let index = timeHelper.randomFollowTime(config.INFO_SEEK_RANKING_PAGE.length - 1);
        console.log("random index: " + index);
        const rankingPage = config.INFO_SEEK_RANKING_PAGE[index];
        console.log("rankingPage: " + rankingPage);
        await infoseekPage.readArticleAtRankingPage(rankingPage);
    });

    // it('infoseek:visit_mission', async () => {
    //     await credentials();
    //     await browser.pause(2000);

    //     await infoseekPage.closeModalContents();
    //     await infoseekPage.visitMissionPage();
    // });

    it('infoseek:get_point', async () => {
        await credentials();
        await browser.pause(2000);

        await infoseekPage.closeModalContents();
        await infoseekPage.handleClickGetPoint();
    });
});


