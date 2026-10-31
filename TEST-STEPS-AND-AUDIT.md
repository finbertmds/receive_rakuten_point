# Các bước test cũ và đối chiếu Playwright

Ngày kiểm tra: 24/10/2026. Phạm vi: đọc code và kiểm tra bằng trang giả lập, chưa xác nhận chạy trên tài khoản Rakuten thật.

## 1. Nguồn đối chiếu

- Spec cũ: `../test/specs/kuji.point.e2e.ts`, `../test/specs/infoseek.point.e2e.ts`.
- Thao tác thực tế: `../test/pageobjects/kuji.page.ts`, `../test/pageobjects/infoseek.page.ts`, `../test/pageobjects/login.page.ts`, `../test/pageobjects/rakutencard.page.ts`, `../test/pageobjects/page.ts`.
- Tham số: `../config.ts`, `../test/helpers/timeHelper.ts`.
- Bản mới: `tests/kuji.point.spec.ts`, `tests/infoseek.point.spec.ts`, `src/browser.ts`, `src/kuji.ts`, `src/infoseek.ts`, `src/schedule.ts`, `src/urls.json`.

Hai file spec chứa **8 test đang bật**: 5 Kuji và 3 Infoseek. Những helper được định nghĩa nhưng không gọi không được tính là step đang chạy.

## 2. Kuji: các bước trong code cũ

### K0 — Chuẩn bị trước mỗi test

1. `beforeEach`: tạo lại WebDriver session, lấy danh sách window, chọn window đầu tiên.
2. `credentials()`: mở `LOGIN_PAGE`.
3. Nếu input `[name="u"]` hiển thị: nhập username, nhập password vào `[name="p"]`, click `[name="submit"]`, chờ 2 giây. Nếu không hiển thị thì bỏ qua login này.
4. Mở `RAKUTENCARD_HOME_PAGE`, chờ 5 giây.
5. Nếu nút `.h4k5-e2e-button__submit` đầu tiên hiển thị: chạy login V2.
6. Login V2: nếu `#user_id` hiển thị thì nhập username, click nút submit đầu tiên, chờ 2 giây; nếu `#password_current` hiển thị thì nhập password, click submit thứ hai nếu có, nếu không thì click submit đầu tiên, chờ 2 giây.
7. Nếu `#prim_continue` hiển thị thì click; chờ `DEFAULT_TIMEOUT` = 5 giây.

### K1 — `kuji__get_point1`

1. Chạy K0.
2. Mở `KUJI_HOME_PAGE`, đếm toàn bộ `.kuji_list li` thành `N`.
3. Tính `H = round(N / 2)`, `Q = round(H / 2)`, `T = round(3N / 4)`.
4. Xác định AM khi giờ máy chạy < 12.
5. Nếu AM: duyệt index `[0, Q)`; nếu PM: `[H, T)`. Nếu N = 0 thì không duyệt.
6. Với mỗi index: mở lại trang Kuji, lấy `li` tương ứng; nếu có thẻ `a` thì click `img` bên trong link đầu tiên.
7. Chờ 3 giây, đọc URL window hiện tại. Chỉ tiếp tục K3 nếu URL chứa `KUJI_HOME_PAGE`; không có link hoặc URL ngoài Kuji thì bỏ qua.
8. Nếu lỗi vòng lặp: log lỗi, reload session, đăng nhập lại; tiếp tục index sau, không thử lại index lỗi.
9. Kết thúc test: chờ 2 giây.

### K2 — `kuji__get_point2`

Giống K1, chỉ đổi phạm vi index: AM `[Q, H)`; PM `[T, N)`. Khoảng được viết theo quy ước bao gồm đầu, không bao gồm cuối.

### K3 — Xử lý một trang xổ số

