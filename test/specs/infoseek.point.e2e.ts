import config from '../../config';
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

    it('infoseek_join_mission', async () => {
        await credentials();
        await browser.pause(2000);

        await infoseekPage.closeModalContents();
        await infoseekPage.joinMission();
    });

    it('infoseek_read_articles', async () => {
        await credentials();
        await browser.pause(2000);

        await infoseekPage.closeModalContents();
        for (let index = 0; index < config.INFO_SEEK_RANKING_PAGE.length; index++) {
            const rankingPage = config.INFO_SEEK_RANKING_PAGE[index];
            await infoseekPage.readArticleAtRankingPage(rankingPage);
        }
    });

    // it('infoseek_visit_mission', async () => {
    //     await credentials();
    //     await browser.pause(2000);

    //     await infoseekPage.closeModalContents();
    //     await infoseekPage.visitMissionPage();
    // });

    it('infoseek_get_point', async () => {
        await credentials();
        await browser.pause(2000);

        await infoseekPage.closeModalContents();
        await infoseekPage.handleClickGetPoint();
    });
});


