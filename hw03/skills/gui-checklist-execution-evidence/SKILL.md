---
name: gui-checklist-execution-evidence
description: "Thực thi GUI checklist có oracle và prerequisite graph; dùng khi cần pilot, execution hoặc review evidence theo ID/variant/page/platform/attempt, với blocked và human review tách khỏi runner."
---

# Thực thi GUI checklist và evidence

## 1. Chốt đầu vào và quyền

Đọc checklist, spec, kế hoạch, baseline và phạm vi được duyệt. Dùng [JSON contract](references/contract.md) và [manifest mẫu](assets/manifest-example.json); mẫu không là kết quả đã chạy hoặc full manifest. Playwright Test + reporter native là lựa chọn đã duyệt cho workflow này; dependency ở harness riêng, không trong SUT. Không tự cài plugin/framework khác. Skill không mặc định cấp quyền chạy server, full suite, stage, commit, push hoặc publish. Chỉ đọc checklist/PLAN/spec, không tự đổi expected hay hồ sơ AI.

Dùng [source runner trong repository](../../tools/gui-harness/README.md) và [materializer](scripts/materialize-harness.mjs) để tạo harness làm việc mới ngoài repo. Skill cần đi cùng `hw03/tools/gui-harness` trong repository; copy riêng folder skill không mang theo runner. Materializer từ chối target có sẵn, chỉ copy source, không tự install/start. Sau đó mới cài dependency/browser nếu được duyệt. Nhận SUT_ROOT, HARNESS_ROOT, RUNS_ROOT, URL và baseline từ cấu hình, không hardcode máy. Ví dụ bố trí HW03: harness tại _working/eshop-sut-HW03/t02-harness, output cạnh nó tại ../t02-runs; đây chỉ là minh họa deployment.

**Xong khi:** input có nguồn/hash; quyền cài/chạy/ghi/export rõ; thiếu quyết định an toàn được ghi blocker trước mutation.

## 2. Preflight an toàn và capability

Kiểm launcher trước startup: không import initializer/DROP/seed; không chạy entrypoint tiêu chuẩn chưa kiểm tra. Runtime riêng không sửa production source; đối chiếu fixture/ảnh read-only, fingerprint trước/sau. Thiếu fixture thì dừng, không seed/reset. Wrapper READONLY chỉ chứng minh đường đọc, không dùng SQLITE_READONLY kết luận bug ghi/validation. Context sạch không reset server memory/database.

Xác minh runner/package/browser version, OS thật, platform matrix, quyền artifact và capture. Fresh context cho biến thể độc lập, không chỉ tab mới. Không auth token/cart/storage cũ trong origin/context khảo sát; không xóa ngoài phạm vi. Ghi service worker/interception/mock mode. Hai viewport không là hai platform; WebKit không là Safari; mobile emulation không là Android thật; Firefox Playwright ghi đúng binary. Không suy platform chỉ từ UA.

Prove capability trước tình huống dùng nó: giữ/thả đúng request; keyboard; browser zoom 200% thật; IME thật; ảnh cửa sổ có URL/browser chrome. CSS zoom, viewport/DPR không thay browser zoom; Unicode fill không thay composition/IME; page screenshot không có browser chrome. Thiếu capability thì blocked riêng variant, không dựng bằng chứng giả. Headed trong isolated agent session không có nghĩa người dùng nhìn thấy; handoff theo workflow được hỗ trợ.

**Xong khi:** capability map có proof hoặc blocker, no-seed được kiểm chứng; platform chưa có không được tính đã chạy.

## 3. Compile manifest và prerequisite graph

Tách ID thành variant dữ liệu × page × platform × viewport × phương thức action khi áp dụng; giữ expected và nguồn R/L/H cho từng assertion. Không lấy implementation làm oracle. R là requirement trực tiếp; L là chủ đề/kỹ thuật giảng dạy, không tự sinh requirement; H là heuristic, vi phạm ghi design finding chứ không tự quy bug trái SRS. Oracle hỗn hợp kết luận riêng từng phần; màu/semantic/applicability chưa rõ phải needs-review, không đoán.

DAG phụ thuộc ở cấp instance chính xác, không cấp trang/ID toàn cục. Chỉ tạo edge nếu downstream thật sự cần state/capability upstream cung cấp; ghi requires/provides, target và lý do. Giữ cùng context khi state liên tục. Root action chạy trước downstream tiêu thụ state. Root click đầu không đạt expected => fail tại root; downstream thiếu state => blocked reference tới attempt root, không bấm thêm gây chi phí/đổi state. Không biến bug first-click thành yêu cầu double-click. Không blanket block input/layout/label hoặc Home vì Detail fail. Input độc lập vẫn chạy; phần chứng minh validation sau action có thể blocked. Edge khác page chỉ khi state thật đi xuyên trang (Home cart state → badge Detail), không vì cùng tên nút.

**Xong khi:** mọi ID/variant bắt buộc được map; DAG không cycle/target mồ côi; edge đúng page/variant/platform và không block phần độc lập; oracle/capability chưa chốt ghi rõ.

## 4. Chạy theo nhánh