1. Chờ 5 giây; nếu URL không chứa `KUJI_HOME_PAGE` thì return.
2. Nếu đi từ danh sách (`isDefaultLink=false`) và `.btn-10000` hiển thị thì click nút đó. Link mặc định không chạy bước này.
3. Chờ 5 giây. Code cũ kiểm tra lại biến URL cũ, chưa đọc URL mới tại đây.
4. Chờ 1 giây, kiểm tra `.fc-dialog-content`: nếu tồn tại, hiển thị và `.fc-rewarded-ad-button` hiển thị/click được thì click, chờ 40 giây, refresh trang rồi chờ 3 giây.
5. Chạy `handleClickEntry()`: chờ 2 giây, đọc lại URL; return nếu đã ra ngoài Kuji hoặc không có `#entry`.
6. Scroll tới `#entry`; nếu scroll lỗi thì thử cuộn xuống 5% viewport mỗi lần, tối đa 10 lần, có chờ giữa các lần.
7. Nếu entry không click được thì return; nếu click được thì click.
8. Poll mỗi 5 giây: kết thúc khi ra ngoài Kuji, `#entry` không hiển thị, hoặc đã qua 60 giây (`DEFAULT_KUJI_PAGE_TIMEOUT`). Giới hạn wait là 120 giây. Lỗi trong poll cũng được coi là kết thúc; lỗi bên ngoài được log rồi nuốt.

**Lưu ý:** code cũ không xác nhận trúng điểm. Hết 60 giây cũng có thể được coi là xong dù entry chưa biến mất.

### K4 — `kuji__default_get_point1`, `2`, `3`

1. Mỗi test chạy K0 riêng.
2. Test 1 duyệt từ `0` đến `< L/3`; test 2 từ `L/3` đến `< 2L/3`; test 3 từ `2L/3` đến `< L`, với L là độ dài `KUJI_DEFAULT_LINK`.
3. Mỗi index: mở `KUJI_DEFAULT_LINK[index]`, chạy K3 với `isDefaultLink=true`.
4. Nếu lỗi: log, reload session, đăng nhập lại, tiếp tục index sau. Cuối test chờ 2 giây.

**Lỗi hiện có trong code cũ:** L = 34, nên test 1 chạy index 0..11, test 2 bắt đầu ở 11.333..., test 3 ở 22.666...; hai test sau truy cập mảng bằng chỉ số thập phân và nhận `undefined`.

## 3. Infoseek: các bước trong code cũ

### I0 — Chuẩn bị và đăng nhập

1. `beforeEach`: reload session, chọn window đầu tiên.
2. `credentials()`: mở `INFO_SEEK_PAGE`, chờ 5 giây.
3. Nếu có interstitial đang hiển thị và nút `#interstitial_close_button` hiển thị thì click đóng.
4. Chờ 5 giây, nếu `.modalClick_contents` hiển thị và `.modalClick_close` click được thì đóng.
5. Chờ 5 giây, nếu `#notification_banner_modal` hiển thị và `#notification_close_button` click được thì đóng.
6. Nếu `.button.login` hiển thị: click, chờ 5 giây, login V2 theo bước username → Next → password → submit → `#prim_continue` nếu có, rồi chờ 5 giây. Nếu cả hai input V2 đều không hiển thị thì helper return.
7. Sau `credentials()`, mỗi test chờ thêm 2 giây.

### I1 — `infoseek__join_mission`

1. Chạy I0. Hai dòng đóng modal bổ sung trong spec đang comment, không chạy.
2. Mở `INFO_SEEK_MISSION_PAGE`, chờ 5 giây.
3. Nếu không có `.list-challenge .btn` thì return.
4. Lấy danh sách element một lần; duyệt từng index của danh sách ban đầu.
5. Scroll mission về giữa viewport, click nếu click được; nếu không thì chỉ log.
6. Chờ 5 giây; tìm thẻ `a` có text **chứa** `同意する`.
7. Nếu link đồng ý hiển thị: scroll, click, chờ 5 giây.
8. Mở lại mission list rồi xử lý mục tiếp theo. Các element cũ vẫn được giữ sau navigation, có nguy cơ stale element.
9. Lỗi từng mục/helper/spec đều được catch và log; không có assertion xác nhận đã join.

### I2 — `infoseek__get_point`

