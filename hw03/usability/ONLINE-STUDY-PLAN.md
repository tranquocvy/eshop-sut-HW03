# Task 2 — Plan web study end-to-end (v0.1)

**Ngày:** 09/11/2026. **Trạng thái:** đã implement và kiểm kỹ thuật local; chưa mở tunnel hoặc kiểm từ máy ngoài host, chưa pilot/phiên chính thật. Xem [hướng dẫn chạy](../tools/usability-study/README.md) và [verification](../tools/usability-study/VERIFICATION.md). Thiết kế D1-A / D2-A / K1 và RQ1–RQ3 giữ nguyên theo [thiết kế nghiên cứu](EVALUATION-DESIGN.md).

## Điều chỉnh triển khai hiện hành — compact-screen-v1

Luồng mới rút thành năm nhóm bước và có nút quay màn hình ngay trên web, không mic/camera/audio. Tên/liên hệ người tổ chức không hiển thị cho participant; danh tính participant xác minh riêng ngoài portal. Recorder dùng API chuẩn trình duyệt, không sửa/chèn mã vào SUT, có file dự phòng và upload rõ ràng. Không xây cuộc gọi; moderated/think-aloud và notes vẫn do người tổ chức thực hiện trực tiếp.

Các mục nói “không xây browser recorder” hoặc “chỉ quay thủ công” bên dưới là ranh giới của baseline v0.1, đã được thay bằng điều chỉnh này; manual upload giữ làm fallback. Gate pilot/freeze/bảy người và privacy vẫn giữ. Không chuyển raw consent của phiên cũ thành consent mới; startup dùng dataDir riêng cho compact. Xem [hướng dẫn hiện hành](../tools/usability-study/README.md) và [protocol v0.3](PROTOCOL.md).

## 1. Mục tiêu và ranh giới

Xây một web tổ chức nghiên cứu: participant vào một link khởi đầu, điền mọi biểu mẫu trên web, mở EShop từ source gốc để thực hiện task, trở lại khảo sát và gửi video. Sinh viên dùng màn hình quản lý riêng để điều phối, ghi notes, kiểm evidence, phân tích và xuất bộ báo cáo.

**Web giúp thực hiện trọn quy trình, không thay thế nghiên cứu người thật.** Theo HW03 §6 Task 2, vẫn cần một pilot rồi bảy phiên moderated với người thật ngoài lớp, think-aloud, quan sát và analysis. Điền hết form không chứng minh đã hoàn thành task hoặc phiên hợp lệ.

### Bắt buộc giữ

- UI EShop dùng source gốc: không sửa JSX/CSS/labels/layout/navigation/business logic, không sửa bug hoặc tạo UI giả tương tự. Không chèn nút hướng dẫn, survey, timer, analytics script hoặc đáp án vào UI SUT.
- Quay màn hình bằng công cụ trên máy participant, có audio khi đồng ý; web không tự ghi màn hình ở bản đầu. Participant upload video qua web; có đường nhận riêng rồi moderator import nếu upload lỗi.
- Mọi form: screening, consent, trả lời task, SUS và probes nằm trên portal. Notes, pilot review, findings và export nằm trên giao diện moderator.
- Một link mời là cửa vào; **không bắt buộc mọi thứ cùng một tab hoặc origin**. SUT mở tab riêng để bảo toàn UI và cô lập dữ liệu.
- Không tự sinh participant/feedback/consent, outcome hoặc findings. Synthetic test chỉ dùng study kỹ thuật riêng, không lẫn dataset thật.

### Không làm ở bản đầu

Không xây recorder/streaming/WebRTC/call trong web, không rrweb/heatmap/click tracking, không public dashboards hoặc tự động đăng Issues, không mở rộng checkout/login/cart. Không upload dữ liệu cá nhân lên AI. Không deploy hoặc tunnel ở lượt triển khai local này.

## 2. Cơ sở lựa chọn

