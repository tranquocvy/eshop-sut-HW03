# HW03 — Thiết kế GUI checklist

**Phiên bản:** v0.5 — bổ sung GUI-051/052 theo đề xuất của sinh viên sau review, 07/11/2026.

## 1. Phạm vi và cơ sở thiết kế

- **H:** Home / Product Listing & Search (FR-05), route `/`.
- **D:** Product Detail (FR-06), route `/product/:id`; header/navigation liên quan.
- Luồng chọn sản phẩm kết thúc ở việc đọc chi tiết và lựa chọn, không gồm đăng nhập, OTP, trang giỏ hàng, coupon hoặc checkout. Control số lượng/Thêm vào giỏ hiện trên H/D chỉ được xét về GUI/validation/feedback ngay tại màn hình; không kiểm thử nghiệp vụ giỏ hàng.
- **R**: yêu cầu trực tiếp của [SRS](../../README.md), mã FR/SEC ghi từng dòng. **L**: kỹ thuật/chủ đề giảng dạy. **H**: tiêu chí vận hành đề xuất từ S13, không phải câu chữ bắt buộc của SRS. Kết quả vi phạm H cần phân loại heuristic/design finding, không tự quy thành bug trái spec.
- Nguồn giảng dạy: `S13_GUI Testing & Usability Testing.pdf`, tại thư mục HW03 cha repo, tr.7–8, 11–20, 22–28. S13 tr.16: GUI/application standards, màu sắc, typography, layout/alignment, labels, error messages; tr.17–18: navigation/breadcrumb/focus; tr.19: EP/BVA/state. Số trang là vị trí trang PDF.
- Đề `2026.HW03.GUI Usability_En.pdf`, §4–6: hơn 40 mục, phủ IA-01–04; §6 yêu cầu sinh viên bổ sung phần AI bỏ sót và giải thích từng mục thêm. IA là nhóm giao diện, không phải mã FR. §14 yêu cầu Excel khi hoàn thiện bài; 30 điểm Task 1 gồm cả execution và bug report, không chỉ thiết kế.
- Không coi mã nguồn hiện tại là expected. Không yêu cầu RTL/dark mode, giới hạn ký tự, quy tắc hoa/thường hoặc bỏ dấu nếu chưa có căn cứ. S13 không đặt ngưỡng WCAG, thời gian đáp ứng hay viewport bắt buộc.

## 2. Điều kiện và dữ liệu