1. Chạy I0, sau đó đóng lại interstitial và modal nội dung.
2. Mở `INFO_SEEK_MISSION_PAGE`.
3. Nếu không có `.list-acquired .btn` thì return.
4. Lấy số lượng nút ban đầu; lặp đúng số lần đó.
5. Mỗi vòng truy vấn lại **nút đầu tiên** `.list-acquired .btn`, scroll và click.
6. Chờ 5 giây, đợi `.point_get` hiển thị.
7. Mở lại mission list rồi tiếp tục. Nếu lỗi, catch/log; có thể dừng các mục còn lại mà test vẫn không fail.

### I3 — `infoseek__read_articles`

1. Chạy I0, đóng lại interstitial và modal nội dung.
2. Với 8 ranking: AM chọn ngẫu nhiên index 0..3; PM chọn 4..7, theo giờ máy chạy.
3. Chạy I4 cho ranking được chọn.
4. Chờ 2 giây, chọn ranking liền sau; nếu index đầu là 7 thì vòng về 0.
5. Chạy I4 cho ranking thứ hai. Lỗi trong khối này được log rồi nuốt.

### I4 — Đọc bài ở một ranking

1. Lặp index 0..4 (`READ_ARTICLE_MAX_COUNT` = 5). **Bài không được chọn ngẫu nhiên**, dù log cũ ghi “random index”.
2. Mỗi vòng mở lại ranking qua `openPage()`: tối đa 3 lần thử navigation, chờ 2 giây và `window.stop()` khi lỗi; nếu vẫn không mở được thì return khỏi ranking.
3. Lấy `.ranking-list__text-title[index]`. Nếu hiển thị và click được: scroll, click mở bài.
4. Nếu `.reaction-icon.-iine` hiển thị/click được: scroll, click, chờ 2 giây. Helper tự bắt lỗi và trả false nếu không click được.
5. Chờ đọc bài 12 giây, kể cả khi reaction không click được.
6. Nếu reaction đã click thì ghi index vào mảng `oldRandomValue`; mảng này không được dùng để chọn bài tiếp theo.
7. Nếu lỗi vòng đọc: thử `window.stop()`, reload session, chạy callback đăng nhập lại, chờ 1 giây; tiếp tục index sau.

`infoseek__visit_mission` đang comment nên không chạy. Các hàm xử lý rewarded ad của Infoseek được định nghĩa trong page object nhưng **không được gọi trong I0–I4**.

## 4. Kết quả đối chiếu với Playwright

