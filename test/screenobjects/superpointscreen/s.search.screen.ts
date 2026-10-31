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
  CLEAR_BUTTON: "~Clear text",

  // Search
  SEARCH_BUTTON: getByText("Search"),

  // Clickable article rows; headings and article titles are not clickable.
  NEWS_ROWS:
    '//*[@resource-id="news-articles"]//android.view.View[@clickable="true"]',

  // 主要ニュース
  NEWS_GROUPS: getByText("主要ニュース"),
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

  async waitForNewsGroups() {
    return this.waitForElementIsShown(SELECTORS.NEWS_GROUPS);
  }

  async getNewsLabelInScrollable(index: number = 0) {
    return $(getByResouceIdAndIndexInScrollable("news-articles", "b", index));
  }

  async getNewsRowCount() {
    const rows = await $$(SELECTORS.NEWS_ROWS);
    return rows.length;
  }

  async getNewsRowIndex(index: number = 0) {
    return $(`(${SELECTORS.NEWS_ROWS})[${index + 1}]`);
  }
}

export default new S_SearchScreen();
