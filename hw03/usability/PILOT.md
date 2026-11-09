# Task 2 — Pilot, chỉnh sửa và freeze

**Chưa có pilot đủ điều kiện được review/freeze.** Mẫu không chứa feedback hoặc xác nhận người thật. Theo [plan online](ONLINE-STUDY-PLAN.md), pilot chạy đủ luồng web, participant dùng recorder screen-only trên portal rồi upload; file quay ngoài là fallback; checklist/change record/freeze được đưa vào moderator UI. Không yêu cầu người tham gia điền Markdown.

## Pilot nội bộ và điều kiện mẫu

Pilot nội bộ với người thuộc lớp/người thiết kế chỉ dùng diễn tập quy trình và thu lỗi kỹ thuật; ghi rõ exposure, không tính vào bảy phiên chính và không coi là pilot đại diện đã đạt yêu cầu. Đề §6 không nói rõ ngoại lệ cho pilot đối với quy định ngoài lớp; phương án an toàn là pilot thêm với người ngoài lớp đúng profile hoặc xin giảng viên xác nhận. Với compact, moderator đánh dấu accommodation `INTERNAL-PILOT:` cho phiên kind=pilot mới cho phép screening Không tiếp tục; lưu nguyên câu trả lời Không, không đổi eligibility thành Có. Main/legacy không có ngoại lệ này. Consent vẫn do participant chọn. Chưa có live observer thì không ghi đã quan sát think-aloud.

## 1. Mục tiêu pilot

Kiểm scenario có rõ và khả thi; flow có bị hỏng; thời lượng có phù hợp; SUS bản Việt có bị hiểu sai (đặc biệt câu phủ định); moderator ghi notes và recording có đủ dùng không. Pilot không nhằm kiếm một điểm SUS đẹp hoặc bắt mọi người phải thành công.

## 2. Chuẩn bị và chạy

- [ ] Mọi preflight trong [protocol](PROTOCOL.md) đạt trên máy tổ chức/participant; hoàn thiện thông tin consent trước khi thu dữ liệu.
- [ ] Một người thật phù hợp profile, mã PILOT-01; ưu tiên không nằm trong bảy người chính. Nếu tái dùng người đó ở phiên chính khác phải ghi exposure và hạn chế, không tính một phiên hai lần.
- [ ] Chạy screening/consent trên web → briefing/scenario → record trên máy → SUT tab riêng + think-aloud/notes live → SUS/probes trên web → upload/receipt → moderator xác minh video; không đưa tên sản phẩm đúng trước task.
- [ ] Sau phần tiêu chuẩn, hỏi riêng về câu nào khó hiểu, họ hiểu nhiệm vụ ra sao, có mệt hoặc thời lượng bất hợp lý không. Không sửa raw SUS theo trao đổi sau đó.
- [ ] Kiểm mở lại recording, đồng bộ timestamp, đủ notes và raw responses; ghi mọi thiếu hụt trung thực.

## 3. Mẫu kết quả pilot (để trống tới khi có phiên thật)

| Trường | Kết quả thật |
|---|---|
| Ngày/giờ, participant ID, version | ____ |
| Task có được hiểu đúng mục tiêu không? | ____ |
| Flow/data có khả thi trên UI không? | ____ |
| Thời lượng briefing/task/SUS/probes | ____ |
| Câu SUS/scenario bị hiểu sai và evidence | ____ |
| Vướng mắc moderator/capture | ____ |
| Điều cần đổi, lý do, tác động tới phép đo | ____ |
| Cần pilot lại? lý do | ____ |

## 4. Freeze trước bảy phiên chính

- [ ] Khóa scenario A/K1 và ba RQ; ghi version/date.
- [ ] Review/freeze ngôn ngữ SUS; nếu thay thang phải đồng bộ toàn bộ bộ dụng cụ.
- [ ] Chốt máy/browser/viewport remote desktop, hai origins HTTPS, call/screen share theo consent, công cụ record, video quota và đường upload/import dự phòng.
- [ ] Chốt assistance rule, các mốc check-in/stop, định nghĩa lỗi và cách ghi thời gian/pause. Mốc 5/10 phút hiện chỉ là đề xuất thử, không phải benchmark.
- [ ] Chốt nơi lưu, người được truy cập, thời hạn xóa/rút dữ liệu và cách nộp evidence riêng.
- [ ] Kiểm bộ mẫu đủ và không dẫn dắt; ghi người review thật, không tự ghi sinh viên đã review khi chưa có.
- [ ] Nếu thay đổi lớn vì pilot, thử lại phần bị ảnh hưởng trước freeze.

Freeze record: protocol/scenario/SUS versions ____ ; ngày ____ ; người review ____ ; điều chỉnh đã áp dụng ____ ; residual limitations ____.

## 5. Bảy phiên chính — lịch trống, không phải participant đã tuyển

| Slot dự kiến | Người thật đủ điều kiện | Lịch | Đã chạy | Notes/raw SUS/probes/evidence đã kiểm |
|---|---|---|---|---|
| P01 | ____ | ____ | Chưa ghi nhận | ____ |
| P02 | ____ | ____ | Chưa ghi nhận | ____ |
| P03 | ____ | ____ | Chưa ghi nhận | ____ |
| P04 | ____ | ____ | Chưa ghi nhận | ____ |
| P05 | ____ | ____ | Chưa ghi nhận | ____ |
| P06 | ____ | ____ | Chưa ghi nhận | ____ |
| P07 | ____ | ____ | Chưa ghi nhận | ____ |

Chỉ đánh hoàn tất từng slot sau phiên thật và kiểm evidence. Lưu riêng từng phiên; không tạo kết quả dự đoán. Sau mỗi phiên giữ bản đã khử định danh để commit riêng khi được phép; không đưa private originals vào Git. Không đổi task giữa phiên chỉ vì đã biết bug hoặc muốn kết quả thuận lợi hơn.
