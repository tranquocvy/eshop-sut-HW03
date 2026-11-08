# Task 1 — Bắt đầu

Mở [Task1_Report.md](Task1_Report.md) hoặc [PDF tương ứng](Task1_Report.pdf) để đọc báo cáo có đủ 19 nhóm lỗi/vấn đề thiết kế và screenshots. [index.html](index.html) là bảng execution 122 instance để tra cứu offline.

Task 1: thiết kế và thực thi GUI cho Home (H) / Product Detail (D). 52 ID, 122 instance; 119 instance có quan sát UI thuộc 51 ID. Có quan sát UI không đồng nghĩa mọi assertion đã được thực thi hoặc đạt. Ba instance không có UI: GUI-015 H/D (zoom trình duyệt 200%) và GUI-017 real-IME. Chưa kiểm tra zoom thật và IME thật; nhập Unicode không thay thế IME. GUI-033 H/D đạt theo kiểm tra thủ công do người dùng báo cáo, không phải lượt chạy mới của agent. GUI-036 D còn needs-review về applicability, không tự gán N/A. Yêu cầu ≥3 nền tảng thuộc Task 3, không thuộc báo cáo này.

Kết quả effective: **75 pass · 31 fail · 15 blocked · 1 needs-review**. Raw: 44 / 26 / 14 / 38.

- [Excel](GUI_Checklist_Results.xlsx)
- [JSON](results.json)
- [Findings](findings/README.md)

Không cần chạy SUT để đọc gói này.

[PDF report](Task1_Report.pdf)

Đã đăng [19 GitHub Issues](https://github.com/tranquocvy/eshop-sut-HW03/issues) có screenshots; URL từng nhóm ở report/findings. Chỉ 20 PNG evidence đã được commit/push, các tài liệu này vẫn đang hoàn thiện local.

## Evidence GitHub công khai

Đã kiểm 19/19 Issues và 43/43 lượt nhúng ảnh bằng browser không đăng nhập. [39 ảnh chụp và bảng xác minh](publication-evidence/README.md). Đây là verification công bố, không phải lượt chạy SUT mới.
