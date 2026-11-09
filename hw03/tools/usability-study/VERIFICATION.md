# Kiểm chứng web Task 2 — 09/11/2026

**Kết luận:** ứng dụng local đã build và kiểm thử kỹ thuật. Chưa xác nhận đầy đủ study flow/native recorder qua HTTPS từ máy ngoài host; chưa chứng nhận pilot đủ điều kiện hoặc bảy phiên chính. Trang question-preview chỉ kiểm câu hỏi, không thay gate nghiên cứu người thật. Không gọi đây là Task 2 đã hoàn tất.

## Luồng compact-screen-v1 và recorder không âm thanh

- Build production đạt; **50/50 node:test** đạt (28 server, 12 recorder, 3 compact mapping/domain, 3 environment, 2 UI contract, 2 runtime).
- **9 nhóm compact browser checks đạt**: xác nhận ngắn/không PII, hủy quyền và thử lại, MediaRecorder thật với canvas synthetic, playback silent/download, resize không unmount, failed withdrawal giữ file, autosave khi đang gửi, khóa final submit, upload retry/receipt, refusal/withdrawal và isolation. Các mục được gộp theo chín dòng PASS trong evidence, không gọi mỗi assertion là một participant.
- Legacy browser **11 nhóm checks đạt**, giữ tương thích snapshot/consent cũ. Không sửa dữ liệu pilot thật hoặc coi lượt đã dừng là pilot mới hoàn tất.
- Compact report render/print: **10 headings, 11 tables**, không overflow print width, PDF **91.375 bytes**. Không kiểm thủ công mọi trang.
- Fingerprint **62 source/DB SUT không đổi**. Không install, sửa ACL, commit/push hoặc mở lại tunnel.

Evidence ngoài Git:

- Compact mới nhất (9 nhóm): HW03/_working/eshop-sut-HW03/online-study/compact-e2e-1794216812917/verification.json; screenshots và screen-recording.webm chỉ là fixtures kỹ thuật.
- Report/PDF synthetic: HW03/_working/eshop-sut-HW03/online-study/compact-e2e-1794216570259/report-render-verification.json.
- CLI start–stop–start sau sửa compact: HW03/_working/eshop-sut-HW03/online-study/restart-smoke-6O1d4Z/verification.json, cả hai lượt 200/200/200.
- Legacy: HW03/_working/eshop-sut-HW03/online-study/e2e-1794216344329/verification.json.

Screen recorder chỉ gọi getDisplayMedia với video=true/audio=false, không gọi mic/camera. Test inject canvas thay display stream nhưng dùng **MediaRecorder/File/playback/upload thật trong Chromium**; số lần gọi getUserMedia là 0, tracks đã dừng, video phát lại không có audio track. **Native picker/quyền thực tế trên máy participant và HTTPS off-host của luồng mới vẫn chưa được kiểm.** Không dùng synthetic permissions làm human acceptance.

Clip chưa gửi chỉ nằm trong bộ nhớ tab; beforeunload cảnh báo không chống được crash/reload. Recorder cap tối đa 128 MiB (hoặc quota nhỏ hơn của study); file chạm cap/lỗi là partial, chỉ tải cứu dữ liệu, không gửi như bản hoàn chỉnh. Preview dùng blob: được CSP cho phép riêng trong media-src. Label/input gắn id rõ để không đổi accessible name theo nội dung textarea.

Compact server từ chối track audio/metadata mơ hồ qua cả upload participant và moderator import trước finalize; staging bị xóa khi từ chối. Reader bounded WebM TrackType/CodecID, MP4 handler và skip payload: **không phải codec/bitstream validation, chứng minh nội dung là màn hình, hay malware sandbox**. Legacy upload behavior không bị sửa theo consent mới. Các container ngoài subset hỗ trợ có thể phải quay lại bằng Chrome/Edge, không tự chuyển thành accepted.

Grouped eligibility lưu một eligible boolean thật; câu “Không đáp ứng tất cả” không bị biến thành năm câu trả lời âm tính riêng. Consent gộp chỉ mở participate/research/verification khi người tham gia chọn rõ; audio/publicEvidence luôn false theo policy. Danh sách xác minh 7 người thu/nộp riêng; export roster trống không thay danh sách thật.

