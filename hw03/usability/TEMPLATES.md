# Task 2 — Fields/forms cho web và mẫu export

**Không có dữ liệu thật trong file này.** Theo [plan online](ONLINE-STUDY-PLAN.md), A/B là screening/consent trên participant portal, C là private moderator table, D là moderator notes và task report, E là raw SUS form/export, F là findings UI/export. Participant không phải điền Markdown; tài liệu này là đặc tả nội dung. Dữ liệu thật được server lưu riêng ngoài repo/webroot. Không điền tên/liên hệ/consent/recordings vào repo public. Dùng mã PILOT-01 hoặc P01–P07 trong bản report đã khử định danh; mã dự kiến không chứng minh có participant.

## A. Sàng lọc — lưu riêng

Participant ID: ____ ; ngày: ____ ; người sàng lọc: ____

- [ ] Từ 18 tuổi; đọc hiểu tiếng Việt.
- [ ] Đã từng tìm/xem sản phẩm online trong 12 tháng gần đây.
- [ ] Không thuộc lớp HW03 hiện tại.
- [ ] Không tham gia phát triển SUT hoặc thiết kế study; đã/chưa biết EShop: ____.
- Kinh nghiệm mua sắm online: ____ ; IT/tester hay non-IT: ____ (ưu tiên, không tự động loại).
- Máy/cách truy cập phù hợp: ____ ; đủ điều kiện: ____ ; lý do nếu không: ____.

Chỉ hỏi thông tin cần thiết; không thu ngày sinh, mật khẩu, địa chỉ nhà hoặc giấy tờ định danh.

## B. Thông tin và consent — điền đủ trước khi mời

Người phụ trách và liên hệ: ____
Mục đích: đánh giá flow tìm điện thoại → xem chi tiết → lựa chọn trên EShop cho bài HW03; không mua hàng, không đánh giá năng lực cá nhân.
Thời lượng dự kiến: 15–20 phút; có thể nghỉ/dừng bất cứ lúc nào, không bị phạt.
Dữ liệu: thao tác màn hình, lời nghĩ thành tiếng nếu đồng ý audio, câu trả lời SUS/probes và notes. Không quay camera mặc định.
Nơi lưu riêng: ____ ; người được xem bản gốc: ____ ; hình thức cung cấp evidence riêng cho giảng viên/TA: ____.
Ngày/hạn xóa dự kiến: ____ ; hạn và cách yêu cầu rút dữ liệu trước khi nộp: ____.
Nếu rút hoặc từ chối một loại ghi nhận, dừng loại đó; thống nhất khả năng tiếp tục và ghi giới hạn, không gây áp lực. Nếu không thể thu evidence bắt buộc, giải quyết cách ghi nhận với giảng viên trước khi coi phiên là hoàn chỉnh.

Repo GitHub public chỉ có tài liệu/mẫu và evidence đã khử định danh được phép chia sẻ; **không mặc định đăng recordings, tên hoặc liên hệ**. Danh sách có tên và liên hệ đã che theo đề chỉ gửi riêng cho giảng viên/TA. TA có thể gọi xác minh ngẫu nhiên hai người; cần nói rõ trước khi tham gia. Chưa có thỏa thuận cho dùng dữ liệu cá nhân với AI/cloud; không tải lên mặc định.

Participant ID: ____ ; phiên bản thông tin consent: ____ ; ngày/giờ: ____

| Nội dung | Đồng ý / Không đồng ý |
|---|---|
| Tự nguyện tham gia, đã hiểu mục tiêu và quyền dừng | ____ |
| Ghi màn hình cửa sổ test và lưu theo phạm vi trên | ____ |
| Ghi audio | ____ |
| Notes, SUS/probes và trích dẫn đã khử định danh dùng cho báo cáo học phần | ____ |
| Cung cấp tên/liên hệ đã che cho giảng viên/TA và được liên hệ xác minh | ____ |
| Chia sẻ ảnh/notes đã khử định danh lên GitHub public (tùy chọn, có thể từ chối) | ____ |