- Baseline SUT: `85af3ba875c88283615e22cb108f13e2fccaf0e9`. Dùng bản runtime riêng, không sửa production source/database repo.
- **V-D (viewport desktop):** 1440×900 CSS px; **V-M (viewport hẹp):** 390×844 CSS px. H/D chỉ là tên trang. Đây là mẫu kiểm tra đề xuất, không đại diện cho việc đã chạy ≥3 nền tảng.
- Người dùng ẩn danh. Mỗi biến thể cần state sạch dùng browser context riêng, xác nhận không có auth token, giỏ local hoặc dữ liệu cũ trong localStorage/sessionStorage/cookie của origin SUT; không xóa storage ngoài origin/context khảo sát. Tab mới đơn thuần không bảo đảm state sạch. Không dùng tài khoản cá nhân.
- **TD1:** id=1, iPhone 15 Pro Max, price=30000000, mô tả “Điện thoại cao cấp của Apple”, category_id=1 (Điện thoại).
- **TD2:** id=2, Samsung Galaxy S24 Ultra, price=28000000, category_id=1. **TD3:** id=3, MacBook Pro M3, price=45000000, category_id=2 (Laptop).
- **TD4:** id=4, Tai nghe AirPods Pro 2, price=6000000, category_id=3 (Phụ kiện). **TD5:** id=5, Bàn phím cơ Keychron Q1, price=4000000, category_id=3.
- Bộ dữ liệu được đối chiếu với database baseline ở chế độ read-only; trước execution phải xác nhận lại fixture. Đối chiếu [API §3](../../api_specification.md#3-sản-phẩm-products--danh-mục-categories) và bảng categories khi kiểm tra tên danh mục.
- Delay, chặn request/ảnh và đảo thứ tự response chỉ qua công cụ mạng trong browser hoặc lớp test bên ngoài SUT; phục hồi sau từng lượt, không sửa code để tạo hay che lỗi. DevTools request blocking dùng cho lỗi mạng, throttling chỉ giúp quan sát pending, không bảo đảm đảo thứ tự response. GUI-045 cần Playwright route interception hoặc công cụ tương đương giữ/thả từng request; phải xác minh khả năng này trước execution. Nếu không hỗ trợ, ghi blocker của điều kiện đó, không tự ghi Passed.
- Căn cứ khảo sát: source Home/ProductDetail/Header, database read-only và UI render thực tế ngày 05/11/2026. Đã quan sát Home và `/product/1` bằng Edge tại V-D/V-M, cùng trạng thái search `iPhone` (1 thẻ) và chuỗi không khớp (0 thẻ). Đã chụp ảnh khảo sát. Hai viewport trong cùng Edge không được tính là hai nền tảng.
- Backend khảo sát dùng server source không đổi với kết nối database hiện có ở chế độ READONLY; launcher riêng không tải module khởi tạo/seed. Đây chỉ là môi trường khảo sát các đường đọc, không dùng để kết luận các nghiệp vụ ghi dữ liệu. Không thay expected theo hành vi đang thấy; chưa thực thi toàn bộ checklist, các tình huống delay/chặn mạng/validation/keyboard vẫn là thiết kế cho T02.
- Đây là đặc tả thiết kế, **không có Actual/Passed/Failed**. Khi thực thi, mỗi biến thể dữ liệu và mỗi nền tảng có kết quả riêng; không gom một kết quả Passed cho nhiều lượt chưa chạy.

## 3. Checklist

### IA-01 — General UI standards

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-001 | H — danh sách ban đầu | API có 5 sản phẩm seed; không nhập tìm kiếm. | Mở /, đối chiếu số thẻ và tập ID với GET /api/products. | Lưới hiển thị đủ 5 sản phẩm, mỗi ID đúng một thẻ; không bỏ sót hoặc lặp. | R: FR-05 |
| GUI-002 | H — nội dung thẻ | Tập seed; viewport V-D. | Quan sát từng thẻ sản phẩm. | Mỗi thẻ có ảnh, tên và giá; các thành phần gắn cùng sản phẩm, không tráo giữa thẻ. | R: FR-05; L: S13 tr.12 |
| GUI-003 | H/D — giá trị giá | TD1 và TD2. | Đọc giá trên thẻ và chi tiết, đối chiếu price trong fixture. | Giá đúng số tiền dữ liệu của từng sản phẩm; không NaN/undefined và không lệch giữa hai màn hình. | R: FR-05/06 |
| GUI-004 | H/D — định dạng tiền | Tất cả giá trên hai màn hình. | Quan sát ký hiệu và cách nhóm chữ số. | Dùng ₫ và phân cách hàng nghìn nhất quán; không dùng VND thay ký hiệu quy định. Không áp đặt dấu chấm hay dấu phẩy khi spec chưa chốt locale. | R: FR-05/21 |
| GUI-005 | D — thông tin đầy đủ | TD1; category_id=1 → Điện thoại. | Mở chi tiết /product/1; đối chiếu từng trường. | Có ảnh lớn, tên iPhone 15 Pro Max, giá 30000000, mô tả Điện thoại cao cấp của Apple và danh mục Điện thoại. | R: FR-06; API §3 |
| GUI-006 | H/D — văn bản thay thế ảnh | Tất cả ảnh sản phẩm có trong seed. | Kiểm tra alt trong DOM/accessibility tree. | Mỗi ảnh có alt không rỗng, mô tả đúng sản phẩm; không dùng alt chung chung cho tất cả ảnh. | R: FR-05/24 |
| GUI-007 | H/D — tỷ lệ ảnh | Ảnh seed tải được; V-D và V-M. | Mở ảnh nguồn và so với thẻ/chi tiết; dùng khung ảnh seed có chữ tên thiết bị để đối chiếu. | Tỷ lệ nội dung ảnh không bị kéo méo (R); với ảnh seed, phần chữ nhận diện thiết bị trong ảnh không bị cắt mất bởi container (H). Không coi mọi crop là vi phạm nếu vẫn giữ nội dung cần nhận diện. | R: FR-05 (tỷ lệ); H: S13 tr.7/16 (crop) |
| GUI-008 | H/D — cấu trúc tiêu đề | Trang danh sách có dữ liệu và trang chi tiết. | Đếm h1 trong mỗi trang; đọc nội dung h1. | Đúng một h1/trang và mô tả nội dung chính; số lượng sản phẩm không tạo h1 thứ hai. | R: FR-05/21 |
| GUI-009 | H/D — ngôn ngữ | Dữ liệu và các nhãn/trạng thái trong phạm vi. | Đọc header, form, nút, nội dung trạng thái. | Nhãn/thông báo dùng tiếng Việt có dấu; tên thương hiệu và thuật ngữ kỹ thuật được giữ nguyên hợp lý. | R: FR-21 |
| GUI-010 | H/D — màu hành động tích cực | Nút Tìm và các nút Thêm vào giỏ hiện trên H/D. | So sánh màu nền các nút hành động tích cực. | Các nút hành động tích cực dùng xanh dương nhất quán theo spec; không coi màu của bản triển khai là chuẩn. | R: FR-21 |
| GUI-011 | H/D — bố cục desktop | Viewport V-D; dữ liệu seed. | So sánh cạnh trái các thẻ cùng cột, mép trên các thẻ cùng hàng; xem cụm search và khối ảnh/thông tin Detail. | Các thẻ cùng cột có mép trái thẳng hàng; thẻ cùng hàng có mép trên thẳng hàng. Cụm input/nút Tìm và khối ảnh/thông tin không chồng lên nhau; không che nhãn hoặc control. | H: S13 tr.7/16 |
| GUI-012 | H/D — bố cục hẹp | Viewport V-M, nội dung và control hiện trên hai màn hình. | Mở từng màn hình, cuộn dọc đến hết; kiểm tra mép ngang và tương quan heading với form tìm kiếm. | Không cần cuộn ngang toàn trang để đọc/thao tác; nút và form không ra ngoài viewport. Heading và form không ép nhau khiến tiêu đề bị bẻ thành cột từng từ; bố trí lại theo chiều dọc khi cần (tiêu chí H về layout/typography). | H: S13 tr.7/22 |
| GUI-013 | H — tên dài | TD2 và TD5, thử ở V-D/V-M. | Đọc tên trên thẻ; nếu bị rút gọn, dùng cách khám phá sẵn có hoặc mở chi tiết. | Người dùng xác định được tên đầy đủ qua phương tiện sẵn có; tên không che giá/nút. Không bắt buộc tooltip nếu đã có trang chi tiết. | H: S13 tr.7/16 |
| GUI-014 | H/D — dấu hiệu focus | Chỉ bàn phím, không rê chuột. | Tab lần lượt qua link, ô nhập và nút. | Control đang focus có chỉ báo nhìn thấy, phân biệt được với control chưa focus. | H: S13 tr.8/13/18 |
| GUI-015 | H/D — phóng to chữ | V-D, browser zoom 200% (mẫu khảo sát đề xuất). | Phóng to; đọc và tiếp cận form, giá, các nút; sau đó trả 100%. | Nội dung/control vẫn đọc và tiếp cận được, không chồng lấp khiến mất thao tác. Đây không phải tuyên bố đạt WCAG. | H: S13 tr.7/8/16 |

### IA-02 — Forms

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-016 | H — nhãn tìm kiếm | Trang Home; ô tìm kiếm rỗng. | Kiểm tra nhãn nhìn thấy và accessible name của ô tìm kiếm. | Có tên mô tả rõ mục đích; khi đã gõ, người dùng vẫn nhận biết được trường là tìm sản phẩm. Placeholder đơn độc không thay nhãn thường trực. | H: S13 tr.8/16 |
| GUI-017 | H — nhập và sửa từ khóa | TD1.name; chuỗi Bàn phím cơ. | Gõ, chọn một phần, thay thế, xóa và gõ tiếng Việt. | Ô hiển thị đúng chuỗi người dùng nhập, hỗ trợ chỉnh sửa bình thường, không mất ký tự tiếng Việt. | H: S13 tr.11/16 |
| GUI-018 | H — hai cách submit | Từ khóa iPhone; hai lượt bắt đầu từ cùng trạng thái không lọc. | Lần một nhập rồi bấm Tìm; lần hai tải lại, nhập cùng chuỗi và Enter. | Hai cách gửi cùng tiêu chí và cho cùng tập sản phẩm; không submit nhầm control. Đây là đề xuất về thao tác bàn phím, không phải quy định Enter trực tiếp trong FR-05. | H: S13 tr.18; FR-05 chỉ làm bối cảnh tìm kiếm |
| GUI-019 | H — tìm theo tên đầy đủ | iPhone 15 Pro Max; seed không đổi. | Nhập nguyên tên TD1 và gửi tìm kiếm. | Thẻ có id=1 xuất hiện; không có thẻ tên không khớp. | R: FR-05; API §3.1 |
| GUI-020 | H — tìm một phần tên | MacBook; seed có MacBook Pro M3. | Gửi tìm kiếm MacBook. | Hiển thị MacBook Pro M3 và không đưa sản phẩm tên không chứa MacBook. Tìm chuỗi con là tiêu chí đề xuất, không phải quy tắc match được spec mô tả chi tiết. | H: S13 tr.12; FR-05 làm bối cảnh |
| GUI-021 | H — bỏ bộ lọc bằng chuỗi rỗng | Đã tìm iPhone; API ban đầu có 5 ID. | Xóa toàn bộ từ khóa, gửi Tìm. | Khôi phục tập 5 sản phẩm ban đầu, không giữ ngầm bộ lọc iPhone. | H: S13 tr.12/14; FR-05 làm bối cảnh |
| GUI-022 | H — hiển thị từ khóa an toàn | Chuỗi vô hại `<b>GUI_T01</b>`; không dùng script. | Nhập chuỗi, gửi Tìm và quan sát nơi hiển thị từ khóa. | Nếu từ khóa được phản chiếu, hiển thị nguyên văn như text; không tạo phần tử b hoặc render HTML từ đầu vào. | R: FR-05; SEC-04 |
| GUI-023 | D — nhãn số lượng | TD1; ô Số lượng. | Đọc nhãn và kiểm tra liên kết label-control/accessibility tree. | Nhãn Số lượng nhận diện đúng ô nhập bằng thị giác lẫn accessible name; không bị nhầm với giá. | H: S13 tr.8/16 |
| GUI-024 | D — số lượng mặc định | Mở mới /product/1, chưa sửa số lượng. | Quan sát giá trị khởi đầu. | Giá trị khởi đầu là 1, hợp lệ với min=1; mặc định 1 là lựa chọn thiết kế đề xuất, spec chỉ bắt buộc min=1. | H: S13 tr.11; FR-06 làm ràng buộc |
| GUI-025 | D — ô nhập giữ số lượng hợp lệ | Giá trị 1 và 2; context sạch giữa các biến thể. | Nhập từng giá trị; rời ô rồi đọc lại giá trị/validity. Không suy ra nút hành động đã tiếp nhận đúng quantity. | Ô giữ đúng số nguyên dương đã nhập; không tự đổi 2 thành giá trị khác hoặc báo lỗi hợp lệ sai. Mục này chỉ kiểm tra ô nhập; feedback nút được xét ở GUI-048, không kiểm tra số lượng trong giỏ. | R: FR-06 (miền giá trị); H: hành vi ô nhập; L: S13 tr.19 |
| GUI-026 | D — lớp số lượng không hợp lệ | Lần lượt 0, -1, 1.5, rỗng và abc; mỗi biến thể có context sạch. | Nhập/dán, rời ô, kích hoạt nút và quan sát cơ chế từ chối cụ thể: chặn nhập, thông báo validation hoặc invalid event thực sự chặn hành động. Ghi riêng từng biến thể. | Không tiếp nhận giá trị ngoài số nguyên dương, không silently đổi 1.5 thành 1 hoặc gửi NaN. Không phản ứng sau một lần click và DOM validity đơn thuần không chứng minh validation hoạt động. Nếu lỗi control GUI-048 che khuất đường validation và không xác định được cơ chế từ chối, ghi chưa kết luận/blocker, không Passed. | R: FR-06; L: S13 tr.11/19 |
| GUI-027 | D — vị trí lỗi nhập liệu | Trạng thái số lượng không hợp lệ; quan sát khi kích hoạt hành động. | Kiểm tra vị trí thông báo lỗi so với nút Thêm vào giỏ hàng. | Thông báo lỗi nhập liệu nằm trên nút hành động tương ứng theo FR-22; không bị giấu dưới nút/ngoài vùng nhìn. | R: FR-22; L: S13 tr.16/18 |

| GUI-049 | D — ký hiệu trường bắt buộc | TD1; quantity phải có giá trị nguyên dương theo FR-06. | Quan sát nhãn Số lượng khi ô rỗng và khi có giá trị. | Có dấu `*` cạnh nhãn trường bắt buộc theo FR-22, không chỉ báo bằng placeholder. Search không bắt buộc vì cho phép tìm rỗng. | R: FR-06/22 |

### IA-03 — Navigation

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-028 | H → D — đúng đích chi tiết | TD1 và TD2 có thẻ riêng. | Bấm Xem chi tiết của từng thẻ, quay lại giữa hai lượt. | URL /product/{id} và tên trên trang chi tiết đúng sản phẩm vừa chọn; không mở nhầm sản phẩm. | R: FR-06; L: S13 tr.18 |
| GUI-029 | D → H — đường về trang chủ | Đang ở /product/1. | Bấm logo/link EShop trên header. | Đến trang chủ / và có thể tiếp tục chọn sản phẩm; không bị chuyển login. | H: S13 tr.17/18 |
| GUI-030 | D — breadcrumb | Trang /product/1. | Đọc breadcrumb, thử phần tử tổ tiên dẫn về Home. | Có breadcrumb phản ánh đúng trang chi tiết; tổ tiên đưa về Home, nhãn cuối nhận diện sản phẩm hiện tại. | R: FR-23; L: S13 tr.17 |
| GUI-031 | H/D — kích hoạt control bằng bàn phím | Context sạch; focus lần lượt logo, Xem chi tiết, nút Tìm và Thêm vào giỏ; quantity hợp lệ. | Link: Enter. Button: thử Enter và Space trong các lượt độc lập; đối chiếu cùng control khi click. | Link đến đúng đích; button kích hoạt cùng hành động như click mà không cần chuột. Với Thêm vào giỏ chỉ quan sát feedback tại H/D, không mở trang giỏ. Nếu click cũng không hoạt động, tách lỗi control khỏi lỗi keyboard. | H: S13 tr.8/18 |
| GUI-032 | H/D — thứ tự Tab | Bắt đầu từ đầu trang, V-D/V-M. | Tab qua header, form/thẻ ở Home và ô số lượng/nút ở Detail. | Thứ tự focus từ trên xuống dưới, trái sang phải theo thứ tự hiển thị; không nhảy tới phần tử bị ẩn. | R: FR-21; L: S13 tr.18 |
| GUI-033 | H/D — di chuyển ngược, thoát focus | Đã focus ô tìm kiếm hoặc số lượng. | Dùng Shift+Tab và Tab qua toàn bộ vùng thao tác. | Đi ngược theo trật tự hợp lý; có thể rời mọi ô/vùng bằng bàn phím, không mắc kẹt. | H: S13 tr.13/18 |
| GUI-034 | D — URL trực tiếp và refresh | URL /product/1, server đang hoạt động. | Dán URL vào tab mới; sau khi tải, refresh. | Cả hai lần mở đúng chi tiết, không phụ thuộc đã đi qua Home hay phát sinh trang trắng. | H: S13 tr.18/24 |
| GUI-035 | H ↔ D — Back/Forward | Từ Home mở TD1; không thao tác giỏ hàng. | Dùng browser Back, rồi Forward. | Trở về đúng Home rồi đúng chi tiết TD1, không vòng lặp hoặc đổi sản phẩm. Chưa áp đặt việc giữ từ khóa/scroll vì spec chưa chốt. | H: S13 tr.17/18 |
| GUI-036 | H/D — navbar đang chọn | Liệt kê mục navbar và route nó ánh xạ; mở Home rồi Detail. | Xác định mục ánh xạ route hiện hành và quan sát dấu hiệu selected/highlight. | Mục navbar ánh xạ trang hiện hành được highlight, không chọn sai trang (R). Nếu Detail không có mục ánh xạ, ghi trường hợp này là điểm applicability cần làm rõ; không dùng breadcrumb để chấm navbar đạt. Breadcrumb có kiểm tra riêng GUI-030. | R: FR-23; applicability của Detail chưa được SRS mô tả rõ |

| GUI-050 | H/D — badge số lượng trên link Giỏ hàng | Context riêng có đúng một sản phẩm quantity=1, chuẩn bị bằng control Home; xác nhận thao tác thêm đã tiếp nhận. Không mở trang giỏ hàng. | Quan sát link Giỏ hàng trên header Home rồi Detail sau khi state local được giữ qua điều hướng. | Link Giỏ hàng hiển thị badge số lượng 1 đúng state trên cả hai màn hình, không chỉ có toast tại nút. Nếu không tạo/xác nhận được state vì lỗi control, ghi blocker thay vì suy ra badge đạt. Cách hiện badge khi giỏ rỗng chưa được quy định chi tiết. | R: FR-23; L: S13 tr.14 |

### IA-04 — Feedback / state

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-037 | H — tải danh sách lần đầu | DevTools delay GET /api/products khoảng 2 giây, không sửa source. | Mở Home trên tab mới và quan sát khi request đang pending. | Có chỉ báo đang tải trong thời gian pending; không biểu diễn tạm thời như không có sản phẩm. 2 giây chỉ để làm trạng thái quan sát được. | R: FR-05 |
| GUI-038 | H — tải kết quả tìm kiếm | Đã có lưới; delay request tìm iPhone khoảng 2 giây. | Gửi tìm kiếm, quan sát trước và sau response. | Có trạng thái loading khi pending; khi xong thay bằng kết quả, không còn chỉ báo tải treo. | R: FR-05; L: S13 tr.13/14 |
| GUI-039 | D — tải chi tiết | Delay GET /api/products/1 khoảng 2 giây. | Mở chi tiết và quan sát chuyển trạng thái. | Nhận biết được đang tải rồi nội dung TD1; không hiển thị dữ liệu sản phẩm khác như kết quả cuối. | H: S13 tr.13/14 |
| GUI-040 | H — kết quả rỗng | Từ khóa zzzz_T01_no_match_23120410; fixture không có tên tương ứng. | Gửi tìm kiếm sau khi đang có kết quả. | Có message thân thiện và icon/hình minh họa; không để lưới trắng hoặc giữ thẻ cũ như kết quả hiện tại. | R: FR-05/24 |
| GUI-041 | H — lỗi lấy danh sách/tìm kiếm | DevTools chặn GET http://localhost:3000/api/products*; runtime riêng, không chặn document frontend. | Biến thể A: mở Home sạch khi request bị chặn. Biến thể B: có kết quả ban đầu, bật chặn rồi gửi iPhone. Ghi hai lượt riêng; xóa rule sau mỗi lượt. | Cả A và B có thông báo lỗi dễ hiểu, không gọi lỗi mạng là không có kết quả; không hiển thị stack trace/SQL. Một lượt không đại diện cho cả hai biến thể. | H: S13 tr.11/16/27 |
| GUI-042 | D — sản phẩm không tồn tại | ID 999999; xác nhận vắng trong fixture trước lượt chạy. | Mở /product/999999. | Có trạng thái không tìm thấy rõ ràng, không loading vô hạn hoặc trang trắng. | H: S13 tr.11/14/24 |
| GUI-043 | D — lỗi tải chi tiết | Chặn riêng GET /api/products/1 bằng DevTools. | Mở /product/1. | Thông báo lỗi tải khác trạng thái không tìm thấy; không để Đang tải vô hạn sau request thất bại. | H: S13 tr.11/16/27 |
| GUI-044 | H/D — phục hồi sau lỗi | Đã tạo lỗi mạng trong một lượt trước; ghi màn hình/URL đó. | Bỏ chặn request rồi dùng reload hoặc cách thử lại sẵn có. | Có thể lấy lại dữ liệu và dùng màn hình; lỗi cũ không che nội dung thành công. Không bắt buộc phải có nút Retry mới. | H: S13 tr.11/14 |
| GUI-045 | H — phản hồi tìm kiếm mới nhất | Playwright page.route hoặc công cụ giữ/thả request tương đương đã được xác minh; match chính xác GET http://localhost:3000/api/products?search=iPhone và ?search=MacBook, không sửa source. | Giữ request iPhone; gửi MacBook và đợi response MacBook hoàn tất; sau đó thả iPhone. Ghi thứ tự hoàn tất; bỏ route interception và reset context sau lượt. | Sau khi cả hai xong, kết quả/nhãn cuối ứng với MacBook, response iPhone cũ không ghi đè. Throttling chung không đủ chứng minh điều kiện này; nếu không giữ/thả được từng request thì chưa thực thi. | H: S13 tr.12/14/20 |
| GUI-046 | H — từ khóa đã áp dụng | Đã gửi iPhone và có kết quả; tiếp tục gõ MacBook nhưng chưa gửi. | So sánh nhãn kết quả với tiêu chí đã submit. | Nếu có nhãn Kết quả tìm kiếm cho, nó phản ánh iPhone cho đến lần submit tiếp theo; không gán kết quả cũ cho chuỗi đang soạn. | H: S13 tr.12/14 |
| GUI-047 | H/D — ảnh không tải được | Chặn URL ảnh của riêng TD1, không chặn API. | Mở Home/Detail và quan sát ảnh TD1. | Tên, giá và đích chi tiết vẫn dùng được; ảnh hỏng có alt/fallback nhận diện, không khiến cả màn hình trắng. | R: FR-24 (alt); H: S13 tr.7/11 |
| GUI-048 | H/D — phản hồi control Thêm vào giỏ | Context riêng cho từng màn hình; xác nhận giỏ/state local sạch; quantity=1 ở Detail. Chỉ kiểm tra control trên H/D. | Bấm đúng một lần Thêm vào giỏ ở Home; ở lượt khác làm tương tự trên Detail. Ghi riêng mỗi màn hình. | Có phản hồi trực quan sau lần bấm đầu (toast, trạng thái nút hoặc badge cập nhật). Không cần mở Giỏ hàng/checkout; không suy từ lỗi này rằng validation quantity đã chặn đúng. | R: FR-06/24 |
| GUI-051 | H — phục hồi sau tìm kiếm không có kết quả | Home đang hiển thị danh sách sản phẩm; fixture không có tên khớp `zzzz_no_match` và có TD1 iPhone 15 Pro Max. | Tìm `zzzz_no_match` và xác nhận đã nhận kết quả rỗng; sau đó tìm lại `iPhone` trong cùng trang/context, không reload. | Thông báo không có kết quả biến mất; sản phẩm iPhone xuất hiện bình thường mà không cần tải lại trang. | H: S13 tr.12/14 (chuyển trạng thái/phục hồi); FR-05 làm bối cảnh tìm kiếm |
| GUI-052 | H — xử lý API trả HTTP 500 | Context sạch; công cụ interception bên ngoài SUT đã được xác minh có thể trả response HTTP 500 cho GET http://localhost:3000/api/products. Không sửa source/database và không abort request. | Bật giả lập HTTP 500 trước khi mở Home; mở Home, xác nhận request lấy danh sách nhận response 500 rồi quan sát UI. Bỏ interception sau lượt chạy. | Hiển thị thông báo lỗi tải dữ liệu; không hiển thị danh sách rỗng như thể không có sản phẩm hoặc loading vô hạn. | H: S13 tr.11/16/27 (thông báo lỗi); FR-05 làm bối cảnh tải danh sách |

## 4. Ma trận độ phủ thiết kế

| Nhóm | Số mục | ID |
|---|---:|---|
| IA-01 | 15 | GUI-001–GUI-015 |
| IA-02 | 13 | GUI-016–GUI-027, GUI-049 |
| IA-03 | 10 | GUI-028–GUI-036, GUI-050 |
| IA-04 | 14 | GUI-037–GUI-048, GUI-051–GUI-052 |
| **Tổng** | **52** | GUI-001–GUI-052 |

Các biến thể cùng quy tắc được nhóm trong một mục (ví dụ GUI-026), không nhân số dòng để đạt ngưỡng. Nhiều trang trong cùng dòng là tham số áp dụng, không phải bằng chứng đã thực thi.

## 5. Lý do bổ sung GUI-049 và GUI-050

Sinh viên đã xác nhận đọc và kiểm tra checklist v0.3, đồng thời đề nghị giữ GUI-049 và GUI-050 ngày 07/11/2026. Nguồn phát hiện ban đầu của hai mục vẫn là AI; việc sinh viên review và lựa chọn giữ lại được phân biệt với việc tự phát hiện mục mới. Các lý do dưới đây do AI hỗ trợ diễn đạt từ spec và khoảng trống độ phủ của bản đầu.

| ID | Lý do bổ sung / giữ lại | Khoảng trống trong bản AI đầu | Nguồn phát hiện ban đầu |
|---|---|---|---|
| GUI-049 | FR-06 quy định Số lượng phải là số nguyên dương, tối thiểu 1; kết hợp FR-22 về dấu `*` cạnh nhãn trường bắt buộc, cần kiểm tra người dùng nhận biết yêu cầu nhập ngay trên giao diện. Đây là kiểm tra ký hiệu bắt buộc, khác với việc ô có nhãn hoặc từ chối dữ liệu sai. | Bản đầu có kiểm tra nhãn, miền giá trị và vị trí lỗi (GUI-023/026/027), nhưng chưa có mục đối chiếu trực tiếp ký hiệu `*` theo FR-22. Không thể suy từ validation đúng rằng ký hiệu bắt buộc đã hiện đúng. | AI worker reviewer đề xuất; main AI tích hợp. |
| GUI-050 | FR-23 yêu cầu link Giỏ hàng có badge số lượng. Cần kiểm tra badge phản ánh state đã xác nhận trên header Home và Detail, không cần mở trang giỏ hoặc checkout. | GUI-048 chấp nhận phản hồi bằng toast hoặc badge theo FR-06/24; vì vậy toast có thể làm mục đó đạt nhưng vẫn chưa kiểm tra nghĩa vụ badge riêng của FR-23. Bản đầu chưa tách yêu cầu này thành một mục độc lập. | Main AI phát hiện khi tự đối chiếu lại yêu cầu. |

## 6. Hai mục sinh viên đề xuất sau review — GUI-051 và GUI-052

Nguồn bổ sung: sinh viên gửi hai mục cùng điều kiện/thao tác, expected và lý do AI bỏ sót trong yêu cầu ngày 07/11/2026. AI gán ID, chuẩn hóa vào bảng checklist và làm rõ cách tạo điều kiện test; không ghi hai mục này thành đề xuất do AI tự phát hiện. Đây là bổ sung thiết kế, chưa có kết quả thực thi.

| ID | Vì sao AI bỏ sót — nội dung sinh viên cung cấp | Phân biệt với mục đã có |
|---|---|---|
| GUI-051 | AI đã kiểm tra trạng thái không có kết quả (GUI-040), nhưng chỉ xét trạng thái đó tại một thời điểm, chưa kiểm tra quá trình chuyển từ kết quả rỗng trở lại có dữ liệu. | GUI-040 kiểm tra empty state; GUI-051 kiểm tra chuyển từ empty state sang kết quả iPhone mà không reload. GUI-021 bỏ bộ lọc bằng chuỗi rỗng, không phải tìm lại bằng từ khóa có dữ liệu. |
| GUI-052 | AI tập trung vào lỗi mất kết nối mạng (GUI-041), nhưng chưa xét trường hợp server vẫn phản hồi với mã lỗi HTTP 500. Hai tình huống có cơ chế khác nhau. | GUI-041 chặn request để tạo lỗi mạng; GUI-052 nhận response HTTP 500 thực sự trong môi trường giả lập, không dùng abort request thay thế. |