| Nhóm step | Vị trí mới | Kết quả / khác biệt |
| --- | --- | --- |
| K0 session mới | `src/fixtures.ts`, cấu hình Playwright | Context sạch mỗi test, thay reload WebDriver session. |
| K0 login legacy/V2 | `kujiLogin`, `loginForm` | Giữ thứ tự Rakuten → Rakuten Card. Đã sửa V2 luôn click Next sau username, kể cả password đã hiện. Bản mới yêu cầu nhận diện form; không tự bỏ qua trang login không nhận diện được. |
| K1/K2 chia danh sách | `kujiRange`, `tests/kuji.point.spec.ts` | Công thức round và phạm vi index khớp. Click link thay vì img trong link; có hỗ trợ popup. Danh sách rỗng làm fail thay vì pass im lặng. |
| K3 `.btn-10000` | `playKuji` | Chỉ click với link từ danh sách; đã thêm kiểm tra hostname mới sau click để tránh xử lý nhầm trang ngoài Kuji. |
| K3 rewarded ad | `rewardedAd(page, true)` | Có click quảng cáo và reload như cũ, nhưng chờ close/dialog thay 40 giây cố định; tối đa 90 giây. |
| K3 entry | `playKuji` | Có click và chờ kết thúc. Chờ tối đa 120 giây; không coi đủ 60 giây là thành công. Thiếu entry chỉ bỏ qua nếu có text đã chơi/hết hạn được nhận diện; trạng thái khác fail. |
| K4 link mặc định | `third`, `tests/kuji.point.spec.ts` | Sửa lỗi chỉ số thập phân. Nhóm mới 0..10, 11..21, 22..33, bao phủ đủ 34 link. Không tái tạo lỗi chia nhóm cũ. |
| I0 đóng modal | `installOverlays` | Đóng bằng handler khi nút close cản action, không chạy ba helper theo thời gian cố định như cũ. Nếu trang đã đăng nhập và không có action, modal có thể vẫn tồn tại tới action tiếp theo. |
| I0 login | `infoseekLogin`, `loginForm` | Giữ login khi `.button.login` xuất hiện; hỗ trợ tab mới, quay về home và kiểm tra nút login đã ẩn. |
| I1 join | `missions(page, false)` | Click challenge → đồng ý nếu có → về list. Đã sửa tìm link chứa `同意する` thay vì khớp tuyệt đối. Truy vấn lại theo href + text thay vì giữ element; thêm kiểm tra mission rời challenge list. |
| I2 claim | `missions(page, true)` | Click acquired → đợi `.point_get` → về list. Mới dùng danh tính href + text thay vì luôn click nút đầu; deduplicate cùng href + text. Giả định các mission khác nhau có danh tính khác nhau. |
| I3 chọn ranking | `rankingIndex`, `tests/infoseek.point.spec.ts` | Khớp hai nửa 0..3/4..7 và ranking kế tiếp, kể cả 7 → 0. Giờ mặc định được cố định Asia/Tokyo thay giờ hệ điều hành; có override AM/PM. |
| I4 đọc bài | `readRanking` | Giữ thứ tự bài 0..4, mở ranking trước mỗi bài, reaction nếu có, đọc 12 giây. Giới hạn bằng số bài có thực tế thay truy cập ngoài mảng; có env override số bài/thời gian. Bỏ sleep 2 giây sau reaction. |
| I4 quảng cáo | `readRanking` | Bổ sung rewarded ad trước reaction để xử lý trang bị che; đây là cải tiến, không phải step đang được gọi ở code Infoseek cũ. |
| Lỗi/recovery | tất cả test mới | Khác có chủ đích: fail test hiện tại, lưu bằng chứng; không reload session rồi âm thầm bỏ mục lỗi. Navigation thử tối đa 2 lần thay vì 3 ở helper ranking cũ; không tự retry thao tác nhận điểm. |

## 5. Kết luận và giới hạn

Luồng nghiệp vụ chính của cả 8 test đã có trong bản Playwright. Bản migrate **không giống 100% hành vi cũ**, vì thay cách chờ, xử lý popup, chia nhóm và báo lỗi như bảng trên. Đợt đối chiếu này sửa ba điểm: Next của login V2, link đồng ý chứa text, và kiểm tra hostname sau nút `.btn-10000`.

Kiểm tra tự động dùng HTML giả lập để xác nhận logic, không chứng minh selector và phản hồi của website thật. Chưa xác nhận OTP/CAPTCHA, phiên SSO thực tế, nội dung trang hết hạn, hoặc điểm được cộng. Việc mission biến mất/entry kết thúc chỉ xác nhận điều kiện UI, không xác nhận số dư điểm.

Chạy kiểm chứng local:

```sh
cd playwright
npm run check
npm run test:checks
npm test -- --list
```

Chạy live sau khi điền tài khoản vào `.env`:

```sh
npm run test:kuji -- --headed
npm run test:infoseek -- --headed
```

### Kết quả kiểm tra ngày 24/10/2026

- `npm run check`: PASS (TypeScript).
- `npm test -- --list`: nhận đủ 8 test trong 2 spec.
- Đối chiếu tự động 7 trường URL với config cũ: khớp, gồm 34 link Kuji và 8 ranking.
- `npm run test:checks`: **6/6 PASS** trên Chromium (42.8 giây): chia nhóm/phạm vi Kuji; popup + modal; danh sách co lại khi join; danh sách co lại khi claim; V2 bắt buộc Next khi password đã hiện; link đồng ý có thêm chữ.
- Các kiểm tra này không chạy tài khoản thật, chưa kiểm chứng toàn bộ K0–K4/I0–I4 với website live.

### Sửa lỗi Kuji từ trace chạy thật ngày 24/10/2026