- HW03 §5/6/11/12/14/15 và slide S13 đã review; Task 2 = 40 điểm (scenario + 7 sessions + analysis), không có rubric con do đề công bố.
- [Protocol](PROTOCOL.md), [SUS/probes](INSTRUMENTS.md), [mẫu dữ liệu](TEMPLATES.md), [pilot](PILOT.md), [analysis](ANALYSIS.md) là nội dung nguồn cho ứng dụng, không phải biểu mẫu bắt participant sửa Markdown.
- Đã kiểm source: Home/Detail gọi cứng http://localhost:3000; Vite config gốc chưa có proxy. Chỉ tunnel frontend sẽ khiến API trỏ về máy participant.
- backend/database.js gọi initDatabase() có DROP/seed; không khởi động module đó với DB gốc.
- Existing-option preflight: [Formbricks](https://github.com/formbricks/formbricks) có survey/link và self-host, nhưng chưa được thử tích hợp study này; không mặc định có đủ moderator/evidence/state machine. Không chọn thêm full survey platform ở bản đầu vì đã yêu cầu web custom liên kết SUT, session và video. Tái dùng thư viện form/server/DB được duy trì thay vì tự viết framework. Không cài dịch vụ, plugin hoặc dùng gói trả phí ở giai đoạn plan.

## 3. Luồng participant trên web

| Bước | Màn hình / hành động | Dữ liệu và điều kiện chuyển |
|---|---|---|
| P1 | Mở link mời riêng | Token được đổi thành session; không hiện người khác, không coi có link là đã xác minh danh tính |
| P2 | Kiểm điều kiện tham gia | Tuổi từ 18, tiếng Việt, trải nghiệm online 12 tháng, ngoài lớp HW03, mức quen SUT; non-IT ưu tiên không bắt buộc |
| P3 | Thông tin nghiên cứu và consent | Mục đích, quyền dừng/rút, recording/audio, phạm vi chia sẻ, TA có thể gọi; tên/liên hệ cần thiết lưu riêng |
| P4 | Hướng dẫn chuẩn bị ghi hình và kết nối moderator | Chọn công cụ record sẵn có trên máy, thử quay/phát lại với mic nếu đồng ý; không quay form liên hệ/consent |
| P5 | Đọc scenario và đợi moderator cho bắt đầu | Một task chọn điện thoại ≤30 triệu; không gợi ý đáp án/từ khóa/cách bấm; lưu version |
| P6 | Bấm mở EShop tab riêng, làm task và think-aloud | UI nguyên gốc; thời điểm mở chỉ là portal marker, không tự nhận là thời điểm thao tác task đầu tiên |
| P7 | Quay về portal, báo đã xong hoặc không tiếp tục được | Tên/giá/căn cứ tự báo cáo, hoặc lý do dừng; không ép phải chọn được mới sang khảo sát |
| P8 | Điền SUS 10 câu trên web | Radio 1–5 không preselect, không cho participant xem score; missing giữ đúng thực tế |
| P9 | Trả lời probes trên web và trao đổi với moderator | Clarity/recovery/speed/trust; có lựa chọn không gặp tình huống, từ chối trả lời; lưu follow-up riêng |
| P10 | Dừng record và upload video | Lời nhắc dừng trước khi nhập thông tin cá nhân khác; không mất survey nếu upload fail; receipt khi server xác nhận đã lưu |
| P11 | Trang kết thúc | Phân biệt “đã nhận khảo sát”, “video chờ nộp/kiểm” và “phiên đã review”; hướng dẫn quay lại upload/nhờ moderator import |

Sau P7 hiển thị nhắc dừng quay nếu không có consent quay phần survey; participant được chọn dừng quay ngay sau task rồi làm P8/P9. Việc upload P10 không yêu cầu phải quay cả questionnaire. Kết thúc session không yêu cầu nộp dữ liệu đã từ chối consent.

**Moderation vẫn live:** dùng cuộc gọi sẵn có, share màn hình khi được phép để quan sát; không cần xây call trong portal. Nếu chỉ ghi video rồi tự làm không có moderator thì là unmoderated, không đánh dấu đáp ứng HW03. Ghi notes theo quan sát live và đối chiếu video sau; khi không có live screen view phải ghi giới hạn, không dựng quan sát.

## 4. Giao diện moderator (local-only)

- Cấu hình study: scenario, SUS/probes versions, pilot/main, người phụ trách/liên hệ, consent/retention; không cho phát link tuyển thật khi thiếu mục bắt buộc.
- Tạo/revoke link riêng, gán slot PILOT-01 hoặc P01–P07; hiển thị tiến độ form, eligibility và trạng thái evidence, không tự tạo người thật.
- Mở phiên điều phối: script, timestamp notes, lời nhắc, trợ giúp, pause/technical issue và task outcome K1 từng tiêu chí.
- Portal events và lời participant là dữ liệu thô; moderator xác minh independent/assisted/unfinished, không auto-pass theo nút “xong”.
- Nhận/kiểm video: play, thời lượng, có task/mic theo consent, đúng mã phiên; link timestamp và import file nhận riêng nếu cần. Tách uploaded khỏi verified.
- Pilot review: ghi vấn đề, chỉnh sửa, lý do; freeze cấu hình version trước main. Không chỉnh raw responses theo nhận xét pilot.
- Phân tích: raw SUS → contributions/score; summary 7 người, notes → findings/severity/recommendations; ghi Issue URL và ảnh bug sau review.
- Xuất riêng: dataset/report đã khử định danh; danh sách có tên/liên hệ đã che cho giảng viên/TA; evidence manifest + video riêng. Không có download public hoặc nút publish GitHub tự động.

## 5. Kiến trúc — đã triển khai local, HTTPS remote chưa kiểm

### 5.1. Ba miền tin cậy

1. **Study origin HTTPS:** participant portal và study API; token mỗi phiên, response chỉ thuộc phiên đó.
2. **SUT origin HTTPS riêng:** source UI gốc, SUT gateway và backend chỉ nội bộ. Không dùng chung cookies/session với portal.
3. **Moderator local-only:** bind loopback, xác thực riêng; không đưa vào tunnel, không chỉ dựa vào việc giấu URL.

Một invitation bắt đầu ở study origin rồi mở SUT origin. Tách origin vì SUT có lỗi XSS cố ý; cùng-origin với consent/answers sẽ tăng nguy cơ đọc dữ liệu study. CORS không phải authentication: các API vẫn phải xác thực, chống CSRF khi dùng cookie và kiểm ownership phía server. Không CORS wildcard có credentials, không cookies Domain dùng chung, không tin postMessage/opener. Mở SUT bằng noopener và không gửi token study trong SUT URL/referrer. Study exchange token rồi bỏ bearer khỏi URL, dùng Referrer-Policy phù hợp và redact token/contact khỏi logs. Nếu gateway SUT cần invitation, dùng grant riêng ngắn hạn chỉ có quyền truy cập SUT, không tái dùng credential study/admin; kiểm negative cases ở W04.

### 5.2. Giữ nguyên UI và vấn đề localhost — gate kỹ thuật đầu tiên

- Hash source frontend gốc trước/sau; đọc/build qua config bên ngoài, output ở working directory, không chạy install/build ghi vào cây SUT gốc.
- Đề xuất một **transport adapter bên ngoài UI**, gắn qua cấu hình build (ví dụ alias lớp Axios): chỉ đổi đích API localhost:3000 thành gateway của SUT origin, giữ nguyên method/path/query/body/status/response; không thay business logic, DOM hoặc error feedback.
- Đây là runtime transport khác cấu hình gốc; **không được gọi bundle là byte-identical**. Ghi rõ adapter/config và provenance trong report. Source UI có thể byte-identical, bundle không nhất thiết.
- Reverse proxy đơn thuần không bắt được request hardcoded localhost từ browser; không giả vờ chỉ thêm proxy là xong.
- Nếu không chứng minh adapter chỉ tác động transport, hoặc ranh giới “không sửa UI” được hiểu là cả bundle/request routing phải nguyên trạng: dừng gate, trình giới hạn trước khi chọn cách khác. Không lén rewrite source hoặc thay UI.
- Backend chạy trên bản sao riêng; no-init loader/read-only DB adapter chỉ ở runtime ngoài repo source gốc. Hash server source, DB copy/gốc và kiểm route listing/detail giữ hành vi. Không fake API hoặc sửa bug để đạt K1.
- Bản build static của SUT không expose Vite dev server/source tree. Gateway chỉ cho GET products và product detail cần thiết, chặn admin/login/write routes từ internet. Chặn route ngoài flow ở biên triển khai, không xóa nút/link gốc; nếu participant đi ra ngoài scope, ghi boundary/deviation, không tính đó là bug sản phẩm.
- DB demo không chứa dữ liệu participant; không seed/reset DB gốc. Read-only không có nghĩa mọi lỗi API đều an toàn: vẫn cần access/rate/resource limits và cô lập tiến trình/file access.

### 5.3. Stack và layout dự kiến

Portal React + Vite; study service dùng Node.js 24.22+ với HTTP/SQLite/crypto/streams có sẵn, file storage riêng cho video. Runtime SUT vẫn dùng backend Express gốc qua read-only adapter. Tái dùng dependency cache hiện có, không cài thêm. Chưa cần survey engine, cloud storage hoặc microservices.

Code đã có dưới hw03/tools/usability-study/ (portal, server, runtime, scripts và tests). Cấu hình runtime/secrets, study.sqlite, contact mapping, consent và video nằm **ngoài Git và ngoài webroot**. Admin/report output chỉ truy cập có quyền.

SUT source gốc frontend-web/ và backend/ chỉ đọc, không sửa. Artifact build/runtime tách riêng. Không phát token thật trong ví dụ, screenshots hoặc logs.

## 6. Dữ liệu và state machine

### Entities tối thiểu

- study_version: scenario/instrument/protocol/consent versions, cấu hình freeze, nguồn SUT/adapter fingerprints.
- invitation và session: pilot/main, participant pseudonym, token hash/expiry/revoked, phase, progress revision, attempt history.
- private_identity và consent_record: tên/liên hệ cần thiết, consent theo từng phạm vi, version/time; tách khỏi analyst dataset. Mặc định thu liên hệ đã che nếu đủ yêu cầu; liên hệ đầy đủ chỉ khi có mục đích/đồng ý, lưu riêng.
- task_report và moderator_observation: self-report tách verified K1/outcome, assistance, events, video offsets, thời gian và provenance.
- responses: raw SUS/probes với instrument version; missing reason; derived scores không đè raw.
- evidence: upload/import status, server filename, size/hash, attempt/session association, review status và notes.
- finding: evidence links, x/exposed n, severity/reason, recommendation, bug source/repro, Issue reference.

### Trạng thái tách biệt

Participant progress: invited → screened → consented → ready → task-active → task-ended → SUS → probes → submitted. Có nhánh ineligible, declined, withdrawn, technical-interruption; không buộc người thất bại task phải chọn sản phẩm để thoát.

Evidence status: missing → received → verified hoặc needs-replacement/waived-with-reason. Study review: pending → reviewed; outcome success là trường riêng. Không đồng nhất submitted/received/reviewed với completed-independent hoặc assignment complete.

- Server kiểm thứ tự/ownership/version, không chỉ disable nút ở frontend. Save/retry có idempotency và revision để không nhân đôi session khi double-click.
- Autosave có dấu “đang lưu/đã lưu/lỗi”; chỉ báo receipt sau ghi bền vững. Refresh/restart phục hồi bước đã lưu; không giấu mất dữ liệu.
- Cho lưu thiếu/từ chối trả lời với lý do; không ép chọn 3 hoặc tự bù dữ liệu. SUS incomplete không tính total.
- Raw đã submit chỉ sửa qua correction có lý do/provenance. Với withdrawal thực hiện quy tắc xóa/loại đã thỏa thuận, không giữ PII ngầm trong audit history.
- Không chèn tracking vào SUT: thời gian mở/quay lại portal là coarse marker, khác thời gian task thực. Moderator/video xác nhận first task action/end/pause; export chỉ rõ nguồn đo, không báo portal elapsed là task time chính xác.

## 7. Video thủ công — chọn cách đơn giản

Participant dùng công cụ record sẵn có của hệ điều hành hoặc công cụ quen dùng; không bắt cài phần mềm trả phí. Portal có checklist chọn cửa sổ đúng, tắt thông báo, thử audio/phát lại, giữ file gốc tới khi moderator xác nhận nhận đủ. Kiểm khả năng trên từng máy ở technical check, không tuyên bố mọi công cụ đều thu mic.

Upload web sau task/surveys: session-bound, giới hạn dung lượng/quota cấu hình, streaming vào temp ngoài webroot, MIME/header kiểm tra, filename do server sinh, không execute/render HTML tải lên. Không mở public file path hoặc chấp nhận path tùy ý.

Bản đầu có whole-file retry; mất kết nối không mất survey và không tạo duplicate evidence. Upload chỉ chuyển received sau finalize/checksum; moderator play/review mới verified. Không hứa resume từng byte nếu chưa xây chunk protocol.

Fallback nhận riêng: participant giữ video và liên hệ moderator; moderator import qua UI local vào đúng session, lưu nguồn/thời điểm, không tự coi file chưa nhận là evidence đủ. Không buộc share-link cloud công khai hoặc cung cấp mật khẩu tài khoản.

## 8. Các gói thực hiện và acceptance gates

Các gói dưới đây là bước triển khai nội bộ của hướng online, không đổi mã T03–T05 trong PLAN và không phải task mới trong đề. **Hiện trạng:** W01 runtime local, W02 và W03 đã implement/kiểm kỹ thuật; W04 local QA đạt (31 tests và 11 nhóm browser checks synthetic), remote HTTPS chưa kiểm. W05–W07 chưa thực hiện với người thật. Checklist dưới đây giữ các gate chưa được chứng minh đầy đủ ở trạng thái mở; không suy local PASS thành remote/human PASS.

### W01 — Chứng minh runtime SUT nguyên UI và đi được từ xa

Phụ thuộc: không. Kết quả: một vertical slice portal stub mở SUT thật, API đọc qua gateway, source gốc không đổi.

- [ ] Hash source/DB; thử external transport/no-init runtime trên bản sao, ghi chính xác delta cấu hình.
- [ ] Kiểm Home, search, Detail, back; so ảnh/DOM, network method/query/status/body với baseline cùng viewport/data; không sửa bug đã biết.
- [ ] Không có request browser tới localhost:3000 từ máy client ngoài host; deep-link/reload hoạt động.
- [ ] Kiểm isolation origin, gateway deny ngoài flow; không expose source, admin, DB hoặc filesystem.
- [ ] Nếu fail, dừng và giải thích trước khi thay ranh giới UI.

### W02 — Luồng participant và persistence

Phụ thuộc: W01. Kết quả: P1–P11 dùng được, mọi form trên web; chưa cần dữ liệu thật.

- [ ] Screening/consent versioned, scenario, ready/start/end, task report, SUS/probes, evidence pending/receipt, withdraw path.
- [ ] Pilot/main tách dataset, token per-session, phase/ownership validation ở server; no-preselect, missing không impute.
- [ ] Refresh/back/double-click/timeout/restart không mất hoặc nhân bản dữ liệu; invalid/revoked token không đọc được phiên.
- [ ] Mobile chỉ trang hướng dẫn unsupported nếu chưa kiểm; không âm thầm đổi study desktop.

### W03 — Moderator, video và export

Phụ thuộc: W02. Kết quả: điều phối/notes/review, video upload/import, raw/derived export đầy đủ.

- [ ] Admin local-only có xác thực; ghi K1/outcome/assistance/timestamps, pilot changes/freeze, evidence verification.
- [ ] Upload hợp lệ/quá quota/sai file/mất mạng/retry/duplicate/path traversal; không lộ video của người khác; fallback import có provenance.
- [ ] SUS unit tests 0/50/100, missing/range; raw-to-derived trace; pilot không vào main summary, các mẫu số thực tế rõ ràng.
- [ ] Export JSON/CSV/Markdown và PDF preview/print-reviewed có thể dựng lại từ snapshot. Escape nội dung untrusted, phòng CSV formula injection, không tự đưa liên hệ/video vào bản public.
- [ ] Có report draft, participant table masked riêng, findings/severity/Issue refs và evidence manifest; không tự đăng Issues.

### W04 — QA kỹ thuật và bàn giao local/tunnel-ready

Phụ thuộc: W03. Kết quả: build/test/flow kỹ thuật đạt, chưa được gọi pilot.

- [ ] Unit/API/E2E với synthetic study riêng; ngăn skip consent, cross-session access, CSRF, token leakage; kiểm backup/restore và retention/withdrawal.
- [ ] Kiểm artifact/UI source hashes, header/token/cookie/referrer isolation, loopback admin không lọt tunnel.
- [ ] Test một máy ngoài mạng với HTTPS sau khi người tổ chức mở tunnel; xác minh hai origins và tải video thực tế trong giới hạn cấu hình. Local curl không chứng minh delivery từ bên ngoài.
- [ ] Hướng dẫn setup/start/stop/backup và thông số tunnel; không tự cấu hình hạ tầng bảo mật hay công khai workspace.
- [ ] Kết quả tunnel chỉ ghi PASS sau quan sát từ máy ngoài host. Không có remote test thì ghi unverified, không gửi lời mời phiên thật.

### W05 — Pilot người thật và freeze

Phụ thuộc: W04, thông tin consent điền đủ và một người phù hợp profile. Sinh viên là người điều phối và review nội dung; AI chỉ hỗ trợ kỹ thuật/phân tích được phép.

- [ ] Chạy đủ flow online, record thủ công/upload, notes, SUS và probes với PILOT-01.
- [ ] Review tính rõ của scenario và SUS Việt, khả năng record/audio, thời lượng, stop/assistance rules; sửa ứng dụng nếu lỗi tổ chức, không sửa UI SUT.
- [ ] Lưu pilot evidence và change record; freeze version trước main, thử lại phần thay đổi lớn.

### W06 — Bảy phiên moderated

Phụ thuộc: W05 và bảy người thật đủ điều kiện ngoài lớp; lên lịch tuần tự để moderator quan sát được.

- [ ] P01–P07: consent → task SUT → survey/probes → video → notes/review; giữ phiên/attempt riêng, không gộp pilot.
- [ ] Kiểm raw answers/evidence/identity verification private; missing hoặc technical failure giữ nguyên lý do, không thay điểm/phản hồi.
- [ ] Chuẩn bị một bản session record đã khử định danh cho mỗi commit riêng khi được phép; không đưa raw private data vào Git.

### W07 — Phân tích, bug và bộ bàn giao Task 2

Phụ thuộc: W06. Kết quả: nội dung Task 2 đủ yêu cầu, không chỉ có web chạy được.

- [ ] Kiểm bảy phiên thật và dataset, tính SUS/performance với nguồn đo/mẫu số đúng, gom pain points và severity có evidence.
- [ ] Review bug với SRS, đối chiếu Issues Task 1; Markdown + Issue có screenshot cho bug thật, không bịa bug để đủ số.
- [ ] Export report Markdown/PDF, notes/responses/findings/evidence index, participant table masked và video riêng; kiểm sample mở được và links đúng.
- [ ] Student review/AI audit theo thực tế, không tự ký hoặc dựng log; kết nối T07 cho hồ sơ toàn bài. Git log text và ZIP toàn bài ở cuối, không tự xuất trong bước plan/build.

## 9. Tiêu chí nghiệm thu tổng và trace yêu cầu

| Yêu cầu HW03 | Chỗ trên web / quy trình | Evidence kiểm chứng |
|---|---|---|
| Mục tiêu/scenario, profile, không trùng flow | Study version + screening + scenario | Thiết kế đã chốt, UI feasibility, version freeze |
| Pilot rồi refine | Moderator pilot review | PILOT-01 thật, notes/change record |
| 7 người ngoài lớp, contacts xác minh | Screening/consent/private identity | Eligibility và bảng nộp riêng, không chỉ lời khẳng định app |
| Moderated, think-aloud, quan sát/capture | Live call + notes + manual recording | Session/video timestamps, assistance record |
| Scale sau phiên + probes bốn nhóm | SUS/probes forms | Raw responses và follow-up thật |
| Score, pain points, severity, bug/design | Moderator analysis/findings/export | Raw-to-score, source/evidence/Issue ảnh |
| Report/evidence + commits từng bước/phiên | Export private/public-separated + Git sau review | Markdown/PDF, masked table, recordings, commit được phép |

Một web đầy đủ tính năng không tự được 40 điểm hoặc thay được bảy phiên thật. Đây là plan triển khai phục vụ Task 2, không yêu cầu của đề phải build một nền tảng nghiên cứu.

## 10. Quyết định và thông tin còn cần trước triển khai/thử thật

- Đã chốt hướng: mọi biểu mẫu điền trên web; UI SUT gốc; video record trên máy rồi gửi. D1-A / D2-A / K1 giữ nguyên.
- Khuyến nghị kiến trúc: một invitation, SUT tab/origin riêng; moderator local-only; video upload/import, không recorder trong web.
- W01 đã chứng minh source UI/DB giữ nguyên và transport adapter chạy local; DOM và năm cặp screenshot trùng trong điều kiện kiểm. Bundle có adapter, không gọi byte-identical. Remote delivery còn phải kiểm.
- Người tổ chức cần chọn cách thoại/share màn hình sẵn có, máy host và HTTPS tunnel cho hai origins; hạ tầng/tunnel chưa được mở.
- Trước tuyển thật: điền người phụ trách/liên hệ, nơi lưu/người xem, hạn xóa/rút dữ liệu và quota video theo dung lượng host. Không cần đưa contacts lên chat hoặc repo để lập plan.
- Nếu muốn đúng một origin hoặc không cho bất kỳ transport adapter nào, cần quyết định lại sau khi xem giới hạn W01; không giảm isolation hoặc sửa UI ngầm.

**Bước tiếp theo:** người tổ chức review web local → chuẩn bị hai hostname HTTPS và kiểm từ máy ngoài host → điền consent/retention và technical check → pilot thật, sửa/freeze → bảy phiên → analysis/report. Chưa stage/commit/push, mở tunnel hoặc thu dữ liệu người thật.