- **Pilot pipeline:** chọn tập nhỏ đại diện search, input/validation, keyboard/hybrid, empty state, ordered network và root dependency liên quan. Bắt đầu một worker để correlation rõ. Pilot không là full execution hay usability pilot người thật.
- **Full execution:** chỉ sau pilot được review và lane/platform/capability đủ; chạy mọi instance được duyệt. Thiếu lane giữ blocked/not-run, không auto-pass.
- **Reuse flow khác:** nhập checklist/spec/fixture/graph/platform mới, compile và pilot lại; không copy expected/seed/selector hay đủ-50-ID từ HW03. Ghi use record/demo riêng; file skill không chứng minh reuse đã xảy ra.
- **Review evidence có sẵn:** kiểm hash/links/attempt/status/oracle và review; không giả đã re-execute. Thiếu evidence ghi needs-review/blocked theo contract.

Đăng ký logger/route/console/error trước action. Locator hướng người dùng, quan sát lại sau thay đổi; exact UI actions, không API/DOM injection thay click đang kiểm thử, không force/JS click/action retry che lỗi. API chỉ hỗ trợ đối chiếu/setup được duyệt. Web-first assertions chờ kết quả, không click lại khi chờ. Acceptance đầu không automatic retry; reproduction là attempt mới immutable. Fail→pass vẫn giữ fail/flaky.

Bẫy HW03 phải đối chiếu checklist gốc:
- GUI-048: context sạch mỗi page, click đúng một lần. GUI-026: 0/-1/1.5/rỗng/abc riêng; raw input → blur → events/validity → cơ chế từ chối thật. Im lặng/DOM invalid không là proof; root fail không suy validation pass. GUI-027 cần trạng thái lỗi thật; GUI-023/025/049 độc lập không bị blanket block.
- GUI-031: click/Enter/Space ở context tương đương riêng; cả hai không hoạt động không là pass keyboard.
- GUI-045: match method/origin/path/query; giữ iPhone, MacBook hoàn tất, thả iPhone, đợi cả hai, kiểm UI cuối. Timeline/timeout/cleanup rõ; throttle/sleep không chứng minh ordering; không sửa response để đạt.
- GUI-044: bỏ block và recovery cùng lượt; context mới không chứng minh recovery.
- GUI-050: xác nhận Home action tiếp nhận state, SPA giữ state sang Detail; không chèn storage/reload/mở Cart. Toast không thay badge. Home root không phụ thuộc Detail root.
- GUI-001: tập ID và duplicate, không chỉ count. Alt không rỗng; object-fit không chứng minh crop/tỷ lệ đúng.

**Xong khi:** mỗi instance có observation thật hoặc blocker reference; không click thêm bỏ qua lỗi; cleanup route/network/zoom/context có log.

## 5. Lưu và đánh giá evidence

Mỗi ID/variant/page/platform/viewport/attempt có folder riêng hoặc mapping bijective từ native output. Thu ảnh cả pass/fail ở checkpoint có ý nghĩa: original PNG viewport thiết kế, full-page khi cần; không phóng viewport giấu lỗi. Log steps/console/network/errors/validation liên quan; attach reporter native, trace giữ fail đầu, video tùy capability. Server log dùng chung, correlate timestamp/request ID, không gán độc quyền cho test.

Giữ native status khác assessment và humanReview; runner passed khi thu ảnh không là GUI pass. Human/hybrid chờ reviewer thật, không tự ký. Network mặc định metadata lọc; không thu secrets/cookie/token/body nhạy cảm. Ảnh gốc tách annotation/redacted export; dùng danh tính submission đã xác nhận, không suy student email từ Git email. Không upload dữ liệu ngoài scope khi chưa được duyệt.

**Xong khi:** result có expected/actual/source/prerequisite/timestamps/environment/links/hash/review; blocked có nguyên nhân; fail gốc không ghi đè.

## 6. Verify, export và báo gaps

Kiểm JSON, unique instance keys, graph, path trong output root, file tồn tại/checksum, per-attempt mapping, số ID khác số instances/attempts, coverage mỗi lane và native/assessment/review. Export derivative sạch dữ liệu ngoài scope. Bug draft có actual/expected/repro/ảnh và phân loại R-bug/H-design; publication cần quyền riêng.

Đọc [adapter pilot v0.1](references/pilot-adapter.md) để biết commands/schema thực tế và giới hạn. Harness có `npm run unit`, `npm run pilot`, `npm run verify -- <run-directory>`; kiểm package.json trước gọi. Adapter chỉ hỗ trợ pilot cố định, không phải full contract v1 hay compiler chung. Full/reuse branches chưa có adapter tương ứng phải blocked/not-run, không lặng lẽ bỏ qua trường input hoặc đổi kết quả cho hợp schema.

Không tự commit. Nếu tương lai được phép, kiểm effective author và committer chính xác `tranquocvy <quocvy23072005@gmail.com>` rồi verify commit metadata; giữ tác giả bên thứ ba. Không stage/push/publish mặc định.

**Xong khi:** báo kiểm chứng thật đã chạy, artifacts/link, counts pass/fail/blocked/needs-review/not-applicable/not-run, gaps và quyền thiếu. Không gọi hoàn tất execution khi còn variants chưa chạy. Automated pilot không thay usability pilot hay 7 phiên người thật/consent.