Cả 5 trace lỗi đều ghi nhận URL `/already`, sau đó tự chuyển sang trang quảng bá (Calendar, Rakuten Securities, Pay, Toolbar hoặc Infoseek). Assertion cũ tiếp tục tìm chữ đã chơi trên trang quảng bá nên timeout.

`playKuji` hiện nhận diện `/already` trên đúng hostname Kuji, ghi nhớ trạng thái này khi đang chờ, và kiểm tra chuyển hướng ra ngoài Kuji trong quá trình đợi entry. Trang không có entry, không có bằng chứng đã chơi/hết hạn và không chuyển hướng vẫn báo lỗi. Bổ sung kiểm tra HTML giả lập cho URL already không có text, chuyển sang already chậm và chuyển hướng quảng bá.

### Sửa lỗi quảng cáo GMOSSP che entry

Trace lỗi tại `1e842a2ecd` cho thấy `#entry` hiển thị nhưng iframe `title="GMOSSP iframe"` trong `#lot_page_header` chặn pointer events. Screenshot có quảng cáo toàn màn hình và nút ×; snapshot xác định nút đóng `.gmoam_close_button`.

`installOverlays` bổ sung handler cho nút đóng ở trang chính và trong iframe GMOSSP, chạy trong quá trình Playwright kiểm tra khả năng click để xử lý cả quảng cáo xuất hiện chậm. Click entry vẫn dùng kiểm tra actionability bình thường. Hai test giả lập quảng cáo iframe khác origin kiểm tra quảng cáo có sẵn/xuất hiện chậm, được đóng và entry chỉ được click một lần. Chưa xác nhận lại trên website thật.

### Sửa lỗi Infoseek từ log chạy ngày 24/10/2026

- Mission: trace cho thấy `.list-challenge` chứa cả nhiệm vụ `参加中`; `.btn` là div bọc thẻ a. Selector mới lấy thẻ a thực tế, bỏ qua mục đã tham gia, và xác nhận mục không còn cần join (biến mất hoặc chuyển sang trạng thái tham gia).
- Đọc bài: bổ sung nút đóng Taboola `.tbl-explore-more-close`, Gunosy `#gn_interstitial_close_icon` (trang chính/iframe `#gn_interstitial_iframe_content`), quảng cáo wipe và interstitial GPT theo selector có trong trace.
- Bổ sung ba test giả lập: bỏ qua mục đã tham gia với markup thật, trạng thái tham gia vẫn ở challenge list, và đóng nối tiếp iframe Gunosy → overlay Taboola trước khi Like. Chưa chạy lại trên tài khoản thật.

### Sửa handler khi nhiều quảng cáo chồng nhau

Log mới cho thấy nút đóng GPT bị iframe Gunosy che. Các handler riêng lẻ không xử lý được lớp quảng cáo phía trên khi đang đợi click lớp dưới. Thay bằng một handler chung: kiểm tra khả năng click bằng `trial`, bỏ qua nút bị che và tìm nút có thể click ở trang chính/các iframe; sau mỗi lần đóng sẽ truy vấn lại. Không force click. Giới hạn 12 lần đóng mỗi lượt handler. Test hồi quy bổ sung GPT ở dưới Gunosy và Taboola để tái hiện đúng lỗi chồng lớp.

### Race condition iframe bị xóa khi handler chạy

Bọc cả truy vấn `locator.all()` và thao tác click bằng xử lý frame đã detach/chuyển navigation context. Chỉ bỏ qua lỗi vòng đời frame khi trang vẫn mở; các lỗi khác vẫn được báo. Áp dụng cùng kiểm tra trong rewarded ad. Test tái hiện frame biến mất sau pre-check dùng frame thật đã bị detach và ép pre-check trả kết quả cũ. TypeScript PASS, toàn bộ 15 test hồi quy PASS.

Kiểm chứng live tiếp tục phát hiện Gunosy có nút đóng dạng text `#gn_ydn_interstitial_btn` và SSO có thể quay thẳng về Infoseek mà không hiện login form. Đã bổ sung selector/test cho biến thể nút đóng, đồng thời chờ form hoặc authenticated return trước khi gọi `loginForm`. Test SSO và cả hai biến thể Gunosy đều PASS.