Những lỗi được tái hiện/sửa: CSP chặn blob preview; textarea label thay đổi theo value; pending-save race/phase contamination; failed withdrawal xóa clip sớm. Browser regressions kiểm lại các đường này. Review độc lập xác nhận các lỗi chính đã giải quyết; còn phát hiện failed-draft retry loop đã sửa bằng gate theo edit version: lỗi không tự retry vô hạn, chỉnh sửa/manual save mới thử lại. Browser test 409 liên tục quan sát hơn hai chu kỳ autosave và xác nhận chỉ một attempt, sau đó manual retry lưu được đáp án giữ lại. Các lượt fail giữ lại ngoài repo, không ghi đè thành pass.

## Kiểm bổ sung — sửa startup EPERM trên Windows

Lỗi startup được ghi nhận tại unlink sut-runtime/frontend/src/App.css. Code cũ copy đè cùng artifact và fs.cp có thể unlink đích. Thuộc tính tệp trong môi trường agent là Archive, không ReadOnly; nguyên nhân quyền/lock cụ thể ở desktop user chưa xác lập. Không đổi ACL, nâng quyền hoặc xóa artifact để chữa lỗi.

- prepareSut nay tạo run-* độc lập mỗi lần, giữ nguyên artifact cũ và không đụng study DB/video.
- Build đạt; **32/32 tests** đạt, thêm regression kiểm hai preparation không ghi đè legacy App.css hoặc artifacts của lượt trước. Không tuyên bố đã tái tạo ACL/file-lock của user.
- CLI thật start–dừng–start hai lần cùng dataDir: portal/moderator/product API đều **200/200/200** ở cả hai lượt. Chỉ dừng process test sở hữu.
- Evidence: HW03/_working/eshop-sut-HW03/online-study/restart-smoke-w1EsDG/verification.json.
- Sau sửa, **11 nhóm browser E2E đạt**; 62 fingerprint SUT không đổi. Evidence mới: HW03/_working/eshop-sut-HW03/online-study/e2e-1794212779631/verification.json. Không chạy lại report/PDF vì không đổi renderer.
- Desktop user cần chạy lại npm start để xác nhận; writable workDir/dependency cache vẫn là điều kiện. Các run cũ giữ lại, không tự dọn/xóa dữ liệu.

## Lượt kiểm đầy đủ ban đầu

Từ hw03/tools/usability-study/:

    npm run build
    npm test
    npm run test:e2e
    npm run test:report
    npm run integrity

| Kiểm tra | Kết quả quan sát |
|---|---|
| Production build portal | Đạt, Vite 8.0.12, cached deps; output ngoài repo |
| node:test | **31 passed / 0 failed / 0 skipped**: service 25, runtime 1, environment 3, UI/instrument contract 2 |
| Playwright flow tích hợp | **11 nhóm kiểm đạt**, synthetic-only; không có browser page errors |
| Report render/print | **10 sections, 14 tables**, không overflow ở print width; PDF kỹ thuật 107.909 bytes |
| Source/DB SUT | **62 file giữ nguyên fingerprint**; 34 frontend/backend files kiểm thêm trong runtime gate |
| Launcher smoke | health 200, products 200, admin bootstrap 200 ở cổng riêng, public admin API 404; chỉ tiến trình test được dừng |
| Git | HEAD vẫn 90a975f; index rỗng, không stage/commit/push |

## Browser flow thực sự đã kiểm

1. Moderator đăng nhập và study khởi tạo không có người tham gia tạo sẵn.
2. Synthetic pilot: screening/consent → chuẩn bị → release → SUT tab riêng → tự báo task → SUS/probes → upload WebM kỹ thuật → receipt/reload → moderator phát video và review.
3. Synthetic main cùng luồng; mười câu SUS ban đầu không chọn sẵn, vector kỹ thuật toàn 3 được chấm 50 sau nộp.
4. Pilot không vào main summary; known identity không có trong export khử định danh; public listener từ chối admin API.
5. Moderator tạo và sửa finding bằng chọn phiên/video, không phải nhập ID kỹ thuật.
6. Reload moderator không yêu cầu nhập lại mật khẩu khi session còn hiệu lực.
7. Ineligible participant vẫn có đường rút dữ liệu dùng được.
8. Declined participant rút dữ liệu được mà không đổi lựa chọn từ chối.
9. Hướng dẫn màn hình nhỏ không redeem invitation trước khi mở được giao diện desktop.
10. Video private playback/range có auth; không có lỗi JS page; checks overflow ở sample desktop và màn hình nhỏ đạt.
11. Sau chạy, fingerprint source/DB SUT không đổi.

