# Task 2 — Protocol online cho pilot và phiên chính (v0.3, chưa freeze)

Căn cứ: [thiết kế](EVALUATION-DESIGN.md), HW03 §6 Task 2 và slide S13. Mục tiêu: RQ1 tìm/điều hướng/tốc độ, RQ2 hiểu thông tin/tin tưởng, RQ3 phục hồi nếu phát sinh.

## 0. Ánh xạ lên web study

Theo [plan online](ONLINE-STUDY-PLAN.md): screening/consent, scenario, task self-report, SUS và probes là form/màn hình trên portal. Moderator dùng giao diện riêng để ghi notes, hỗ trợ, xác minh K1 và evidence. SUT gốc mở tab/origin riêng, không chèn controls nghiên cứu vào UI SUT.

Luồng compact-screen-v1 có năm nhóm bước trên portal. Participant bấm Quay màn hình, tự chọn tab EShop rồi Dừng quay, tải dự phòng và gửi video; chỉ màn hình, không xin mic/camera hoặc ghi âm. Có thể gửi file quay riêng khi trình duyệt không hỗ trợ. Moderation/think-aloud vẫn trực tiếp bên ngoài portal, quan sát screen share khi có consent; không coi tự điền web một mình là phiên moderated. Theo HW03 §6 Task 2 Phase 2: “Record the screen (and audio, with consent)” và “ask them to think aloud while they work”; không đồng nhất think-aloud với bắt buộc ghi âm. Số trang chưa xác minh từ bản trích xuất. Các đoạn script dưới đây là nội dung web và lời nói moderator, không yêu cầu participant xử lý tài liệu Markdown.

## 1. Preflight bắt buộc trước pilot và kiểm nhanh mỗi phiên

- [ ] Remote web desktop: kiểm link mời và SUT origin từ chính máy participant ngoài host; moderator có call và kênh quan sát theo consent. Không suy cửa sổ ở máy agent là người dùng nhìn được.
- [ ] Ghi OS/browser/version/viewport, zoom 100%, URL và phiên bản SUT. Giữ điều kiện tương đương trong bảy phiên; ghi mọi khác biệt.
- [ ] Kiểm startup: không dùng module khởi tạo DROP/seed. Chỉ dùng runtime tách biệt đã kiểm no-init/read-only; giữ source/DB gốc không đổi, ghi checksum/commit. Lệnh startup và giới hạn kiểm hiện hành ở [hướng dẫn web](../tools/usability-study/README.md) và [verification](../tools/usability-study/VERIFICATION.md).
- [ ] Home tải đủ listing; mở chi tiết hai điện thoại, kiểm tên/giá/mô tả và đường quay lại. Chỉ GET/quan sát; không đăng nhập, thêm giỏ, tạo đơn hoặc chỉnh dữ liệu.
- [ ] 30 triệu là ngân sách bao gồm mức đúng 30 triệu; iPhone/Samsung chỉ là oracle moderator sau khi UI xác minh. Không đưa đáp án cho người tham gia.
- [ ] Home / không từ khóa, không đăng nhập, trạng thái client sạch trong profile test riêng. Không reset DB hoặc xóa dữ liệu cá nhân/browser chính.
- [ ] Participant tắt thông báo/đóng tab cá nhân; không dùng mic/camera trong portal. Kiểm nút quay màn hình với cửa sổ test không riêng tư, chọn đúng tab SUT và phát lại clip ngắn. Kiểm upload/import và receipt trước phiên thật; clip kỹ thuật không phải pilot.
- [ ] Cấu hình consent ở phía moderator: vị trí lưu, ai được xem, hạn xóa/hạn rút. Participant thấy nhãn người phụ trách và cách liên hệ chung, không số cá nhân; xin đồng ý trước khi quay. Danh sách tên/liên hệ xác minh bảy người thu và nộp riêng, không yêu cầu nhập trên portal compact.

Nếu preflight chưa đạt: dừng chuẩn bị môi trường, không đánh participant thất bại và không nhận là đã chạy usability.

## 2. Trình tự điều phối

### Trước task — khoảng 3–5 phút

1. Sàng lọc bằng [mẫu](TEMPLATES.md), gán mã riêng PILOT-01 hoặc P01–P07; consent lưu riêng.
2. Đọc: “Chúng tôi đang kiểm tra website, không kiểm tra năng lực của bạn. Không có đánh giá đúng/sai về bản thân bạn. Bạn có thể dừng hoặc nghỉ bất cứ lúc nào.”
3. Đọc: “Trong lúc làm, hãy nói ra bạn đang nghĩ gì, đang tìm gì và điều gì làm bạn băn khoăn. Tôi sẽ chủ yếu quan sát để hiểu cách website hoạt động với bạn.”
4. Đọc scenario bên dưới. Hỏi “Bạn có câu hỏi nào về mục tiêu không?” Chỉ làm rõ mục tiêu/ngân sách, không nói tên sản phẩm, vị trí nút hay từ khóa.
5. Sau khi người tham gia hiểu mục tiêu, moderator cho mở SUT tab riêng ở Home. Participant quay lại portal, bấm Quay màn hình và tự chọn riêng tab EShop, báo đã sẵn sàng rồi thực hiện theo lời mời moderator. Thử recorder trước đó bằng cửa sổ trống, không ghi consent/liên hệ. Ghi mốc thao tác task đầu tiên bằng quan sát/video; timestamp bấm mở tab chỉ là portal marker, không coi đó là thời gian task chính xác.