### Kết quả kiểm chứng cuối sau khi chạy website thật

- Handler chỉ lấy iframe GMOSSP/Gunosy trực tiếp từ DOM; không duyệt mọi iframe tracking. Truy vấn nút đóng có giới hạn thời gian, handler có ngân sách 2,5 giây.
- Nút Like `is-active`/`is-disabled` được bỏ qua; không click lại qua click wall. Trial click được dành đủ thời gian cho handler đóng quảng cáo.
- SSO quay thẳng về Infoseek được nhận diện trước khi chờ login form.
- `npm run check`: PASS. `npm run test:checks`: **18/18 PASS**.
- Chạy website thật với cấu hình `.env` hiện tại: `npm run test:infoseek -- --grep infoseek__read_articles --headed --reporter=list --output=test-results-live`: **1/1 PASS (3,0 phút)** ngày 24/10/2026. Đây là xác nhận một lần chạy hiện tại, không đảm bảo mọi biến thể quảng cáo trong tương lai.

## Migration Campaign và Card

Nguồn: `test/specs/campaign.point.e2e.ts`, `test/specs/card.point.e2e.ts`, `test/pageobjects/campaign.page.ts`, `test/pageobjects/rakutencard.page.ts`.

Cả hai spec mới dùng lại `kujiLogin` (alias `rakutenCardLogin`) vì luồng cũ giống nhau: LOGIN_PAGE → legacy login → RAKUTENCARD_HOME_PAGE → V2 nếu cần. Giữ session sạch mỗi test qua fixtures và không retry thao tác có tác dụng phụ.

| Luồng cũ | Bản Playwright |
| --- | --- |
| Campaign duyệt `CAMPAIGN_PAGE_LIST` | Sao chép đúng 4 URL sang `src/urls.json`; mỗi URL là một test step. Sửa lỗi thiếu `await this.open()` của code cũ. |
| Đóng notice rồi tìm nút entry | `enterCampaign`: đóng `.spu-popup-notice__footer-close`; giữ thứ tự ưu tiên 3 selector; click tối đa một entry mỗi URL; hỗ trợ popup. |
| Campaign chờ sau click | Giữ 5 giây để request đăng ký có thời gian xử lý; log `entry-clicked` chỉ xác nhận click, không khẳng định đăng ký thành công. Không thấy nút hoặc nút disabled có trạng thái riêng. |
| Card mở và đọc nhãn point | `clickCardPoints`: mở Card, log nhãn nếu có, bỏ qua có log khi không có link click-point. |
| Click tất cả banner | Chụp danh tính href + src rồi truy vấn lại sau mỗi click/navigation; banner bị xóa khỏi list không làm mất banner kế tiếp; hỗ trợ list/banner mở popup. Nếu banner không có href/src thì fallback index như code cũ. |
| Card chờ nhận điểm | Giữ 2 giây mỗi banner và 15 giây cuối; bỏ JavaScript DOM click, dùng click có kiểm tra actionability. Không xác nhận thay đổi số dư điểm. |
| Video Card | Helper `handlClickVideo` không được gọi trong spec cũ nên không migrate thành test mới. |

Hai spec mới không thay runner `run_all_tests.sh` và không thay WebdriverIO cũ. Thêm `npm run test:campaign -- --headed` và `npm run test:card -- --headed`. Chưa chạy hai spec mới trên tài khoản thật.

Kiểm tra migration Campaign/Card: TypeScript PASS; runner nhận 10 test trong 4 spec; 4 URL Campaign khớp config cũ; toàn bộ **23/23 test hồi quy PASS (2,3 phút)**, gồm 5 test mới cho 3 selector Campaign, Campaign không có entry, và Card banner co lại + popup. Chưa xác minh hai spec mới trên website thật.

### Hai lần chạy 31/10/2026 lúc 08:05 và 14:05 (JST)

