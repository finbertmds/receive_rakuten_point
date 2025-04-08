import { getByClassname, getByResouceId, getByText } from '../../helpers/UiSelectorHelper';
import AppScreen from '../AppScreen';

const SELECTORS = {
    Rakuten: "~Rakuten",

    Rakuten_Reward: getByText("Rakuten Reward(App Mission)"),
    Point_Get_Corner: getByText("Point Get Corner"),
    Rakuten_Web_Search_Home: getByText("Rakuten Web Search Home"),
    Close_Portal: "~Close Portal",

    ad_wrap: getByResouceId("ad_wrap"),
    Image: getByClassname("android.widget.Image"),
    Close: "~Close",

    Unclaimed_Points: "~Unclaimed Points",
    rakutenreward_claimbutton: getByResouceId("jp.co.rakuten.toolbar.raws:id/rakutenreward_claimbutton"),
};

class T_HomeScreen extends AppScreen {
    constructor() {
        super(SELECTORS.Rakuten);
    }

    get Rakuten() {
        return $(SELECTORS.Rakuten);
    }

    get Rakuten_Reward() {
        return $(SELECTORS.Rakuten_Reward);
    }

    get Point_Get_Corner() {
        return $(SELECTORS.Point_Get_Corner);
    }

    get Rakuten_Web_Search_Home() {
        return $(SELECTORS.Rakuten_Web_Search_Home);
    }

    get Close_Portal() {
        return $(SELECTORS.Close_Portal);
    }

    get ad_wrap() {
        return $(SELECTORS.ad_wrap);
    }

    async ad_wrapImageList() {
        if (await this.ad_wrap.isExisting()) {
            let ad_wrapImageList = this.ad_wrap.$$(getByClassname("android.widget.Image"));
            if (ad_wrapImageList) {
                return ad_wrapImageList;
            }
        }
        return null;
    }

    async ad_wrapImageIndex(index: number) {
        let ad_wrapImageList = await this.ad_wrapImageList();
        if (ad_wrapImageList === null) {
            return null;
        }
        if (ad_wrapImageList.length > index) {
            let ad_wrapImageElement = this.ad_wrap.$(getByClassname("android.widget.Image", index));
            if (ad_wrapImageElement) {
                return ad_wrapImageElement;
            }
        }
        return null;
    }

    get Close() {
        return $(SELECTORS.Close);
    }

    get Unclaimed_Points() {
        return $(SELECTORS.Unclaimed_Points);
    }

    get rakutenreward_claimbutton() {
        return $(SELECTORS.rakutenreward_claimbutton);
    }
}

export default new T_HomeScreen();
