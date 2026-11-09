# Pilot nội bộ v0.4 — Biên bản và kiểm nhận

**Ngày phiên:** 10/11/2026 (UTC+07:00). **Loại:** pilot nội bộ, không nằm trong bảy phiên chính. **Trạng thái:** khảo sát/video đã nhận; chưa có review nội dung độc lập hoặc freeze.

## 1. Mục đích, scenario và phương pháp

Phiên dùng compact-screen-v1, probes v0.4, SUS 10 câu; nguồn SUT/công cụ tại commit `5444b25aad5cd9942d3962f8beab3879dc1e10bb`. Mục đích pilot là thử tính rõ ràng, luồng và công cụ trước các phiên chính, không tạo số liệu đại diện cho người dùng mục tiêu.

Scenario D2-A: tìm điện thoại tối đa 30 triệu đồng, đọc chi tiết rồi thông báo lựa chọn và căn cứ trên website; không mua hoặc thêm giỏ. K1 là lựa chọn đúng loại/ngân sách, mở chi tiết và nêu căn cứ không có chỉ đường. Xem [thiết kế](../../EVALUATION-DESIGN.md), [protocol](../../PROTOCOL.md), [instruments](../../INSTRUMENTS.md).

Portal mở SUT ở origin riêng, participant tự chọn consent và bề mặt quay; recorder chỉ màn hình, không mic/camera/audio. Việc nhận biểu mẫu không xác nhận K1 hoặc moderation/think-aloud. Không có bản ghi quan sát live độc lập cho phiên này.

## 2. Kết quả kiểm nhận có thể chứng minh

| Hạng mục | Kết quả | Giới hạn |
|---|---|---|
| Phiên | Đã nộp, phase done; đánh dấu pilot nội bộ | done là biên nhận, không chứng minh task thành công hoặc profile hợp lệ cho mẫu chính |
| SUS | Đủ 10 câu hợp lệ 1–5; tính lại công thức khớp export | Raw, contributions và điểm nằm trong gói private; không công bố câu trả lời cá nhân ở đây |
| Probes v0.4 | Có bốn trường lựa chọn hợp lệ, giữ Có/Không/Không chắc/Bỏ qua | Không suy có đầy đủ giải thích, không biến tự báo recovery thành quan sát |
| Video | Một WebM, 10,736,126 bytes; hash đối chiếu metadata lưu trữ khớp | Bản gốc và hash chi tiết giữ riêng, không đưa video vào Git |
| Tracks | Container metadata có 1 video track, 0 audio track | Không phải kiểm toàn bộ codec/bitstream hoặc chứng minh nội dung đúng task |
| Decode | Chromium tải dữ liệu, kích thước 2560×1440; playback tiến lên và có frame được decode | Chỉ kiểm đoạn phát ngắn, chưa review hết nội dung; duration hữu hạn chưa đọc được |
| Xuất báo cáo | JSON, CSV, Markdown, HTML và PDF private đã tạo; SUS được tính lại độc lập | Export DRAFT, không thay review của người tổ chức |
| PDF private | 10 mục; không tràn chiều rộng khi in; chưa kiểm tay từng trang | Đây không phải xác nhận báo cáo nghiên cứu cuối hoàn tất |
| Tổng hợp mẫu chính | Phiên pilot không vào main summary; số main được review là 0 | Không suy đã có bảy phiên chính |
| Review/freeze | Chưa đánh moderatorReviewed; study chưa freeze | Không tự chuyển received thành verified |

## 3. Quan sát và findings

Không có structured observation notes hoặc thời gian task đã xác minh. Vì vậy chưa kết luận hoàn thành độc lập/có trợ giúp, lỗi/do dự, recovery quan sát được, mức độ khó hiểu của scenario/câu hỏi hoặc severity. Câu trả lời tự báo nằm trong gói riêng; không được phục dựng thành lời nói/quan sát trực tiếp.

Không tạo bug Issue mới, finding hoặc severity chỉ từ trạng thái done/điểm SUS. Nếu phát hiện vấn đề sau review, đối chiếu SRS và Issues Task 1 trước khi ghi bug với screenshot được phép chia sẻ.

## 4. Điều chỉnh và giới hạn pilot

- **Trước phiên này:** probes được chuyển từ v0.3 sang v0.4, có nhánh và giải thích tùy chọn, giữ nguyên SUS. Đây là thay đổi đã có trước phiên, không ghi thành phát hiện từ phiên 10/11.
- **Sau phiên này:** mới kiểm nhận, tính lại điểm và xuất báo cáo; chưa có change record dựa trên review nội dung. Không tuyên bố câu hỏi đã rõ hoặc không cần sửa chỉ vì nộp đủ.
- Pilot nội bộ có exposure với thiết kế, không coi là mẫu đại diện và không tính vào bảy người ngoài lớp. Điều kiện áp dụng pilot nội bộ cho bài cần người tổ chức/giảng viên xác nhận; không tự kết luận đạt toàn bộ Phase 1.
- Chưa có observer notes, timing hoặc review đầy đủ video. Không thu âm không đồng nghĩa có bằng chứng think-aloud.

## 5. Hồ sơ và bước tiếp theo

**Trong Git:** biên bản này, [receipt.json](receipt.json), [README](README.md) và bản PDF biên bản không chứa đáp án cá nhân. **Ngoài Git:** DB, bản gốc video, hash chi tiết, export JSON/CSV/Markdown/HTML/PDF đầy đủ. Không có credential, invitation hoặc contact mapping trong bộ Git.

1. Người tổ chức review private report và toàn bộ video, ghi notes có timestamp nếu có căn cứ; giữ rõ nguồn retrospective khác quan sát live.
2. Thu phản hồi cụ thể về scenario, câu SUS/probes, recording/upload và thời lượng; ghi change record hoặc lý do giữ nguyên sau review thật.
3. Nếu điều chỉnh, thử lại phần bị ảnh hưởng. Chốt protocol/scenario/instrument và thực hiện pilot phù hợp nếu cần trước các phiên chính.
4. Tuyển bảy người đúng profile, thu consent và liên hệ riêng; thực hiện moderated sessions theo [kế hoạch phân tích](../../ANALYSIS.md).

## 6. Đối chiếu đề

Đề HW03 §6 Task 2 Phase 1 yêu cầu pilot để tìm scenario chưa rõ/flow hỏng/vấn đề thời lượng rồi refine trước phiên chính. §12 yêu cầu commit theo bước, gồm từng phiên usability. §14 yêu cầu report Markdown + PDF và session evidence. Biên bản này ghi đúng bằng chứng của một pilot nội bộ; không thay bộ report bảy phiên, participant roster, notes hoặc severity-ranked findings còn thiếu. Số trang PDF đề chưa xác minh.