Xác nhận thực tế trên web: lựa chọn đồng ý/từ chối không tick sẵn, consent version/time và thao tác submit của participant; participant được xem lại thông tin đã đồng ý. Nếu cần chữ ký riêng theo yêu cầu giảng viên thì đính kèm private reference, không giả coi checkbox là chữ ký số.
Không tự ký hoặc tick thay participant. Đề không cung cấp mẫu consent này; đây là biện pháp tổ chức bảo vệ dữ liệu.

## C. Danh sách xác minh — PRIVATE, không commit

| ID | Tên thật | Zalo/phone đã che 4 số giữa | Đủ điều kiện | Ngày phiên | Consent reference |
|---|---|---|---|---|---|
| ____ | ____ | ____ | ____ | ____ | ____ |

HW03 §6 có cho email nhưng §11 nêu tên + Zalo/phone; ưu tiên Zalo/phone để tránh email-only chưa rõ. Không cần ghi liên hệ đầy đủ vào bảng nộp. Nếu giữ mapping đầy đủ phục vụ liên hệ, lưu riêng có quyền truy cập phù hợp, không trong Git/AI.

## D. Bản ghi phiên — sao chép riêng từng phiên

- ID / attempt ID: ____ ; pilot/main: ____ ; ngày/giờ và timezone: ____.
- Moderator: ____ ; người ghi notes nếu có: ____.
- SUT commit / runtime fingerprint: ____ ; protocol/scenario/SUS version: ____.
- OS/browser/version/viewport/zoom/URL: ____ ; trực tiếp/remote: ____.
- Preflight và consent references (private): ____.
- Recording ID, nguồn upload/import, trạng thái received/verified, checksum/size, vị trí lưu riêng, audio có/không và lý do: ____.
- Portal start/end markers: ____ ; task time xác minh từ live/video và nguồn: ____ (không đồng nhất hai loại).
- Bắt đầu task / kết thúc / thời gian giây / đoạn pause: ____.

| Timestamp/offset | Thao tác/trạng thái quan sát | Lời nói nguyên văn (nếu có) | Prompt/trợ giúp moderator | Diễn giải riêng / evidence reference |
|---|---|---|---|---|
| ____ | ____ | ____ | ____ | ____ |

| Tiêu chí K1 | Đạt / chưa đạt / không quan sát được | Evidence |
|---|---|---|
| Điện thoại trong ngân sách ≤30 triệu | ____ | ____ |
| Mở chi tiết và nêu đúng tên/giá | ____ | ____ |
| Nêu căn cứ trên site và thông báo đã chọn | ____ | ____ |

Outcome: completed-independent / completed-assisted / unfinished / technical-interruption: ____.
Sản phẩm và giá participant nêu: ____ ; căn cứ: ____.
Recovery: observed / not-observed: ____ ; tình huống và cách xử lý: ____.
Lỗi/nhầm lẫn: ____ ; số lần hỗ trợ chỉ đường và nội dung: ____.
Lệch protocol/sự cố, lý do dừng/chạy lại và ảnh hưởng: ____.
Probes clarity / recovery / speed / trust (ghi riêng từng câu): ____.
Không có câu nói trực tiếp thì ghi paraphrase, không tạo quotation.

## E. Raw SUS — mỗi phiên một dòng; giữ nguyên đáp án

| ID | Instrument version | S01 | S02 | S03 | S04 | S05 | S06 | S07 | S08 | S09 | S10 | Missing/reason | Raw reference |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |

Điểm derived để ở bảng khác, không ghi đè raw. Mọi sửa lỗi nhập giữ old/new/reason/reference.

## F. Finding — một nhóm vấn đề

ID: ____ ; tiêu đề trung lập: ____ ; RQ liên quan: ____.
Quan sát: ____ ; participant IDs bị ảnh hưởng / mẫu số có cơ hội gặp: ____.
Evidence/timestamps: ____ ; quote hay paraphrase: ____.
Loại: bug / design issue / preference / thiếu dữ liệu / chưa xác định: ____.
Expected và nguồn nếu là bug: ____ ; actual: ____ ; repro xác minh riêng: ____.
Severity và lý do: ____ ; frequency x/n: ____ ; priority và lý do: ____.
Khuyến nghị: ____ ; hạn chế/giải thích thay thế: ____ ; Issue URL nếu có: ____.
Ảnh đã kiểm không lộ định danh và consent public nếu đăng: ____.
