# Task 1 — Kiểm tra báo cáo Markdown/PDF

## Yêu cầu đối chiếu

Đề HW03 §6 Task 1: “Report all discovered bugs both in the Markdown report and on your GitHub Issues page. Remember to attach bug screenshots to each GitHub issue.” §14 yêu cầu main report Markdown + PDF. Tham chiếu theo section; số trang đề chưa được xác minh từ bản trích xuất.

## Kết quả kiểm tra

- Báo cáo chính ghi trực tiếp 19 nhóm (12 R, 7 H), không chỉ liên kết tới danh mục. Có phân loại, severity assessment, điều kiện/cách tái hiện, Actual, Expected nguyên văn, căn cứ và screenshots. Recipes dựa saved evidence, không phải lượt chạy SUT mới.
- Đối chiếu `results.json` và `findings/mapping.json`: map duy nhất đủ 31 failed instances; không tạo bug từ Blocked/needs-review.
- 56 link/tài nguyên trong Markdown tồn tại. 32 lần nhúng ảnh dùng 20 PNG nguồn đã có; không tạo hoặc sửa ảnh evidence.
- Bản PDF cũ in raw Markdown. Bản thay thế dùng Marked (GFM) render Markdown trước khi xuất A4 bằng Chromium; không phải công cụ convert chuyên biệt hoặc exporter của skill. Không in raw Markdown.
- PDF mới: 36 page objects, 3 bảng, 19 detail headings; cả 32 image references tải thành công trước xuất, không overflow tại các bảng/blockquote/figure trong HTML render.
- PDF text extraction qua hai lượt đọc bao phủ trang 1–36: tiếng Việt đọc được, effective 75/31/15/1, đủ 19 phần chi tiết và bảng yêu cầu cuối. Một số compound words tiếng Anh có artifact khi extract, chưa chứng minh lỗi hiển thị.
- Kiểm ảnh trang PDF mẫu 12, 22, 25, 32: có screenshots thật, captions/text không tràn hoặc chồng. Không tuyên bố đã kiểm trực quan toàn bộ 36 trang.
- Giữ nguyên số liệu, Expected và raw evidence. 19 GitHub Issues đã đăng, từng body khớp nội dung chuẩn bị và GitHub render thành công 43 thẻ ảnh từ 20 PNG nguồn; đã kiểm trong browser context không đăng nhập: 19/19 Issue pages và 43/43 lượt nhúng ảnh tải/decode thành công. Evidence chụp GitHub tại publication-evidence/README.md. Report toàn bài, usability, cross-platform và các giới hạn execution vẫn chưa được coi hoàn tất.

## Phạm vi kết luận

Phần báo bug trong Markdown đủ coverage tập Fail đã ghi nhận của lượt Task 1 hiện hành. Không khẳng định đã phát hiện mọi bug của SUT hoặc hoàn tất mọi requirement nộp bài. Mỗi nhóm đã có một GitHub Issue và screenshots nhúng. Ảnh dùng URL GitHub pin theo commit, không phải attachment user-attachments; repository đã public; không yêu cầu đăng nhập để đọc Issues/ảnh.
