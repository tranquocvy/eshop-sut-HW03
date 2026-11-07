# Source runner GUI pilot — Playwright Test

Source runner nằm tại `hw03/tools/gui-harness/`, không trong folder skill. [Skill điều phối](../../skills/gui-checklist-execution-evidence/SKILL.md) giữ quy trình/contract; runner giữ code thực thi và unit tests.

Dùng `node hw03/skills/gui-checklist-execution-evidence/scripts/materialize-harness.mjs <NEW_HARNESS_DIRECTORY>` từ repo root để tạo harness làm việc ngoài repo. Helper từ chối target có sẵn, không install/start. Cần giữ cả folder skill và tools trong cùng layout repository. Dependency/browser cache và run evidence nằm ngoài source runner; không cài dependency hoặc chạy pilot ngay trong source repo. Playwright Test pinned 1.65.0. Không sửa expected theo implementation hoặc sửa source SUT để pass. Không commit/push/publish mặc định.

## Setup có tự chạy không?

- Đọc/gọi skill không tự download hay chạy một installer. Materializer **chỉ copy source** sang harness làm việc mới.
- Khi task đã cho phép thực thi/setup: agent kiểm Node/npm, dependency và browser cache; chỉ cài phần thiếu bằng `npm ci` và Playwright Chromium CLI trong harness riêng. Nếu đã có bản phù hợp thì tái sử dụng, không tải mỗi lần.
- `npm run pilot` không tự cài dependency/browser. Dependency SUT và fixture READONLY cũng là prerequisite riêng; adapter hiện tại không bootstrap toàn bộ SUT từ máy trống.
- Output chỉ sinh khi thực thi pilot: mỗi run mới dưới `GUI_RUNS_ROOT`, từng instance có result/log/screenshot/trace/video khi thực sự mở browser. Dependency Blocked không tạo ảnh/action giả.
- `.gitignore` loại dependency, cache, native report/test output, run/log và env riêng nếu vô tình phát sinh trong source runner. Source, test cases, unit tests, lockfile và manifest vẫn cần giữ để tái tạo/kiểm chứng runner.

## Chạy

- npm run unit — tests dependency/privacy độc lập.
- node scripts/validate-skill.mjs — focused validator Node thay thế khi host không có Python; không gọi là đã chạy bundled quick_validate.py.
- npm run pilot — tạo run mới immutable, preflight, runtime no-seed, root rồi main stage; luôn cleanup process đã tạo và kiểm hash sau.
- npm run verify -- <run-directory> — verify evidence của run đã có; exit0 chỉ là evidence hợp lệ, không nghĩa mọi GUI test Pass.

Chạy các lệnh thực thi từ thư mục harness làm việc đã materialize. npm run preflight yêu cầu GUI_RUN_DIR được chỉ rõ để tránh overwrite. scripts/pilot.mjs cấu hình PLAYWRIGHT_BROWSERS_PATH vào .browsers; cài lại dependency chỉ khi được phép: npm ci, rồi node node_modules/playwright/cli.js install chromium với browser-path đó.

## Input và phạm vi thực tế

SUT_REPO, SUT_RUNTIME, SUT_DEPENDENCY_SOURCE, GUI_RUNS_ROOT là overrides; mặc định theo bố trí workspace hiện tại. SUT_DEPENDENCY_SOURCE trỏ runtime khảo sát có dependency sẵn; tạo junction node_modules từ runtime mới tới dependency này, không sửa package/source bên đó. Vite cache riêng từng run. Thiếu dependency/fixture hoặc port 3000/5173 đang có process thì dừng; không kill process lạ.

Runtime copy tracked backend/frontend-web và DB repo; source kiểm hash; adapter mở DB READONLY, chèn module cache thay database.js trước import server.js nên initializer không chạy. Không hỗ trợ nghiệp vụ ghi DB. UI network chỉ GET products/categories, không mở Cart/login/checkout. Đây là precondition phù hợp pilot đường đọc + React memory UI, không phải production-equivalent environment cho mọi nghiệp vụ.

Pilot gồm 7 ID, 13 instance: GUI-048 Detail first click (root); GUI-026 5 invalid variants phụ thuộc; GUI-025 1/2 độc lập; GUI-019 tìm full name; GUI-032 Home/Detail VD hybrid; GUI-040 empty; GUI-045 ordering. Không phải full checklist 50 ID/VM hoặc ≥3 platforms. GUI-026 không mở context/navigate/action nếu root fail. Native skipped được đánh giá blocked có rootEvidence, không N/A. GUI-032 native passed vẫn needs-review.

Mỗi ID/variant/platform/attempt có result, checksums, screenshots, logs; trace/video cho actionable instances, không bịa artifact cho blocked. Report native root/main riêng dưới report/. Root Fail không abort nhóm độc lập. Không automatic retry. Mỗi npm run pilot là run mới, giữ mọi run cũ.

## Gaps hiện tại

- Chỉ Windows/Chromium headless VD. Ảnh là web-content, không browser chrome/URL bar. Browser/device thật khác, zoom/IME, VM chưa chạy.
- Chưa có student-email overlay; ảnh chưa là submission evidence hoàn chỉnh.
- Full JSON contract của skill là target rộng hơn pilot v0.1; đọc [pilot adapter](../../skills/gui-checklist-execution-evidence/references/pilot-adapter.md) về mapping/các trường chưa được hỗ trợ. Không dùng pilot để tự nhận full-contract conformance.
- GUI validation nếu root gate được sửa và pass vẫn cần review cơ chế từ chối, không auto-pass chỉ từ validity.
- Full suite, reuse screen khác, Excel, bug Issues/video và usability người thật chưa nằm trong run này.

## Hardening pilot schema 0.2

Result bắt buộc schema/enums/actual/timestamps; oracleAssertions ghi source R/L/H. Chỉ ev.assert trong oracle phase mới có quyền ghi SUT fail; lỗi setup/capture/timeout là technical blocked, không nhận diện bằng message chứa expect. Dependency blocked có blockKind=dependency riêng, giữ root reference và không chạy UI; technical blocked có thể có browser evidence. Root chỉ giải phóng gate khi có success nhìn thấy, liên quan hành động hoặc badge quantity=1 mới; hidden/unrelated/busy-only không Pass. Badge parser không nhầm tiền tệ thành số lượng.

Verifier kiểm exact checksum inventory/path containment, regular/nonempty file và PNG/ZIP/WebM headers; đây là kiểm cấu trúc, không chứng nhận tính xác thực từ bytes đơn lẻ. Harness source fingerprint cũng được đối chiếu trước/sau run. Synthetic DOM/unit fixtures không là SUT execution evidence.

## Bố trí source và kiểm tra sau chỉnh sửa

- `cases/`: 7 file pilot GUI; `lib/`: dependency/oracle/evidence/verifier helpers.
- `scripts/`: launcher readonly, preflight, pilot, verifier và focused validator.
- `tests/unit/`: regression của chính harness, không phải kết quả GUI trên SUT.
- Sau khi đổi source, chạy `node scripts/refresh-source-manifest.mjs` ngay trong source runner để cập nhật `bundle-manifest.json`. Không dùng script bundle cũ của harness lịch sử để copy source về skill.
- Materializer chỉ copy các file có trong manifest và kiểm hash; không mang theo dependency/browser/log dù source có file ngoài inventory.
- Pilot được chấp nhận trước lần tách folder có ID `2026-11-07T04-14-40-565Z`. Lần tách source không tự thành execution GUI mới; giữ nguyên run/harness lịch sử để đối chiếu.
