# Rakuten Point — Playwright

Chi tiết step của các spec cũ và kết quả đối chiếu: [TEST-STEPS-AND-AUDIT.md](TEST-STEPS-AND-AUDIT.md).

Project độc lập với WebdriverIO, đặt trong `playwright/`. Không sửa runner hay test cũ. Yêu cầu Node.js 22.9+ (khuyến nghị Node 24).

```sh
cd playwright
npm ci
npx playwright install chromium
cp .env.example .env
# Điền RAKUTEN_USERNAME và RAKUTEN_PASSWORD vào .env
npm run test:headed
```

```sh
npm run test:kuji -- --headed
npm run test:infoseek -- --headed
npm run test:campaign -- --headed
npm run test:card -- --headed
npm test -- --grep infoseek__read_articles --headed
npm run check
npm run test:checks
npm run report
```

Không tự đọc thông tin tài khoản từ `../config.ts`. `.env`, report, video và trace chỉ lưu local; trace có thể chứa thông tin tài khoản. Không commit hoặc chia sẻ chúng công khai.

## Các bước đã migrate

| Test cũ | Các bước Playwright |
| --- | --- |
| `kuji__get_point1`, `kuji__get_point2` | Đăng nhập Rakuten → mở Rakuten Card, đăng nhập V2 nếu có → mở Kuji → đếm `.kuji_list li` → chọn phần danh sách theo AM/PM → click link → theo popup nếu có → `.btn-10000` nếu có → xử lý rewarded ad → click `#entry` → chờ entry biến mất hoặc chuyển URL. |
| `kuji__default_get_point1..3` | Cùng bước đăng nhập → chia toàn bộ 34 link thành 3 nhóm nguyên → mở từng link, theo redirect → xử lý quảng cáo → click entry; giữ hành vi không click `.btn-10000` cho link mặc định. |
| `campaign__entry_campaign` | Cùng luồng đăng nhập Rakuten → Rakuten Card như Kuji → duyệt 4 URL campaign → đóng notice → chọn một nút entry theo thứ tự `.rcEntryButton-button`, `.btn-entry-anim`, `.btn-entry-wrap` → click, theo popup và chờ 5 giây. Log `entry-clicked`, `no-entry`, hoặc `entry-disabled`. |
| `card__click_link_get_point` | Cùng luồng đăng nhập → mở Card → đọc nhãn tổng click-point → mở mục click-point → chụp danh tính banner → truy vấn lại và click từng banner, xử lý popup → chờ 2 giây mỗi banner và 15 giây cuối như code cũ. |
| `infoseek__join_mission` | Mở Infoseek → đóng modal khi chặn thao tác → login V2 nếu cần → mission list → lấy danh tính link challenge → truy vấn lại link sau mỗi lần về list → click → đồng ý nếu có → kiểm tra mission đã rời challenge list. |
| `infoseek__get_point` | Login → mission list → truy vấn lại từng link acquired → click nhận điểm → đợi `.point_get` → quay lại list. |
| `infoseek__read_articles` | Login → chọn ngẫu nhiên ranking trong nửa sáng/chiều, rồi ranking kế tiếp (vòng về đầu nếu cần) → tối đa 5 bài mỗi ranking → click bài, theo popup → xử lý rewarded ad → click reaction nếu có → đọc 12 giây → bài tiếp theo. |

Test `infoseek__visit_mission` vốn bị comment nên không bật thêm. AM/PM mặc định theo `Asia/Tokyo`; có thể đặt `RUN_PERIOD=AM` hoặc `PM` trong `.env`. `ARTICLE_COUNT` và `ARTICLE_READ_MS` điều chỉnh số bài/thời gian đọc.

## Thay đổi để giảm lỗi

Log `logs/run_rakuten_point_20261023_220504.log` có `DiscardedBrowsingContextError`/`no such frame`, `no such node`, lỗi XPath của BiDi, cuộn ngoài viewport, cuối cùng timeout đọc bài và xóa session. Những dòng lỗi protocol không tự chứng minh từng thao tác đã thất bại, nhưng cho thấy luồng Firefox/WebDriver gặp vấn đề khi điều hướng và truy vấn element.

- Dùng Chromium do Playwright quản lý, không phụ thuộc chromedriver/geckodriver hoặc extension cũ.
- Mỗi test có browser context sạch; không reload WebDriver session trong vòng lặp.
- Dùng locator thay cho giữ element cũ qua navigation. Playwright tự chờ element có thể click; không force click.
- Đợi `domcontentloaded` thay vì đợi toàn bộ quảng cáo tải xong. Chỉ navigation GET được thử lại một lần.
- Đăng ký listener popup trước click; đóng tab phụ sau mỗi mục.
- Handler xử lý ba loại modal ngay khi chúng chặn action. Rewarded ad được chờ theo trạng thái, giới hạn 90 giây.
- Giữ thời gian đọc 12 giây vì đó là thời gian thực hiện nhiệm vụ, bỏ các sleep tải trang cố định.
- Sửa chia 34 link cho 3: code cũ bắt đầu vòng lặp ở `34/3`, dẫn tới truy cập mảng bằng chỉ số thập phân.
- Chạy 1 worker, không tự retry cả test để tránh lặp thao tác nhận điểm. Lỗi thật làm test fail kèm trace, video và screenshot; dừng test hiện tại thay vì nuốt lỗi. Các test khác vẫn chạy.

## Giới hạn kiểm chứng

Đã kiểm tra TypeScript, runner nhận đủ 10 test trong 4 spec. Bộ regression bao gồm Campaign/Card và các luồng Kuji/Infoseek. `npm run test:checks` dùng trang giả lập, không đăng nhập hay nhận điểm thật. Chạy `npm run test:headed` để xác minh selector với website hiện tại. Nếu Rakuten yêu cầu CAPTCHA/OTP hoặc đổi giao diện, test sẽ báo lỗi để kiểm tra; không có xử lý vượt CAPTCHA/OTP.

Link ngoài hostname Kuji được ghi `outside-kuji`, giữ phạm vi của code cũ; không tính là nhận điểm thành công. Trang không có `#entry` chỉ được bỏ qua khi tìm thấy thông báo đã chơi/hết hạn được nhận diện; trạng thái lạ sẽ fail. Việc entry biến mất/chuyển URL xác nhận thao tác hoàn tất, không xác nhận số điểm trúng. Các link mặc định được sao chép từ config cũ và có thể hết hạn.

Chưa tích hợp vào `run_all_tests.sh`; dùng các lệnh riêng ở trên để chuyển dần sau khi kiểm tra live.

Campaign/Card đã được kiểm tra bằng trang giả lập; chưa chạy hai spec mới trên tài khoản thật. `entry-clicked`/`banners-clicked` xác nhận thao tác click, chưa xác nhận đăng ký thành công hoặc điểm được cộng. Campaign hết hạn/không có entry và Card không có link/banner được ghi rõ trong log. Không tự retry thao tác đăng ký/nhận điểm.