Cửa sổ EShop không có opener và không nhận cookies nghiên cứu theo hostname; không có browser request về localhost:3000. Test quay video bằng Playwright chỉ để tạo tệp kỹ thuật phát được, **không phải video người tham gia hoặc pilot**.

## Runtime source parity và giới hạn

- Source UI được copy byte-identical và không sửa. External Axios adapter chỉ chuyển prefix URL API; backend handlers gốc chạy qua no-init loader với DB snapshot read-only. Không import database.js initializer DROP/seed.
- Baseline và adapted runtime được so DOM/API tại Home/search/detail/reload/back. Trong lượt kiểm cuối được lưu, cả năm cặp screenshot có DOM trùng và differentPixels = 0, maxChannelDelta = 0. Đây là parity của các view/điều kiện kiểm, không chứng minh mọi trạng thái hoặc ảnh ngoài mạng.
- Source bundle không được gọi là byte-identical vì có adapter. Lỗi sản phẩm chủ ý vẫn giữ nguyên; gateway từ chối route ngoài flow là giới hạn triển khai, không phải bug SUT.
- Placeholder images bị abort đồng đều để ổn định so ảnh; đây không phải bằng chứng tải được mọi tài nguyên bên ngoài hoặc mạng người tham gia.
- VM dependency loader không phải OS sandbox. Chỉ dùng demo DB và môi trường riêng; không mở trực tiếp toàn bộ backend ra internet.

## Các vấn đề review đã sửa và kiểm lại

- Participant credential có expiry phía server 24h, kể cả restart; revoke/reissue vô hiệu credential cũ.
- Drafts tách khỏi submitted answers; SUS draft không được chấm điểm/export như câu đã nộp, refresh/restart phục hồi draft.
- Declined/ineligible vẫn có UI withdrawal; identity không lưu khi chưa có required consent hoặc khi từ chối.
- Refresh lời mời bắt đầu giữ checkbox/câu trả lời đang nhập; late draft không rollback state. Draft/final retry tách riêng.
- Findings payload whitelist và default fields; chọn evidence đúng phiên, không gửi updatedAt từ client.
- Missing video cần lý do rõ dù lựa chọn videoLater thế nào; received khác verified.
- Policy dates phải là ngày thật/chưa hết hạn; provenance source/commit/adapter immutable theo snapshot và startup từ chối trộn build.
- Admin exact Host/Origin/CSRF, separate listener, quota/MIME/magic/stream cleanup, private storage/playback, withdrawal cleanup và HTML/CSV escaping có negative tests.

Review độc lập đọc lại ba lỗi P2 trước đó và report escaping: **6/6 targeted regression checks đạt**, không còn finding blocking được xác lập. Review này không tự thay browser/PDF checks ở trên. Link đích file, cấu trúc bảng và UTF-8 của 14 Markdown files cũng đã kiểm, không phát hiện lỗi.

## Evidence local

Evidence kỹ thuật nằm ngoài repository, không tự đưa vào Git hoặc gói nộp người thật:

- Runtime: HW03/_working/eshop-sut-HW03/online-study-runtime/verification/verification.json và paired screenshots.
- Browser cuối: HW03/_working/eshop-sut-HW03/online-study/e2e-1794193845008/verification.json.
- Cùng lượt browser: participant-screening.png, P01-receipt.png, moderator-summary.png, small-screen-guide.png, original SUT screenshots, technical videos riêng.
- Report: report-render-verification.json, report-synthetic.md/.html/.pdf và report-print-first.png trong cùng thư mục.

Đã nhìn mẫu screenshot screening, receipt, summary và print-first; không tuyên bố đã nhìn mọi ảnh/mọi trang PDF. Các lần fail trước khi sửa giữ lại, không đổi thành pass. Current pass không suy thành human acceptance.

## Chưa kiểm / còn cần trước pilot thật

