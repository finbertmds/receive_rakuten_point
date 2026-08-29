import {
  getByClassname,
  getByResouceId,
  getByResouceIdAndIndexInScrollable,
  getByText,
} from "../../helpers/UiSelectorHelper";
import AppScreen from "../AppScreen";

const SELECTORS = {
  DEFAULT_SELECTOR: getByResouceId("android:id/content"),

  // 検索キーワードを入力
  SEARCH_INPUT: getByText("検索キーワードを入力"),

  // android.widget.EditText
  INPUT: getByClassname("android.widget.EditText", 0),

  // Clear text
  CLEAR_BUTTON: '~Clear text',

  // Search
  SEARCH_BUTTON: getByText("Search"),


};

class S_SearchScreen extends AppScreen {
  constructor() {
    super(SELECTORS.DEFAULT_SELECTOR);
  }

  async searchInput(keyword: string) {
    if (keyword === "") {
      return $(SELECTORS.SEARCH_INPUT);
    } else {
      return $(getByText(keyword));
    }
  }

  async enterSearchKeyword(keyword: string) {
    let input = await $(SELECTORS.INPUT);
    await input.setValue(keyword);
  }

  get clearButton() {
    return $(SELECTORS.CLEAR_BUTTON);
  }

  get searchButton() {
    return $(SELECTORS.SEARCH_BUTTON);
  }

  async getNewsLabel(keyword: string) {
    return $(getByText(keyword));
  }

  async getNewsLabelInScrollable(index: number = 0) {
    return $(getByResouceIdAndIndexInScrollable("news-articles", "b", index));
  }
}

export default new S_SearchScreen();