- 08:05: Infoseek lỗi cả ba lượt; iframe `gn_interstitial_iframe_content` chặn Like, một lượt còn lỗi execution context khi tìm iframe.
- 14:05: Infoseek tiếp tục lỗi tương tự; Kuji lỗi cả ba lượt và Campaign lỗi lượt đầu tại `browser.ts` khi `elementHandles()` chạy trong lúc trang chuyển hướng. Campaign thành công khi retry.
- Handler cũ kiểm tra trang chính trước iframe, dễ dùng hết ngân sách 2,5 giây với các nút bị che. `Promise.race` 300 ms còn có thể bỏ qua kết quả truy vấn nút đóng, nhất là khi ghi trace của trang nhiều iframe.
- Sửa: ưu tiên iframe quảng cáo trước trang chính; bỏ race 300 ms cho truy vấn `.all()` (truy vấn này không tự chờ phần tử xuất hiện); giữ giới hạn actionability/click và ngân sách handler. Bắt lỗi context/frame thay đổi cả trong bước phát hiện iframe, để action đang chờ có thể tiếp tục sau redirect.
- Thêm test hồi quy: 12 nút đóng bị iframe che và lỗi context đúng tại bước `elementHandles()`. Không dùng force click, không phát lại thao tác nhận điểm.
- Kiểm chứng sau sửa: `npm run check` PASS; `npm run test:checks -- --output=/tmp/rakuten-overlay-checks` PASS 25/25 (2,4 phút), gồm cả hai test mới. Chromium cần chạy ngoài sandbox vì macOS chặn MachPort trong sandbox. Chưa chạy lại toàn bộ luồng trên website thật.

### Infoseek 31/10/2026 lúc 19:05 (JST): iframe còn sót sau khi đóng

- Cả ba lượt đọc bài đều lỗi; join/get-point thành công. Bản sửa ưu tiên iframe chưa đủ.
- Đối chiếu trace lần cuối: click `gn_interstitial_close_icon` thành công (`jxas@930`); snapshot sau đó cho thấy `#gn_interstitial_area` có `display:none`, nhưng iframe cha `#gn_interstitial_iframe_content` vẫn fixed toàn màn hình, z-index 2147483647 và tiếp tục chặn pointer events.
- Handler giờ kiểm tra trạng thái đóng trong iframe. Chỉ khi vùng quảng cáo Gunosy đã có computed `display:none`, mới ẩn iframe Gunosy còn sót; không force click Like hoặc ẩn quảng cáo đang hiển thị.
- Thêm hai test tái hiện: đóng chỉ ẩn nội dung iframe, và nội dung đã đóng trước khi handler chạy. Cả hai kiểm tra iframe không còn che và Like chỉ click một lần.
- Kiểm chứng: `npm run check` PASS; 25 test cũ PASS. Test mới ban đầu có lỗi escape HTML trong fixture, đã sửa và chạy riêng lại: 2/2 PASS (`npm run test:checks -- checks/infoseek-overlay.spec.ts --output=/tmp/rakuten-dismissal-checks`).
- Xác minh website thật: `npm run test:infoseek -- --output=/tmp/rakuten-1905-live` PASS 3/3 trong 3,3 phút, gồm join mission, get point và đọc đủ hai ranking với cấu hình mặc định (tối đa 5 bài mỗi ranking). Không thay đổi retry hoặc bỏ qua lỗi để làm test xanh.

### Challenge: truy cập lần lượt cả các nhiệm vụ đang tham gia

Theo yêu cầu mới, `missions(page, false)` chọn link `チャレンジ` trong danh sách challenge kể cả `参加中`. Click lần lượt theo thứ tự danh sách, chờ trang đích DOMContentLoaded rồi giữ 3 giây, quay lại mission list trước mục tiếp theo; khi dùng popup thì đóng popup sau thời gian chờ. Không còn yêu cầu mục challenge biến mất hoặc gửi form đồng ý. Các thẻ cùng URL vẫn được truy cập riêng. Nhánh claim giữ nguyên.
Kiểm chứng: TypeScript PASS; 7 test mission/challenge PASS, thêm lượt 2/2 PASS cho ba thẻ với URL trùng nhau (cùng tab và popup). Các test kiểm tra thứ tự click, thời gian giữ trang tối thiểu 3 giây và URL cuối cùng là mission list.
