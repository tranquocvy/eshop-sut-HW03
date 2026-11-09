# Task 3 — Cross-Browser / Cross-Platform

Ngày tổng hợp: 10/11/2026 (Asia/Bangkok). Trạng thái: đã thực thi và đóng gói ba browser; chưa xác nhận đủ điều kiện nộp.

## Phạm vi và phương pháp

EShop frontend-web thật: Home / Listing & Search (FR-05), Product Detail (FR-06), header/navigation. Giữ 52 ID/122 biến thể từ checklist Task 1. Source commit của từng record nằm trong results.json; SUT runtime là bản sao source tracked, DB chỉ đọc, không seed/reset/fix sản phẩm. Playwright thực hiện thao tác/assertion; browser mới có context sạch, không retry che Fail. GUI-048 chạy trước; GUI-026/027 bị chặn trước UI khi root Detail không đạt; GUI-050 có gate riêng.

## Kết quả raw

| Browser | Pass | Fail | Blocked | Needs review | Tổng |
|---|---:|---:|---:|---:|---:|
| chrome | 44 | 26 | 14 | 38 | 122 |
| edge | 44 | 26 | 14 | 38 | 122 |
| firefox | 44 | 26 | 14 | 38 | 122 |
| Tổng | 132 | 78 | 42 | 114 | 366 |

Không hiểu native test passed là GUI Passed. Có 52 ID, 122 biến thể riêng biệt và 366 execution records; không báo 366 checklist ID. Counts được tính lại từ records, không nhập kết quả Task 1.

## So sánh browser

Không có khác biệt ở verdict raw của 122 comparison keys giữa ba browser. Điều này không chứng minh UI giống hệt: 38 biến thể/browser cần đánh giá thị giác/hành vi/applicability. Chrome/Edge dùng Blink, Firefox dùng Gecko; không gọi ba hệ điều hành. 26 Fail/browser có cùng khóa kiểm thử; chưa có bằng chứng độc lập về bug chỉ xảy ra ở một browser.

## Findings và bằng chứng

[Đối chiếu 19 nhóm Issues Task 1](findings/README.md). Các nhóm đã có Issue được liên kết lại; không tạo Issue trùng hoặc khai 78 Fail là 78 bugs. Các nhóm lịch sử dựa trên review có thể vẫn needs-review ở Task 3. Xem từng assertion trong JSON, không suy recurrence chỉ từ ID.

[Môi trường và versions](ENVIRONMENTS.md), [366 records](results.json), [checksum inventory](evidence/inventory.json), [queue review](HUMAN-REVIEW.html), [ma trận 122 biến thể](comparison.html).

## Giới hạn và việc còn mở

- Edge GUI-001 native screenshot checksum mismatch: excluded from packaged evidence; content original retained; cần chụp lại native evidence.
- Edge thay Safari/Android Chrome theo lựa chọn của sinh viên; chưa có xác nhận TA rằng thay thế này được chấp nhận.
- 114 biến thể needs-review: chưa có human sign-off trên evidence Task 3; không kế thừa manual Pass của Task 1.
- Firefox dùng binary có patch của Playwright 159.0, không phải Firefox Microsoft Store; URL trong ảnh là nhãn từ page.url(), không phải thanh địa chỉ thật.
- Chrome dùng overlay nền tối của lượt trước; Edge/Firefox dùng nền trong suốt. Không chỉnh ảnh lịch sử để giả lượt chạy mới.
- Overlay hiện có email/MSSV qua email, chưa có họ tên đầy đủ theo §11. Cần làm rõ/bổ sung identity evidence trước nộp.
- Zoom 200% và IME thật chưa thực thi; dependency Blocked không được coi Pass/N/A.
- Windows ở cả ba browser; VM chỉ là viewport hẹp, không phải Android.
- 14 Blocked mỗi browser được giữ nguyên; thiếu capability khác lỗi SUT. SQLite chỉ đọc giới hạn kết luận nghiệp vụ ghi.
- Firefox full có hai run: 46 kết quả lưu ở run đầu bị treo, 76 ở run tiếp nối. Verifier single-run báo orphan root; mapping hợp nhất đã đối chiếu root ở run đầu.
- Chưa commit/push/publish; evidence chỉ trong workspace. BrowserStack không được dùng làm execution evidence.

## Hồ sơ AI và khả năng tái tạo

AI tái sử dụng adapter Task 1, cấu hình browser, chạy test, thu evidence, kiểm checksum và tổng hợp. Sinh viên chọn Edge và duyệt kiểu overlay; chưa có review đủ 114 biến thể mới. Không tự ký thay sinh viên. Không sửa log AI lịch sử hoặc dựng prompt/output. Provenance của mỗi record và run root được giữ trong JSON. Code adapter/raw trace/video ở _working; builder tổng hợp được lưu cùng bộ giao.

## Kết luận

Đã có execution cho Chrome, Edge và Playwright Firefox; bộ này là bản tổng hợp để review. Chỉ đóng nghĩa vụ nộp khi giải quyết review, identity và các ngoại lệ browser/capture theo đề.