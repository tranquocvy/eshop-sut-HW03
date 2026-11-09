# Task 2 — Thiết kế đánh giá usability (v0.2)

**Trạng thái:** đã chốt thiết kế ban đầu D1-A / D2-A / K1; flow không trùng thành viên nhóm đã được sinh viên xác nhận ngày 09/11/2026. Ba câu hỏi RQ1–RQ3 giữ nguyên. Chưa có pilot đủ điều kiện được review/freeze hoặc bộ bảy phiên chính được xác minh. Nghiên cứu sẽ được tổ chức bằng [web study online](ONLINE-STUDY-PLAN.md): mọi form trên portal, SUT gốc ở tab riêng, recorder screen-only trên portal, video thủ công là fallback. Tính khả thi UI remote và điều chỉnh sau pilot còn phải kiểm chứng; chưa hoàn tất T03.

## 1. Căn cứ và phạm vi

- HW03 tiếng Anh, §5/§6 Task 2: một flow end-to-end không trùng nhóm; pilot trước bảy phiên chính. §11–12/14: authenticity, commit từng phiên và evidence.
- Slide S13: “Basic components”, “Typical test plan format”, “Task selection for evaluation”, “Task components”, “Measurements and Questionnaires”, “Analyzing Data”. Dùng cấu trúc có sẵn của bài giảng, chưa cần thêm nền tảng/công cụ.
- [PLAN §1](../PLAN.md#1-phạm-vi): Home / Product Listing & Search → Product Detail → lựa chọn. Không thêm đăng ký/đăng nhập, giỏ hàng, checkout, coupon.
- [SRS FR-05/FR-06](../../README.md): listing/search theo tên và chi tiết. Code chỉ giúp nhận diện khả năng triển khai, không thay yêu cầu.
- Đã đọc [Home](../../frontend-web/src/pages/Home.jsx) và [ProductDetail](../../frontend-web/src/pages/ProductDetail.jsx): không thấy bộ lọc giá/danh mục trong hai màn hình; không bắt buộc participant dùng bộ lọc không có.
- Đã truy vấn backend/database.sqlite bằng readOnly, không import initializer database.js hoặc seed/reset. Năm sản phẩm hiện có:

| Sản phẩm | Giá (₫) | Mô tả |
|---|---:|---|
| iPhone 15 Pro Max | 30.000.000 | Điện thoại cao cấp của Apple |
| Samsung Galaxy S24 Ultra | 28.000.000 | Màn hình hiển thị xuất sắc, camera siêu zoom |
| MacBook Pro M3 | 45.000.000 | Laptop chuyên nghiệp mạnh mẽ |
| Tai nghe AirPods Pro 2 | 6.000.000 | Chống ồn chủ động xuất sắc |
| Bàn phím cơ Keychron Q1 | 4.000.000 | Gõ cực sướng, thiết kế kim loại |

**Giới hạn kiểm chứng:** database không chứng minh UI/API đang render đúng. Ở bước thiết kế ban đầu chưa khởi động SUT; nay runtime local và parity UI đã được kiểm trong [verification](../tools/usability-study/VERIFICATION.md), chưa kiểm UI từ máy ngoài host. Phải kiểm lại trước pilot; catalog nhỏ/mô tả ngắn hạn chế độ sâu kết luận. Không sửa dữ liệu để ép task thành công.

## 2. Người dùng mục tiêu là ai? — D1

| Lựa chọn | Profile đề xuất | Ưu | Nhược |
|---|---|---|---|
| **A — đã chọn** | Người trưởng thành từ 18 tuổi, đọc hiểu tiếng Việt, từng tìm/xem sản phẩm trực tuyến trong 12 tháng gần đây; không cần biết EShop hoặc thành thạo IT | Gần đối tượng web bán hàng, có nhiều mức kinh nghiệm | Khó tuyển hơn một nhóm bạn đồng lứa; bảy người không đủ so sánh đáng tin cậy theo tuổi/nghề |
| B — không chọn | Giới hạn profile A vào sinh viên ngoài lớp HW03 | Dễ tuyển/sắp lịch, nhu cầu gần nhau | Mẫu hẹp; không suy rộng cho mọi người mua sắm |

- Cả hai: ngoài lớp HW03; ưu tiên non-IT/non-tester nhưng không loại mặc định mọi người học IT. Tránh người đã phát triển SUT hoặc thiết kế nghiên cứu để giảm quen task.
- Mốc 18 tuổi/12 tháng và việc tránh người quen nghiên cứu là **lựa chọn thiết kế**, không phải quy định của đề.
- Không tự ghi đã có bảy người phù hợp. Không lưu liên hệ, consent hoặc recordings trong tài liệu dự kiến chia sẻ công khai này.

## 3. Ba câu hỏi muốn tìm hiểu là gì?

| ID | Câu hỏi nghiên cứu | Evidence cần thu sau này |
|---|---|---|
| RQ1 | Người dùng có tự tìm được sản phẩm đáp ứng nhu cầu và tới chi tiết không; vướng ở đâu và mất bao lâu? | Đường đi, completion độc lập/có hỗ trợ, thời gian, thao tác nhầm/do dự; probe clarity/speed |
| RQ2 | Người dùng có hiểu tên/giá/mô tả đủ để lựa chọn và giải thích căn cứ không; tin tưởng quyết định tới mức nào? | Trang đã xem, thông tin được dùng/còn thiếu, lựa chọn cuối, lời giải thích; probe clarity/trust |
| RQ3 | Khi cách tìm ban đầu không cho kết quả phù hợp, người dùng có nhận ra và tự điều chỉnh được không? | Nếu tình huống phát sinh: đổi từ khóa/quay lại, số lần thử, hỗ trợ; probe error recovery sau phiên |

**RQ3:** nếu không gặp khó khăn/no-result, ghi “không quan sát được” cho recovery thực tế, không đánh Pass. Không cố tình gây lỗi hoặc biến câu trả lời giả định thành hành vi đã quan sát. Nếu pilot cho thấy cần task recovery riêng, review phạm vi/protocol trước các phiên chính. Bộ chuẩn bị hiện dùng SUS và probes trong [INSTRUMENTS](INSTRUMENTS.md); bản dịch Việt làm việc cần review/pilot, chưa freeze.

## 4. Luồng bắt đầu và kết thúc ở đâu? — D2

### Phạm vi chung đề xuất

- **Bắt đầu:** Home /, listing đã tải, chưa có từ khóa, chưa đăng nhập. Chọn remote web desktop; browser/viewport và công cụ quay thủ công sẽ chốt trước pilot/freeze. Không suy Task 2 phải chạy ba nền tảng.
- **Đường đi tự do:** listing và/hoặc search → chi tiết → có thể quay lại xem phương án khác → lựa chọn. Không bắt buộc dùng Search hay số click cụ thể.
- **Kết thúc:** participant thông báo sản phẩm được chọn, hiển thị chi tiết tương ứng và nêu căn cứ. Đây là lựa chọn, không phải giao dịch mua hàng.
- Không dùng thêm vào giỏ làm tín hiệu hoàn thành; không thêm tài khoản/checkout.

### A — Điện thoại trong ngân sách (đã chọn)

**Scenario đã chọn cho bước chuẩn bị; cần kiểm chứng qua pilot:**

> Bạn đang cân nhắc mua một chiếc điện thoại cho bản thân, với ngân sách tối đa 30 triệu đồng. Hãy dùng EShop để tìm một sản phẩm phù hợp. Khi đã quyết định, cho biết bạn chọn sản phẩm nào, giá bao nhiêu và thông tin nào trên website giúp bạn lựa chọn. Chưa cần mua hoặc thêm vào giỏ hàng.

- **Ưu:** hiện có hai ứng viên đáp ứng ngân sách; không có một sản phẩm yêu thích bắt buộc; không phụ thuộc thông số kỹ thuật vắng mặt.
- **Nhược:** catalog nhỏ, có thể hoàn thành nhanh; sở thích thương hiệu có thể ảnh hưởng, cần ghi nhận chứ không xem là lỗi participant.
- **Oracle riêng cho moderator:** iPhone 15 Pro Max hoặc Samsung Galaxy S24 Ultra đều có thể hợp lệ; phải kiểm lại trên UI trước pilot. Không đọc đáp án cho participant.

### B — Tai nghe chống ồn trong ngân sách (phương án không chọn)

> Bạn cần một chiếc tai nghe có chống ồn để sử dụng khi học hoặc làm việc, với ngân sách tối đa 6 triệu đồng. Hãy dùng EShop để chọn một sản phẩm đáp ứng nhu cầu và cho biết giá cùng thông tin trên website giúp bạn quyết định. Chưa cần mua hoặc thêm vào giỏ hàng.

- **Ưu:** tiêu chí rõ, phải đọc mô tả; dễ xác định đáp ứng nhu cầu.
- **Nhược:** hiện chỉ một ứng viên; ít quan sát cân nhắc, dễ thành bài tìm đúng món.
- **Oracle riêng:** AirPods Pro 2 theo dữ liệu hiện tại; không yêu cầu tương thích thiết bị hoặc thông số ngoài mô tả.

Đã chọn **scenario A** làm cơ sở chuẩn bị; sau pilot, freeze một scenario chung cho bảy phiên chính, không để mỗi participant chọn A/B. Flow tìm → chi tiết → lựa chọn đã được sinh viên xác nhận không trùng thành viên nhóm.

## 5. Thế nào là hoàn thành thành công? — D3

### K1 — Lựa chọn có căn cứ (đã chọn)

Hoàn thành độc lập khi đạt cả ba tiêu chí, không có gợi ý chỉ đường:

1. Từ Home tìm được sản phẩm thỏa loại sản phẩm và ngân sách trong scenario đã chốt.
2. Mở chi tiết sản phẩm đó, xác định đúng tên/giá hiển thị so với tiêu chí ngân sách.
3. Nêu ít nhất một căn cứ lựa chọn từ thông tin trên site, thông báo đã chọn xong.

- **Ưu:** đo tìm kiếm, hiểu thông tin và quyết định; đúng flow ngắn đã chọn.
- **Nhược:** không chứng minh đã cân nhắc nhiều phương án; catalog nhỏ có thể tạo ceiling effect.
- Không bắt buộc từ khóa/click cụ thể; không chấm thất bại chỉ vì sở thích thương hiệu hoặc thiếu tin tưởng.

### K2 — Lựa chọn sau khi xem hai phương án (phương án không chọn)

Giữ K1 và yêu cầu xem chi tiết ít nhất hai điện thoại trước khi lựa chọn. Chỉ phù hợp D2-A; nếu chọn phải sửa scenario để yêu cầu cân nhắc hai phương án tự nhiên.

- **Ưu:** quan sát quay lại/đổi phương án và so sánh thông tin.
- **Nhược:** tăng yêu cầu task, có thể thiếu tự nhiên với mô tả ngắn; không phải minimum của đề. Không chấm K2 ngầm trên scenario K1.

### Cách ghi kết quả đề xuất

- **Hoàn thành độc lập:** đạt mọi tiêu chí, không có hỗ trợ chỉ đường.
- **Hoàn thành có hỗ trợ:** đạt sau trợ giúp; ghi nội dung/thời điểm, không gộp vào độc lập.
- **Chưa hoàn thành:** dừng mà chưa đạt; phân biệt bỏ cuộc, chọn không đáp ứng, SUT ngăn cản. Không quy mọi nguyên nhân thành lỗi người dùng.
- **Gián đoạn kỹ thuật/phiên không hợp lệ:** sự cố môi trường ngoài task; ghi riêng và xử lý lại theo protocol, không loại im lặng.
- Ghi thời gian từ thao tác bắt đầu sau khi hiểu task đến thông báo hoàn tất/dừng. Chưa đặt benchmark hoặc timeout tùy ý; chốt sau pilot trước phiên chính.
- Nếu site thiếu thông tin khiến participant không chọn được: giữ đây là kết quả; không dẫn dắt chọn cho đủ completion.

## 6. Quyết định và bước tiếp theo

| Mục | Lựa chọn | Trạng thái |
|---|---|---|
| D1 — Profile | A: người mua sắm trưởng thành phổ thông, theo §2 | Đã chốt thiết kế ban đầu |
| D2 — Scenario | A: điện thoại tối đa 30 triệu | Đã chốt; cần kiểm UI và pilot |
| D3 — Success | K1: lựa chọn có căn cứ | Đã chốt; không bắt buộc xem hai phương án |
| Phạm vi nhóm | Tìm → chi tiết → lựa chọn | Sinh viên đã xác nhận không trùng nhóm |
| Môi trường | Remote web desktop, portal + SUT tab riêng | Hướng online đã chọn; runtime/UI remote chưa kiểm chứng |

Đã có [web local](../tools/usability-study/README.md): runtime giữ source UI gốc, portal/forms/moderator/evidence/export đã implement và kiểm kỹ thuật. Bước tiếp theo theo [plan online](ONLINE-STUDY-PLAN.md): review local → QA HTTPS từ máy ngoài host → pilot và sửa/freeze → bảy phiên và analysis. Việc chốt thiết kế không chứng minh đã tuyển người, có consent, chạy pilot hoặc hoàn tất T03.