- Máy người tổ chức và máy participant bên ngoài; hai hostname HTTPS/tunnel thực tế, mạng và upload dung lượng thật. Không có tunnel nào được mở trong lượt triển khai.
- Recorder/mic thực tế của participant, live call/screen share, consent/retention contact thông tin thật, eligibility và TA verification.
- Bản dịch Việt SUS vẫn là bản làm việc cần student/pilot review, chưa thẩm định tâm trắc.
- Physical disk erasure, Windows ACLs/encryption, backup và các bản đã export là trách nhiệm người tổ chức; app không thay quyền hệ thống. Magic/hash không chứng minh video đúng người hoặc đầy đủ codec.
- Text tự do có thể còn thông tin nhận diện: phải human privacy review trước chia sẻ. Không tự công bố reports/videos hoặc đăng Issues.
- Bảy phiên thật, findings/analysis và báo cáo học phần cuối vẫn chưa có. Những số trên là kết quả kiểm công cụ, không phải kết quả usability EShop.

## Probes v0.4 — kiểm sau đổi câu hỏi

- Giữ nguyên 10 SUS và score; UI contract đối chiếu nguyên văn với INSTRUMENTS.md đạt. Không triển khai UEQ-S.
- Build đạt; full node:test **54/54 PASS**. Bao gồm probe choices/optional followups/hidden payload, legacy validation, invitation snapshot qua config update/restart, internal pilot và recorder/media hiện có.
- Compact v0.4 **10 nhóm browser checks PASS**, evidence ngoài Git: HW03/_working/eshop-sut-HW03/online-study/compact-e2e-1794236257548/verification.json. Kiểm Có→Không ẩn text, Không chắc/skip, giải thích trống không bị bắt lý do, phục hồi draft qua tab mới, instrument provenance v0.4, upload/receipt. Screenshot probes-v04.png đã xem bố cục. Giữ tab quay gốc vì File nằm trong RAM, không giả reload bảo toàn File.
- Compact snapshot v0.3 **9 nhóm browser checks PASS**: compact-e2e-1794236316214/verification.json. Config thiếu probeVersion vẫn v0.3; study CLI mới chọn v0.4 và private-compact-v04 riêng. Không truy cập/sửa DB, đáp án hoặc video pilot thật trong đợt đổi probes này.
- Report v0.4: 10 headings, 12 tables, không print-width overflow; PDF synthetic 92.164 bytes, không tuyên bố đã đọc từng trang. 62 source/DB SUT không đổi. 15 Markdown files kiểm local links không lỗi; git diff --check đạt, index trống.
- Lượt kiểm đầu thất bại do test dùng snapshot ở admin session thay vì export contract; đã sửa assertion theo export và chạy lại full suite đạt. Failed evidence compact-e2e-1794236178039 giữ nguyên ngoài repo, không chuyển kết quả cũ thành pass.
- Chưa mở public registration/tunnel, chưa bỏ moderator gating, chưa thu contact trong compact; các thay đổi đó không thuộc revision probes này. Không stage/commit/push. Phần đổi probes cần pilot/review trước freeze.


## Kiểm lại bộ hiện hành — 09/11/2026

- Production build và **54/54 node:test PASS**, bao gồm runtime parity và repeated preparation; **62 fingerprint SUT không đổi**.
- Compact v0.4 **10 nhóm PASS**: compact-e2e-1794241007175/verification.json. Snapshot v0.3 **9 nhóm PASS**: compact-e2e-1794241029119/verification.json.
- Legacy **11 nhóm browser PASS**: e2e-1794241048865/verification.json. Các run đều synthetic-only, nằm dưới HW03/_working/eshop-sut-HW03/online-study/ ngoài repository.
- Report từ run v0.4: **10 headings, 12 tables**, không print-width overflow; PDF synthetic **92,411 bytes** sau sửa nhãn nguồn report, allPagesManuallyInspected=false. Bytes PDF thay đổi theo timestamp/data metadata, không phải thay đổi kết quả nghiên cứu.
- Validator **15 Markdown files**, local links/tables/UTF-8 không lỗi; git diff --check đạt. Scan danh sách code/tài liệu không phát hiện private key, token provider/GitHub hoặc hostname tunnel đang dùng; scan pattern không thay human privacy review.
- Native display picker và full study flow từ máy participant ngoài host vẫn chưa được chứng nhận bởi các kiểm này. Không dùng test synthetic để tuyên bố pilot/freeze hoặc bảy phiên chính đã hoàn tất.
