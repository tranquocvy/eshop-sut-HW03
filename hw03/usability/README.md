# Task 2 — Bộ chuẩn bị và plan web study online

**Cập nhật:** 09/11/2026. **Đã implement luồng rút gọn quay màn hình trên web, không mic/camera; đã kiểm tích hợp local: 54 tests; compact v0.4 10 nhóm, snapshot v0.3 9 nhóm và legacy 11 nhóm browser đạt; native picker trên máy participant chưa kiểm. Chưa có pilot được review/freeze hoặc bảy phiên chính hoàn tất.** Thiết kế D1-A / D2-A / K1 giữ nguyên; các tài liệu dưới đây là specification cho web, không bắt participant điền Markdown.

## Bắt đầu tại đây

0. **[Web đã implement và hướng dẫn chạy](../tools/usability-study/README.md)** — setup/build/start, lưu dữ liệu riêng và [kết quả kiểm](../tools/usability-study/VERIFICATION.md): kết quả từng lượt được ghi riêng, không thay bằng pilot/người thật.
1. **[ONLINE-STUDY-PLAN.md](ONLINE-STUDY-PLAN.md)** — plan chính của hướng online: participant/moderator, SUT nguyên UI, recorder screen-only và upload dự phòng, dữ liệu, W01–W07 và acceptance gates.
2. [Thiết kế đã chốt](EVALUATION-DESIGN.md) — profile, RQ, scenario và tiêu chí thành công.
3. [Protocol](PROTOCOL.md) — nội dung script/điều phối đưa vào web, preflight và cách giữ neutral.
4. [SUS/probes](INSTRUMENTS.md) — nội dung form và công thức; bản Việt cần review/pilot.
5. [Fields và biểu mẫu](TEMPLATES.md) — schema cho screening/consent/notes/raw responses/findings; dữ liệu thật chỉ lưu riêng.
6. [Pilot/freeze](PILOT.md) — checklist và nội dung màn hình review pilot.
7. [Analysis](ANALYSIS.md) — tiêu chí cho moderator dashboard/export và human review.

## Luồng mục tiêu

Link mời → screening → consent → kiểm record/call → scenario → SUT gốc ở tab riêng → báo kết quả → SUS → probes → gửi video → receipt.

Mọi form điền trên portal; luồng mới có năm nhóm bước, nút quay màn hình trong web, xem lại/tải dự phòng rồi gửi. Không xin mic/camera hoặc thu tên/liên hệ participant trên web. Moderator có UI riêng cho notes, pilot/freeze, evidence review, analysis và report export. Không xây cuộc gọi trong portal. Moderation/think-aloud vẫn qua cuộc gọi live; web tự phục vụ không thay phiên moderated.

Một link khởi đầu không đồng nghĩa cùng một origin: SUT có lỗi cố ý nên tách origin với study/consent; moderator local-only. Không sửa UI SUT, không chèn hướng dẫn/analytics hoặc sửa bug. External transport adapter đã kiểm local với source/DB giữ nguyên và parity Home/search/detail/reload/back; đã thử hai Quick Tunnels với HTTP 200 và UI render từ host; đó không phải chứng minh full flow trên máy participant. Các tunnel thử đã dừng, không tự mở lại.

## Thứ tự làm

| Gói | Kết quả mong đợi | Hiện trạng |
|---|---|---|
| W01 | SUT thật giữ source UI nguyên, API remote hoạt động và isolation đúng | Đã implement và kiểm local; giới hạn remote xem dưới |
| W02 | Các bước participant và lưu/khôi phục form trên web | Đã implement và kiểm local; giới hạn remote xem dưới |
| W03 | Moderator, video upload/import, scoring và export | Đã implement và kiểm local; giới hạn remote xem dưới |
| W04 | QA local, bảo mật và kiểm HTTPS từ máy ngoài mạng | Local build/API/browser/report đạt; HTTPS từ máy ngoài host chưa kiểm |
| W05 | Pilot đủ điều kiện, sửa/freeze | Chưa có pilot đạt gate review/freeze |
| W06 | Bảy phiên moderated riêng biệt | Chưa tuyển/chưa chạy |
| W07 | Analysis, bug/Issues và report/evidence Task 2 | Chưa có dữ liệu |

Xem checklist đầy đủ trong plan chính. W01 đã chứng minh runtime local, chưa đóng gate delivery remote; W05–W07 vẫn cần nghiên cứu người thật.

## Các quyết định giữ nguyên và giới hạn

- Profile A: người trưởng thành đọc tiếng Việt, có trải nghiệm tìm/xem sản phẩm online 12 tháng gần đây, ngoài lớp HW03; ưu tiên non-IT/non-tester.
- Scenario A: tìm điện thoại tối đa 30 triệu, xem chi tiết rồi chọn có căn cứ (K1); không ép Search/xem hai sản phẩm hoặc thêm giỏ.
- SUS làm thang làm việc, probes đủ clarity/recovery/speed/trust. Nguồn [MeasuringU](https://measuringu.com/sus/); bản Việt chưa thẩm định tâm trắc, cần student review/pilot.
- Đã kiểm source và DB read-only ở lượt chuẩn bị trước; iPhone/Samsung là ứng viên theo DB, **chưa xác minh UI remote mới**. Startup gốc có DROP/seed, không chạy vào DB gốc.
- Video receipt/upload không phải verified; nút “xong” không tự chứng minh K1 hoặc một phiên hợp lệ.
- Chưa có bộ bảy phiên chính và report/PDF kết quả được xác minh; không suy dữ liệu thử nội bộ thành mẫu chính hoặc pilot đạt rubric.

## Quyền riêng tư và Git

Repo public chỉ chứa code/tài liệu/mẫu không dữ liệu và bản evidence đã khử định danh được phép. Study DB, identity/contact mapping, consent, video và credentials nằm ngoài Git và webroot. Bảng tên/liên hệ đã che và recordings nộp riêng cho giảng viên/TA, không tự đăng public hoặc gửi AI.

Giữ raw → derived → findings có provenance. Pilot và dữ liệu test kỹ thuật không nằm trong bảy phiên chính. Từng phiên có bản session record riêng để commit sau review khi được phép; không tự stage/commit/push. Git log text và ZIP toàn bài ở bước cuối.

**Code ở hw03/tools/usability-study/. Không thay source SUT. Web đã có không đồng nghĩa Task 2 hoàn tất.**