### Scenario duy nhất đưa cho participant

> Bạn đang cân nhắc mua một chiếc điện thoại cho bản thân, với ngân sách tối đa 30 triệu đồng. Hãy dùng EShop để tìm một sản phẩm phù hợp. Khi đã quyết định, cho biết bạn chọn sản phẩm nào, giá bao nhiêu và thông tin nào trên website giúp bạn lựa chọn. Chưa cần mua hoặc thêm vào giỏ hàng.

Không chỉ cách bấm, không bắt buộc Search hay xem hai sản phẩm. Cho phép duyệt listing và mở chi tiết trực tiếp.

### Trong task — quan sát trung lập

- Ghi thao tác/timestamp, nhầm lẫn, do dự, câu nói trực tiếp. Tách quan sát khỏi suy luận.
- Khi im lặng có thể nhắc “Bạn đang nghĩ gì lúc này?”; lời nhắc think-aloud trung lập không phải trợ giúp chỉ đường, nhưng vẫn log.
- Tránh “Bạn có thấy ô tìm kiếm không?” hoặc giải thích giao diện, báo bug đã biết, khen/chê lựa chọn.
- Khi được hỏi cách làm: “Bạn sẽ thử làm gì nếu tự sử dụng website?” Không ép tiếp tục nếu họ muốn dừng.
- Không tạo HTTP500, ngắt mạng hoặc ép search rỗng. RQ3 không phát sinh thì ghi không quan sát được; vẫn hỏi probe recovery phù hợp sau task.

### Hỗ trợ và dừng — quy tắc thử trong pilot

- “Hoàn toàn mắc kẹt” được nhận diện khi participant nói không biết tiếp tục và không tìm được hướng đi sau một lời nhắc trung lập. Chỉ khi đó mới hỏi họ có muốn trợ giúp; ghi câu hỗ trợ cụ thể/thời điểm.
- Sau gợi ý chỉ đường, nếu đạt K1 thì là completed-assisted, không còn completed-independent. Không trợ giúp chỉ để nâng tỷ lệ hoàn thành.
- Dừng ngay khi participant yêu cầu, thấy khó chịu, có dữ liệu cá nhân bất ngờ hoặc sự cố mất an toàn.
- Đề xuất mốc an toàn pilot: sau 5 phút làm task, hỏi trung lập họ muốn tiếp tục hay dừng; tối đa 10 phút task thì dừng và ghi unfinished nếu chưa đạt. Đây là giới hạn tổ chức, **không phải ngưỡng usability Pass/Fail**; cần review sau pilot rồi freeze trước phiên chính.
- Lỗi SUT cản task: giữ outcome và evidence như quan sát. Sự cố ngoài task (máy/capture/network setup) ghi technical interruption; không loại phiên âm thầm, ghi attempt ID và lý do chạy lại. Không thay người chỉ vì họ đánh giá thấp.

### Kết thúc task và sau task — khoảng 5–8 phút

- Dừng đồng hồ khi participant thông báo hoàn tất hoặc task bị dừng; ghi tiêu chí K1 từng mục, kết quả independent/assisted/unfinished, hoặc technical interruption tách riêng.
- Nếu participant nói hoàn tất nhưng chưa đạt K1, không chỉ cách sửa; ghi kết quả chưa đáp ứng tiêu chí và lý do.
- Participant quay về portal, tự báo sản phẩm/giá/căn cứ hoặc lý do không tiếp tục; nút hoàn tất không tự đánh K1. Dừng quay sau task trước bảng hỏi; không quay consent/danh tính. Cho tự trả lời 10 câu [SUS](INSTRUMENTS.md) trên web trước probes; không ép trả lời nếu từ chối, missing phải giữ nguyên. Không xem điểm rồi yêu cầu đổi đáp án; không giảng giải theo hướng tích cực.
- Hỏi bốn nhóm probes, đào sâu ví dụ vừa quan sát, tránh câu dẫn dắt. Ghi thiếu/không trả lời đúng thực tế.
- Cảm ơn, nhắc cách liên hệ/rút dữ liệu; bảo đảm đã dừng record trước khi thu thêm thông tin cá nhân. Participant tải bản dự phòng rồi bấm Gửi video đã quay; nếu lỗi giữ trang/file để gửi lại hoặc gửi riêng cho moderator import đúng phiên. Video chưa gửi chỉ nằm trong bộ nhớ tab; reload/đóng tab có thể mất. Receipt chỉ xác nhận đã nhận file; moderator mở/phát lại mới xác minh evidence. Không quay màn hình chứa consent/liên hệ.

## 3. Sau mỗi phiên

- Hoàn thiện notes ngay, đối chiếu recording, giữ raw responses nguyên trạng. Không dựng lời trích dẫn từ trí nhớ.
- Lưu private original, tạo bản đã khử định danh cho report/Git nếu được phép. Không gửi recording/liên hệ lên AI.
- Ghi phiên bản protocol, bất kỳ lệch quy trình nào và ảnh hưởng. Sau freeze không tự đổi task/thang đo giữa chừng; nếu bắt buộc phải đổi, tạo version và nêu giới hạn so sánh.
- Pilot không gộp vào n=7. Mỗi phiên chính có một bản ghi riêng và về sau một commit riêng khi được phép.
