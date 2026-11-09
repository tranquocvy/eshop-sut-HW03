# HW03 — Prompt Log trích tuyển theo artifact
**Phạm vi:** bản trích tuyển gồm **8 tương tác** P-000, P-002, P-004, P-005, P-006, P-007, P-008 và P-009, bao gồm phần chuẩn bị/thiết kế (A-00–A-02), skill/harness GUI (A-03), khả thi portal và review câu hỏi (A-06/A-07); sổ đối chiếu cuối file ghi thêm bằng chứng A-04–A-07. Không phải toàn bộ lịch sử AI HW03 theo §9. Các lượt vận hành, ôn tập và AI-to-AI review không được chép toàn văn; đóng góp AI review/sửa đổi vẫn được khai. P-000/P-005 có phần cuối nguồn bị cắt; P-004/P-006/P-007 có giới hạn nguồn ghi tại từng mục.


## P-000 — A-01: Đọc đề và cơ sở lập kế hoạch

- Timestamp prompt: 2026-11-04 12:34:01 (UTC+07:00)
- Công cụ: OpenClaw (OpenAI)
- Model: gpt-6.1-sol

### Prompt nguyên văn

```text
session này focus vào các HW của môn software testing, môn này có yêu cầu ailog và các file ai audit. vì thế cần đọc lại các template ở hw01 và hw02 (session này bắt đầu từ hw03 trở đi). Các file này đã được điền thông tin và hoàn thiện để nộp, nên không còn giữ được template gốc, bạn hãy đọc đề và kiểm tra lại cần template nào tôi sẽ gửi bản gốc. Trước mắt ở đoạn chat này hãy đọc hw03 và tóm tắt yêu cầu trước, chưa implement
```

### Output gốc — phần truy xuất được

- Timestamp phản hồi: 2026-11-04 12:37:11 (UTC+07:00)
- Phản hồi này là bản tóm tắt đề, chưa tạo file PLAN. Nguồn lịch sử bị cắt ở cuối ngay cả khi truy xuất riêng thông điệp; giữ nguyên phần lấy được và dấu cắt, không phục dựng phần thiếu.

````text
Mình đã đọc đề gốc **`HW03/2026.HW03.GUI Usability_En.pdf`**, đối chiếu các biểu mẫu và cách ghi log ở HW01–02. **Chưa sửa file, chạy kiểm thử hay implement.**

## 1. HW03 yêu cầu gì?

Bài **cá nhân**, thời lượng dự kiến **10 giờ**, kiểm thử **GUI và usability của EShop**. Deadline xem trên Moodle.

Khác HW02, **không phải chọn một tính năng ở mỗi pool**. Bạn chọn:
- Một hoặc nhiều màn hình để lập GUI checklist.
- Một luồng end-to-end để đánh giá usability.
- **Màn hình chính và luồng usability không được trùng với thành viên cùng nhóm.**

| Hạng mục | Yêu cầu chính | Điểm |
|---|---|---:|
| **Task 1 — GUI Checklist** | Thiết kế, thực thi checklist và báo lỗi | 30 |
| **Task 2 — Usability Evaluation** | Kịch bản, 7 phiên với người thật, phân tích | 40 |
| **Task 3 — Cross-platform** | Thực hiện Task 1 trên ít nhất 3 nền tảng | 20 |
| **Agent Skills** | Skill tái sử dụng và video demo | 10 |
| **Tổng** | | **100** |

### Task 1 — GUI Checklist
- **Hơn 40 mục**, tức tối thiểu **41**, phủ đủ:
  - IA-01: General UI standards.
  - IA-02: Forms.
  - IA-03: Navigation.
  - IA-04: Feedback/state.
- AI tạo bản đầu; sinh viên review, bổ sung mục AI bỏ sót và **giải thích nguyên nhân bỏ sót**.
- Thực thi từng mục, ghi **Passed/Failed**.
- Có cột **Notes**, giải thích từng mục Failed; chụp ảnh các mục Failed.
- Báo mọi bug trong **Markdown và GitHub Issues**, mỗi issue có ảnh.
- Được phép chỉ chọn một màn hình, nhưng đề khuyến khích nhiều màn hình để tránh checklist lặp hoặc thiếu chiều sâu.

### Task 2 — Usability với 7 người thật
**Chuẩn bị:**
- Xác định mục tiêu và đối tượng người dùng.
- Viết scenario theo **mục tiêu cần đạt**, không hướng dẫn từng bước.
- Chuẩn bị **SUS hoặc UEQ-S**; dùng thang tự thiết kế phải giải thích rõ.
- Có câu hỏi mở về tối thiểu: **clarity, error recovery, speed, trust**.
- Tuyển **7 người ngoài lớp**, không phải sinh viên đang làm HW03; ưu tiên người không chuyên IT/testing.
- Có liên hệ kiểm chứng được, che thông tin theo yêu cầu đề.
- Chạy **pilot với một người**, điều chỉnh trước các phiên chính.

**Thực hiện và phân tích:**
- Mỗi người một phiên có điều phối; khuyến khích think-aloud, không gợi ý dẫn dắt.
- Ghi chú có cấu trúc; quay màn hình và ghi âm khi có sự đồng ý.
- Thu thang điểm và câu trả lời sau phiên.
- Tính điểm, nhóm pain points, phân biệt bug riêng lẻ với vấn đề thiết kế hệ thống, xếp severity.
- Bug thật phải có Markdown + GitHub Issue + ảnh.

**TA có thể gọi ngẫu nhiên 2 người; giả mạo khiến Task 2 bị 0 điểm.**

### Task 3 — Ít nhất 3 nền tảng
- Chạy **checklist Task 1**, không chỉ chụp vài ảnh giao diện.
- Phủ **Chrome, Firefox, Safari hoặc Android Chrome**.
- **Expo Go trên điện thoại thật được tính một nền tảng**, có thể thay một nền tảng browser.
- Ưu tiên BrowserStack/LambdaTest trial; đề cho phép phương án cloud khác hoặc thiết bị thật theo điều kiện nêu trong đề.
- Ảnh phải thể hiện môi trường browser/OS/device và URL localhost theo yêu cầu.

**Có điểm chưa nhất quán về định danh trong ảnh:**
- §6 yêu cầu overlay **email sinh viên**.
- §11 yêu cầu **MSSV và họ tên trong form**.

Nên đáp ứng cả hai khi chuẩn bị evidence; chưa nên tự bỏ một yêu cầu.

## 2. AI log và AI audit

HW03 yêu cầu **AI-first theo từng bước kỹ thuật**, không chỉ một prompt chung chung; mọi đầu ra phải qua human review.

Cần phân biệt:

| Tài liệu | Nội dung |
|---|---|
| **AI/Prompt Log** | **Mỗi tương tác**: công cụ, ngày giờ, prompt và output |
| **AI Audit Report** | Đánh giá các artifact AI tạo và phần đã chỉnh sửa |
| **AI Critique** | **200–300 từ**: AI sai/thiếu/thiên lệch ở đâu, nguyên nhân và bài học |
| **Disclosure** | Khai báo công cụ, phạm vi đóng góp và cách xác minh |

Mẫu **AI-02** đã đọc quy định audit **5 phần/artifact**: prompt + tool → output nguyên văn → VALID/INVALID/INCOMPLETE → lý do có căn cứ → bản sửa được làm nổi bật; cuối báo cáo có thống kê verdict và kết luận.

**Không được tự dựng người tham gia, phản hồi khảo sát, kết quả thực thi hay ảnh cross-platform.** Việc sinh viên đã revi
…(truncated)…
````

### Artifact hiện hành và lý do chỉnh sửa

- **v0.1 → v0.2 (AI kiểm tra và sửa):** bổ sung nguồn chính sách AI-05/AI-06 từ HW01; làm rõ việc master đối chiếu đề gốc và giới hạn worker không đọc được PDF; làm rõ vai trò AI review. Các lỗi Mandatory Disclosure/checkbox được sửa trong biểu mẫu đi kèm, không phải thay đổi phạm vi plan.
- **v0.2 → v0.3 (AI sửa theo góp ý sinh viên):** rút gọn cấu trúc kế hoạch, giữ các mục phạm vi, nguồn, trình tự T00–T07, điều kiện thực thi và hồ sơ nộp.
- **Giữ nguyên nội dung cốt lõi:** màn hình chính FR-05, Product Detail FR-06 bổ trợ, luồng kết thúc ở lựa chọn sản phẩm và trình tự T00–T07. Không đổi sang checkout, không sửa SUT hoặc tạo kết quả testing.

## P-002 — A-00: Lựa chọn phạm vi

- Timestamp prompt: 2026-11-04 13:05:55 (UTC+07:00)
- Công cụ: OpenClaw (OpenAI)
- Model: gpt-6.1-sol

### Prompt nguyên văn

```text
bước 1 hãy chọn "Màn hình chính và luồng usability không được trùng với thành viên cùng nhóm". mình là ngời đầu tiên chọn nên hãy chọn cái dễ nhất. chưa impelement ở bước này
```

### Output nguyên văn

- Timestamp phản hồi: 2026-11-04 13:06:51 (UTC+07:00)

```text
Mình chọn cho bạn **Home / Danh sách & tìm kiếm sản phẩm** làm màn hình chính, và **luồng tìm sản phẩm phù hợp → xem chi tiết → quyết định lựa chọn** cho usability.

### Phạm vi chốt
- **Màn hình chính:** Home — Product Listing & Search (**FR-05**).
- **Màn hình bổ trợ:** Product Detail (**FR-06**), cùng header/navigation.
- **Luồng usability:** Từ trang chủ, tìm sản phẩm theo nhu cầu, xem thông tin chi tiết và chọn sản phẩm đáp ứng tiêu chí. **Kết thúc ở việc lựa chọn**, không bắt buộc thêm giỏ hoặc thanh toán.

### Vì sao chọn phương án này?
- **Ít phụ thuộc:** không cần đăng ký, đăng nhập, OTP, coupon hay tạo đơn.
- **Dễ mời người dùng:** người không chuyên IT cũng hiểu nhiệm vụ tìm mua một sản phẩm.
- **Dễ lặp lại 7 phiên:** chủ yếu đọc dữ liệu, không phải reset tài khoản/đơn hàng sau mỗi người.
- **Đủ chất liệu cho checklist:** bố cục, hình ảnh, giá, form tìm kiếm, bàn phím/focus, navigation, loading/empty state và thông tin chi tiết.
- Tránh phần thêm giỏ ở trang chi tiết: **source hiện có xử lý bỏ qua lần bấm đầu**, có thể gây gián đoạn không cần thiết. Đây mới là nhận xét từ code, chưa phải bug đã chạy xác minh.

**Đây là lựa chọn nhẹ nhất mình khuyến nghị mà vẫn có một mục tiêu end-to-end rõ ràng**, không chỉ kiểm tra một thao tác đơn lẻ. Tên sản phẩm và tiêu chí cụ thể sẽ chọn sau khi kiểm tra dữ liệu SUT.

Bạn có thể gửi nhóm để giữ chỗ:

> HW03 mình chọn màn hình chính **Home / Danh sách & tìm kiếm sản phẩm (FR-05)**. Luồng usability: **tìm sản phẩm theo nhu cầu → xem chi tiết → lựa chọn sản phẩm phù hợp**, không gồm giỏ hàng/checkout. Màn hình chi tiết sản phẩm là màn hình bổ trợ.

**Chưa implement, chưa chạy test hay sửa file.**
```

## P-004 — A-02: Tạo GUI checklist

- Timestamp prompt: 2026-11-05 20:54:48 (UTC+07:00)
- Công cụ: OpenClaw (OpenAI)
- Model: gpt-6.1-sol

### Prompt nguyên văn

```text
hãy thực hiện T01 theo plan, tôi đã đính kèm "S13_GUI Testing & Usability Testing.pdf" ở root của src code
```

### Output gốc — phần truy xuất được

- Timestamp phản hồi: 2026-11-05 21:11:42 (UTC+07:00)
- API lịch sử vẫn báo `contentTruncated=true` khi truy xuất riêng thông điệp. Dưới đây giữ nguyên trường text lấy được; không khẳng định đã khôi phục toàn bộ phản hồi, không dựng phần thiếu.

````text
Đã tạo **bản thiết kế T01 v0.2 — 50 mục**, tại:

`hw03/gui/GUI_Checklist.md`

- Phủ đủ IA-01–04: **15 / 13 / 10 / 12 mục**.
- Đã đọc slide 55 trang, đối chiếu spec/source/database và xử lý review AI độc lập.
- Giữ nguyên **bản AI đầu 48 mục**. Hai mục thêm sau là đóng góp AI, không tính là bạn tự bổ sung.
- PLAN đã cập nhật đúng tiến độ.

**Bạn cần review:** các tiêu chí **H** (heuristic đề xuất), tính rõ ràng/khả thi của từng mục, rồi bổ sung phần AI còn bỏ sót và giải thích nguyên nhân.

**T01 chưa hoàn tất:** browser policy chặn navigation local nên chưa khảo sát UI render. Cần Owner kiểm tra ngoại lệ hostname tại `browser.ssrfPolicy.allowedHostnames`; mình chưa tự thay policy.

**Chưa xuất Excel, chạy T02, sửa hồ sơ AI/PromptLog hoặc stage/commit/push.**
````

### A-02-initial

Bản artifact AI đầu v0.1, **48 mục**, giữ nguyên nội dung file đã bảo toàn. Các đường dẫn bên trong khối nguyên văn theo vị trí gốc `hw03/gui/GUI_Checklist.md`, không theo vị trí PromptLog. Phản hồi P-004 ở trên báo bản v0.2 sau AI review; bản đầu được lưu riêng trước khi sửa.

`````markdown
# HW03 — Thiết kế GUI checklist

**Phiên bản:** v0.1 — bản AI đầu, 05/11/2026.

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
- **D (viewport):** 1440×900 CSS px; **M:** 390×844 CSS px. Trong cột màn hình, H/D là tên trang, không phải viewport. Đây là mẫu kiểm tra đề xuất, không đại diện cho việc đã chạy ≥3 nền tảng.
- Người dùng ẩn danh; tab/browser context mới cho lượt cần state sạch. Không dùng tài khoản cá nhân.
- **TD1:** id=1, iPhone 15 Pro Max, price=30000000, mô tả “Điện thoại cao cấp của Apple”, category_id=1 (Điện thoại).
- **TD2:** id=2, Samsung Galaxy S24 Ultra, price=28000000, category_id=1. **TD3:** id=3, MacBook Pro M3, price=45000000, category_id=2 (Laptop).
- **TD4:** id=4, Tai nghe AirPods Pro 2, price=6000000, category_id=3 (Phụ kiện). **TD5:** id=5, Bàn phím cơ Keychron Q1, price=4000000, category_id=3.
- Bộ dữ liệu được đối chiếu với database baseline ở chế độ read-only; trước execution phải xác nhận lại fixture. Đối chiếu [API §3](../../api_specification.md#3-sản-phẩm-products--danh-mục-categories) và bảng categories khi kiểm tra tên danh mục.
- Delay, chặn request/ảnh và đảo thứ tự response chỉ qua công cụ mạng trong browser hoặc lớp test bên ngoài SUT; phục hồi sau từng lượt, không sửa code để tạo hay che lỗi. Nếu công cụ không hỗ trợ, ghi blocker của điều kiện đó, không tự ghi Passed.
- Đây là đặc tả thiết kế, **không có Actual/Passed/Failed**. Khi thực thi, mỗi biến thể dữ liệu và mỗi nền tảng có kết quả riêng; không gom một kết quả Passed cho nhiều lượt chưa chạy.

## 3. Checklist

### IA-01 — General UI standards

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-001 | H — danh sách ban đầu | API có 5 sản phẩm seed; không nhập tìm kiếm. | Mở /, đối chiếu số thẻ và tập ID với GET /api/products. | Lưới hiển thị đủ 5 sản phẩm, mỗi ID đúng một thẻ; không bỏ sót hoặc lặp. | R: FR-05 |
| GUI-002 | H — nội dung thẻ | Tập seed; viewport D. | Quan sát từng thẻ sản phẩm. | Mỗi thẻ có ảnh, tên và giá; các thành phần gắn cùng sản phẩm, không tráo giữa thẻ. | R: FR-05; L: S13 tr.12 |
| GUI-003 | H/D — giá trị giá | TD1 và TD2. | Đọc giá trên thẻ và chi tiết, đối chiếu price trong fixture. | Giá đúng số tiền dữ liệu của từng sản phẩm; không NaN/undefined và không lệch giữa hai màn hình. | R: FR-05/06 |
| GUI-004 | H/D — định dạng tiền | Tất cả giá trên hai màn hình. | Quan sát ký hiệu và cách nhóm chữ số. | Dùng ₫ và phân cách hàng nghìn nhất quán; không dùng VND thay ký hiệu quy định. Không áp đặt dấu chấm hay dấu phẩy khi spec chưa chốt locale. | R: FR-05/21 |
| GUI-005 | D — thông tin đầy đủ | TD1; category_id=1 → Điện thoại. | Mở chi tiết /product/1; đối chiếu từng trường. | Có ảnh lớn, tên iPhone 15 Pro Max, giá 30000000, mô tả Điện thoại cao cấp của Apple và danh mục Điện thoại. | R: FR-06; API §3 |
| GUI-006 | H/D — văn bản thay thế ảnh | Tất cả ảnh sản phẩm có trong seed. | Kiểm tra alt trong DOM/accessibility tree. | Mỗi ảnh có alt không rỗng, mô tả đúng sản phẩm; không dùng alt chung chung cho tất cả ảnh. | R: FR-05/24 |
| GUI-007 | H/D — tỷ lệ ảnh | Ảnh tải được; D và M. | So sánh hình trong thẻ/chi tiết với ảnh nguồn. | Không kéo méo tỷ lệ; phần ảnh cần nhận diện sản phẩm không bị cắt mất do container. | R: FR-05; H: S13 tr.7/16 |
| GUI-008 | H/D — cấu trúc tiêu đề | Trang danh sách có dữ liệu và trang chi tiết. | Đếm h1 trong mỗi trang; đọc nội dung h1. | Đúng một h1/trang và mô tả nội dung chính; số lượng sản phẩm không tạo h1 thứ hai. | R: FR-05/21 |
| GUI-009 | H/D — ngôn ngữ | Dữ liệu và các nhãn/trạng thái trong phạm vi. | Đọc header, form, nút, nội dung trạng thái. | Nhãn/thông báo dùng tiếng Việt có dấu; tên thương hiệu và thuật ngữ kỹ thuật được giữ nguyên hợp lý. | R: FR-21 |
| GUI-010 | H/D — màu hành động tích cực | Nút Tìm và các nút Thêm vào giỏ hiện trên H/D. | So sánh màu nền các nút hành động tích cực. | Các nút hành động tích cực dùng xanh dương nhất quán theo spec; không coi màu của bản triển khai là chuẩn. | R: FR-21 |
| GUI-011 | H/D — bố cục desktop | Viewport D; dữ liệu seed. | Quan sát header, cụm tìm kiếm, thẻ, vùng chi tiết và footer. | Nhãn, ảnh và nút không đè nhau; lưới và khối chi tiết căn thẳng, không che control. | H: S13 tr.7/16 |
| GUI-012 | H/D — bố cục hẹp | Viewport M, nội dung và control hiện trên hai màn hình. | Mở từng màn hình, cuộn dọc đến hết và kiểm tra mép ngang. | Không cần cuộn ngang toàn trang để đọc nội dung/thao tác; nút và form không ra ngoài viewport. | H: S13 tr.7/22 |
| GUI-013 | H — tên dài | TD2 và TD5, thử ở D/M. | Đọc tên trên thẻ; nếu bị rút gọn, dùng cách khám phá sẵn có hoặc mở chi tiết. | Người dùng xác định được tên đầy đủ qua phương tiện sẵn có; tên không che giá/nút. Không bắt buộc tooltip nếu đã có trang chi tiết. | H: S13 tr.7/16 |
| GUI-014 | H/D — dấu hiệu focus | Chỉ bàn phím, không rê chuột. | Tab lần lượt qua link, ô nhập và nút. | Control đang focus có chỉ báo nhìn thấy, phân biệt được với control chưa focus. | H: S13 tr.8/13/18 |
| GUI-015 | H/D — phóng to chữ | D, browser zoom 200% (mẫu khảo sát đề xuất). | Phóng to; đọc và tiếp cận form, giá, các nút; sau đó trả 100%. | Nội dung/control vẫn đọc và tiếp cận được, không chồng lấp khiến mất thao tác. Đây không phải tuyên bố đạt WCAG. | H: S13 tr.7/8/16 |

### IA-02 — Forms

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-016 | H — nhãn tìm kiếm | Trang Home; ô tìm kiếm rỗng. | Kiểm tra nhãn nhìn thấy và accessible name của ô tìm kiếm. | Có tên mô tả rõ mục đích; khi đã gõ, người dùng vẫn nhận biết được trường là tìm sản phẩm. Placeholder đơn độc không thay nhãn thường trực. | H: S13 tr.8/16 |
| GUI-017 | H — nhập và sửa từ khóa | TD1.name; chuỗi Bàn phím cơ. | Gõ, chọn một phần, thay thế, xóa và gõ tiếng Việt. | Ô hiển thị đúng chuỗi người dùng nhập, hỗ trợ chỉnh sửa bình thường, không mất ký tự tiếng Việt. | H: S13 tr.11/16 |
| GUI-018 | H — hai cách submit | Từ khóa iPhone; bắt đầu từ cùng trạng thái không lọc. | Lần một nhập rồi bấm Tìm; lần hai tải lại, nhập cùng chuỗi và Enter. | Hai cách gửi cùng tiêu chí và cho cùng tập sản phẩm; không submit nhầm control. | R: FR-05; H: S13 tr.18 |
| GUI-019 | H — tìm theo tên đầy đủ | iPhone 15 Pro Max; seed không đổi. | Nhập nguyên tên TD1 và gửi tìm kiếm. | Thẻ có id=1 xuất hiện; không có thẻ tên không khớp. | R: FR-05; API §3.1 |
| GUI-020 | H — tìm một phần tên | MacBook; seed có MacBook Pro M3. | Gửi tìm kiếm MacBook. | Hiển thị MacBook Pro M3 và không đưa sản phẩm tên không chứa MacBook. Tìm chuỗi con là tiêu chí đề xuất, không phải quy tắc match được spec mô tả chi tiết. | H: S13 tr.12; FR-05 làm bối cảnh |
| GUI-021 | H — bỏ bộ lọc bằng chuỗi rỗng | Đã tìm iPhone; API ban đầu có 5 ID. | Xóa toàn bộ từ khóa, gửi Tìm. | Khôi phục tập 5 sản phẩm ban đầu, không giữ ngầm bộ lọc iPhone. | H: S13 tr.12/14; FR-05 làm bối cảnh |
| GUI-022 | H — hiển thị từ khóa an toàn | Chuỗi vô hại <b>GUI_T01</b>; không dùng script. | Nhập chuỗi, gửi Tìm và quan sát nơi hiển thị từ khóa. | Nếu từ khóa được phản chiếu, hiển thị nguyên văn như text; không tạo phần tử b hoặc render HTML từ đầu vào. | R: FR-05; SEC-04 |
| GUI-023 | D — nhãn số lượng | TD1; ô Số lượng. | Đọc nhãn và kiểm tra liên kết label-control/accessibility tree. | Nhãn Số lượng nhận diện đúng ô nhập bằng thị giác lẫn accessible name; không bị nhầm với giá. | H: S13 tr.8/16 |
| GUI-024 | D — số lượng mặc định | Mở mới /product/1, chưa sửa số lượng. | Quan sát giá trị khởi đầu. | Giá trị khởi đầu là 1, hợp lệ với min=1; mặc định 1 là lựa chọn thiết kế đề xuất, spec chỉ bắt buộc min=1. | H: S13 tr.11; FR-06 làm ràng buộc |
| GUI-025 | D — số lượng hợp lệ | Giá trị 1 và 2; reset tab giữa các giá trị. | Nhập từng giá trị; rời ô, kiểm tra giá trị/validity; chỉ thử submit tại T02. | Giữ đúng số nguyên dương đã nhập; không tự đổi 2 thành giá trị khác hoặc báo lỗi hợp lệ sai. | R: FR-06; L: S13 tr.19 |
| GUI-026 | D — lớp số lượng không hợp lệ | Lần lượt 0, -1, 1.5, rỗng và abc; mỗi lần khởi đầu sạch. | Nhập/dán từng giá trị, rời ô và thử nút hành động tại T02; ghi riêng từng biến thể. | Không chấp nhận các giá trị này như số nguyên dương. Không silently đổi 1.5 thành 1 hoặc gửi NaN; nếu trình duyệt chặn ký tự, ghi cơ chế chặn tương ứng. | R: FR-06; L: S13 tr.11/19 |
| GUI-027 | D — vị trí lỗi nhập liệu | Trạng thái số lượng không hợp lệ; quan sát khi kích hoạt hành động. | Kiểm tra vị trí thông báo lỗi so với nút Thêm vào giỏ hàng. | Thông báo lỗi nhập liệu nằm trên nút hành động tương ứng theo FR-22; không bị giấu dưới nút/ngoài vùng nhìn. | R: FR-22; L: S13 tr.16/18 |

### IA-03 — Navigation

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-028 | H → D — đúng đích chi tiết | TD1 và TD2 có thẻ riêng. | Bấm Xem chi tiết của từng thẻ, quay lại giữa hai lượt. | URL /product/{id} và tên trên trang chi tiết đúng sản phẩm vừa chọn; không mở nhầm sản phẩm. | R: FR-06; L: S13 tr.18 |
| GUI-029 | D → H — đường về trang chủ | Đang ở /product/1. | Bấm logo/link EShop trên header. | Đến trang chủ / và có thể tiếp tục chọn sản phẩm; không bị chuyển login. | H: S13 tr.17/18 |
| GUI-030 | D — breadcrumb | Trang /product/1. | Đọc breadcrumb, thử phần tử tổ tiên dẫn về Home. | Có breadcrumb phản ánh đúng trang chi tiết; tổ tiên đưa về Home, nhãn cuối nhận diện sản phẩm hiện tại. | R: FR-23; L: S13 tr.17 |
| GUI-031 | H/D — kích hoạt link bằng bàn phím | Focus logo hoặc Xem chi tiết bằng Tab. | Nhấn Enter trên mỗi link cần kiểm tra. | Thực hiện đúng đích tương tự click, không cần thao tác chuột bổ sung. | H: S13 tr.8/18 |
| GUI-032 | H/D — thứ tự Tab | Bắt đầu từ đầu trang, D/M. | Tab qua header, form/thẻ ở Home và ô số lượng/nút ở Detail. | Thứ tự focus từ trên xuống dưới, trái sang phải theo thứ tự hiển thị; không nhảy tới phần tử bị ẩn. | R: FR-21; L: S13 tr.18 |
| GUI-033 | H/D — di chuyển ngược, thoát focus | Đã focus ô tìm kiếm hoặc số lượng. | Dùng Shift+Tab và Tab qua toàn bộ vùng thao tác. | Đi ngược theo trật tự hợp lý; có thể rời mọi ô/vùng bằng bàn phím, không mắc kẹt. | H: S13 tr.13/18 |
| GUI-034 | D — URL trực tiếp và refresh | URL /product/1, server đang hoạt động. | Dán URL vào tab mới; sau khi tải, refresh. | Cả hai lần mở đúng chi tiết, không phụ thuộc đã đi qua Home hay phát sinh trang trắng. | H: S13 tr.18/24 |
| GUI-035 | H ↔ D — Back/Forward | Từ Home mở TD1; không thao tác giỏ hàng. | Dùng browser Back, rồi Forward. | Trở về đúng Home rồi đúng chi tiết TD1, không vòng lặp hoặc đổi sản phẩm. Chưa áp đặt việc giữ từ khóa/scroll vì spec chưa chốt. | H: S13 tr.17/18 |
| GUI-036 | H/D — nhận biết trang đang chọn | Trang Home, sau đó trang Detail. | Quan sát navbar và chỉ báo trang hiện tại. | Navbar phân biệt mục tương ứng đang chọn theo FR-23; không highlight sai trang. Nếu Detail không có mục navbar riêng, breadcrumb thể hiện vị trí, không đòi thêm menu sản phẩm. | R: FR-23; H: cách áp dụng cho Detail |

### IA-04 — Feedback / state

| ID | Màn hình / nội dung | Điều kiện / dữ liệu | Thao tác | Expected | Căn cứ |
|---|---|---|---|---|---|
| GUI-037 | H — tải danh sách lần đầu | DevTools delay GET /api/products khoảng 2 giây, không sửa source. | Mở Home trên tab mới và quan sát khi request đang pending. | Có chỉ báo đang tải trong thời gian pending; không biểu diễn tạm thời như không có sản phẩm. 2 giây chỉ để làm trạng thái quan sát được. | R: FR-05 |
| GUI-038 | H — tải kết quả tìm kiếm | Đã có lưới; delay request tìm iPhone khoảng 2 giây. | Gửi tìm kiếm, quan sát trước và sau response. | Có trạng thái loading khi pending; khi xong thay bằng kết quả, không còn chỉ báo tải treo. | R: FR-05; L: S13 tr.13/14 |
| GUI-039 | D — tải chi tiết | Delay GET /api/products/1 khoảng 2 giây. | Mở chi tiết và quan sát chuyển trạng thái. | Nhận biết được đang tải rồi nội dung TD1; không hiển thị dữ liệu sản phẩm khác như kết quả cuối. | H: S13 tr.13/14 |
| GUI-040 | H — kết quả rỗng | Từ khóa zzzz_T01_no_match_23120410; fixture không có tên tương ứng. | Gửi tìm kiếm sau khi đang có kết quả. | Có message thân thiện và icon/hình minh họa; không để lưới trắng hoặc giữ thẻ cũ như kết quả hiện tại. | R: FR-05/24 |
| GUI-041 | H — lỗi lấy danh sách/tìm kiếm | Chặn riêng GET /api/products bằng DevTools trên runtime khảo sát. | Mở Home hoặc gửi tìm kiếm khi request bị chặn. | Có thông báo lỗi dễ hiểu, không gọi lỗi mạng là không có kết quả; không hiển thị stack trace/SQL cho người dùng. | H: S13 tr.11/16/27 |
| GUI-042 | D — sản phẩm không tồn tại | ID 999999; xác nhận vắng trong fixture trước lượt chạy. | Mở /product/999999. | Có trạng thái không tìm thấy rõ ràng, không loading vô hạn hoặc trang trắng. | H: S13 tr.11/14/24 |
| GUI-043 | D — lỗi tải chi tiết | Chặn riêng GET /api/products/1 bằng DevTools. | Mở /product/1. | Thông báo lỗi tải khác trạng thái không tìm thấy; không để Đang tải vô hạn sau request thất bại. | H: S13 tr.11/16/27 |
| GUI-044 | H/D — phục hồi sau lỗi | Đã tạo lỗi mạng trong một lượt trước; ghi màn hình/URL đó. | Bỏ chặn request rồi dùng reload hoặc cách thử lại sẵn có. | Có thể lấy lại dữ liệu và dùng màn hình; lỗi cũ không che nội dung thành công. Không bắt buộc phải có nút Retry mới. | H: S13 tr.11/14 |
| GUI-045 | H — phản hồi tìm kiếm mới nhất | Request iPhone bị delay lâu hơn request MacBook; dùng network interception tại T02. | Gửi iPhone, sau đó MacBook; cho MacBook hoàn tất trước iPhone. | Sau khi cả hai xong, kết quả/nhãn cuối ứng với MacBook (lần gửi mới nhất); response cũ không ghi đè. | H: S13 tr.12/14/20 |
| GUI-046 | H — từ khóa đã áp dụng | Đã gửi iPhone và có kết quả; tiếp tục gõ MacBook nhưng chưa gửi. | So sánh nhãn kết quả với tiêu chí đã submit. | Nếu có nhãn Kết quả tìm kiếm cho, nó phản ánh iPhone cho đến lần submit tiếp theo; không gán kết quả cũ cho chuỗi đang soạn. | H: S13 tr.12/14 |
| GUI-047 | H/D — ảnh không tải được | Chặn URL ảnh của riêng TD1, không chặn API. | Mở Home/Detail và quan sát ảnh TD1. | Tên, giá và đích chi tiết vẫn dùng được; ảnh hỏng có alt/fallback nhận diện, không khiến cả màn hình trắng. | R: FR-24 (alt); H: S13 tr.7/11 |
| GUI-048 | H/D — phản hồi control Thêm vào giỏ | Giỏ local sạch trong tab mới; quantity=1 ở Detail. Chỉ kiểm tra control trên H/D. | Bấm đúng một lần Thêm vào giỏ trên từng màn hình, reset tab giữa hai lượt. | Có phản hồi trực quan sau lần bấm đầu (toast, trạng thái nút hoặc badge cập nhật). Không cần mở trang Giỏ hàng hay checkout. | R: FR-06/24 |

## 4. Ma trận độ phủ thiết kế

| Nhóm | Số mục | ID |
|---|---:|---|
| IA-01 | 15 | GUI-001–GUI-015 |
| IA-02 | 12 | GUI-016–GUI-027 |
| IA-03 | 9 | GUI-028–GUI-036 |
| IA-04 | 12 | GUI-037–GUI-048 |
| **Tổng** | **48** | GUI-001–GUI-048 |

Các biến thể cùng quy tắc được nhóm trong một mục (ví dụ GUI-026), không nhân số dòng để đạt ngưỡng. Nhiều trang trong cùng dòng là tham số áp dụng, không phải bằng chứng đã thực thi.

`````

### A-02 — Các phiên bản và sửa đổi

- **v0.1 → v0.2 (AI review và AI sửa):** làm rõ validation tại GUI-026; phân biệt navbar với breadcrumb ở GUI-036; giới hạn GUI-025 về ô nhập; bổ sung button keyboard ở GUI-031; tách biến thể GUI-041; làm rõ interception ở GUI-045, oracle ảnh/căn chỉnh và căn cứ R/H. Thêm **GUI-049 do worker AI phát hiện** và **GUI-050 do main AI phát hiện**.
- **v0.2 → v0.3 (khảo sát UI và AI sửa):** quan sát Home/Detail ở hai viewport cùng Edge và search có kết quả/rỗng; làm rõ GUI-012 về heading bị form ép trên viewport hẹp. Đây là khảo sát chuẩn bị, chưa phải execution/cross-platform.
- **v0.3 → v0.4:** sinh viên xác nhận đã đọc/kiểm tra và đề nghị giữ GUI-049/050 ngày 07/11/2026; AI bổ sung lý do từ FR-06/22/23 và khoảng trống bản đầu. Giữ nguồn phát hiện AI; không đổi nội dung 50 mục.
- [Checklist hiện hành v0.4](../gui/GUI_Checklist.md): **50 mục**, IA-01/02/03/04 = **15/13/10/12**. Chưa có Actual/Passed/Failed, Excel hoặc bug execution.


## P-005 — Skill GUI: Khảo sát và chọn công cụ

- Công cụ: OpenClaw / OpenAI.
- Model phản hồi: gpt-6.1-sol.
- Đầu ra của lượt này là đề xuất kiến trúc, chưa phải skill/harness được triển khai.

### Prompt nguyên văn

- Timestamp: 2026-11-07 00:36:58 (UTC+07:00)

`````text
task tiếp theo tôi muốn bạn thực thi tất cả skill/plugin có thể, để tìm kiểm và brainstorm skill về implement gui checklist, chạy từng test trên giao diện (playwright hoặc cái gì đó, trước khi quyết định phải nói cho tôi biết ưu nhược từng cái, tại sao chọn cái đó), mỗi test là 1 folder riêng, có screenshot to (tốt nhất là browser cho rõ), có log,.... những cái cần thiết, tốt nhất là nên tham khảo trên browser/skill có sẵn/tài liệu quan trọng để rút kinh nghiệm (không nhét all log vào 1 file chẳng hạn,,.......)
`````

### Output đề xuất — phần truy xuất được

- Timestamp: 2026-11-07 00:53:13 (UTC+07:00)
- Giới hạn nguồn: phần cuối bị cắt tại dấu `…(truncated)…`; chỉ giữ phần truy xuất được.

`````text
## Đề xuất: Playwright Test + skill điều phối evidence

Mình đã đối chiếu tài liệu chính thức, khảo sát skill/plugin và hoàn tất hai review độc lập. **Chưa cài đặt, chạy checklist hoặc thay đổi repo.**

### 1. So sánh trước khi chọn

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| **Playwright Test — khuyến nghị** | Có assertions, cô lập từng test, đa browser, screenshot, trace, video và HTML report; hợp việc chạy lại từng ID. | Cần thêm helper chia folder/log; một số kiểm tra thị giác, zoom và nhập tiếng Việt vẫn cần review riêng. |
| **Cypress** | Runner và Command Log dễ theo dõi; debug React, giả lập lỗi mạng thuận tiện. | Evidence từng attempt cần ghép thêm hooks; video thường theo spec; WebKit còn experimental. |
| **Selenium/WebDriver** | Phù hợp browser/device thật, đặc biệt Safari và Chrome Android trên host phù hợp. | Phải ghép nhiều phần: runner, assertions, report, log, video và retry. |
| **Browser tool / CLI / MCP** | Tốt cho agent khảo sát giao diện, tìm selector và debug. | Không mặc nhiên có bộ quản lý test, kết quả và evidence đầy đủ như test runner. |

**Vì sao chọn Playwright:** đáp ứng phần lớn yêu cầu bằng tính năng sẵn có, ít phải tự xây hơn Selenium và thuận tiện hơn Cypress cho evidence theo **ID × biến thể × nền tảng × lần chạy**.

Không cần thêm Allure hoặc plugin stealth ở bản đầu. Các framework có thể chạy OSS local không mất phí dịch vụ; cloud/device farm là lựa chọn riêng.

### 2. Skill có sẵn: học chọn lọc, không cài hàng loạt

Đã tham khảo:
- **Anthropic/GitHub `webapp-testing`:** khảo sát UI, screenshot, console và quản lý server.
- **Microsoft/OpenAI Playwright CLI:** quan sát → thao tác → quan sát lại, xử lý refs cũ và thu trace.
- **Playwright chính thức:** isolation, web-first assertions, projects, attachments và reporters.

Chúng **chưa đáp ứng trọn vẹn** cấu trúc evidence bạn muốn. Một số hướng dẫn còn mặc định tự cài dependency hoặc khởi động server — không phù hợp ràng buộc no-seed của SUT này.

Hai candidate Anthropic/Microsoft được registry báo **chưa được ClawHub scan**; mình chỉ đọc tham khảo, không cài.

### 3. Mỗi test một folder, không gom mọi log

Source mỗi ID một folder; evidence tách sâu hơn:

```text
runs/<run-id>/
├── index.json                 # chỉ tổng hợp và liên kết
├── report/                    # HTML report
└── GUI-026/
    └── quantity-1p5--detail/
        └── windows-chrome--VD/
            └── attempt-001/
                ├── result.json
                ├── screenshots/
                │   ├── 01-before.png
                │   └── 02-after-first-action.png
                ├── logs/
                │   ├── steps.jsonl
                │   ├── console.jsonl
                │   ├── network.jsonl
                │   └── errors.jsonl
                ├── trace.zip
                └── video.webm
```

- Thu ảnh tại checkpoint có ý nghĩa, **kể cả test Pass**.
- Giữ ảnh PNG gốc, full-page và ảnh viewport/crop bổ sung.
- Retry tạo attempt mới, không ghi đè; fail rồi pass vẫn phải hiện lịch sử.
- Trace ưu tiên giữ **lần fail đầu**; video dùng khi cần chứng minh diễn tiến.
- Log server tách theo process/run; không trộn toàn bộ console/network của mọi test vào một file.

**Lưu ý ảnh:** full-page screenshot chỉ chụp trang web, không có thanh URL/browser chrome. Muốn ảnh toàn cửa sổ browser phải kiểm chứng khả năng desktop capture riêng, không vẽ khung browser giả.

### 4. Skill nên đóng gói quy trình nào?

Tên dự kiến: **`gui-checklist-execution-evidence`**

**Kiểm tra điều kiện → mở rộng biến thể → chạy UI → thu evidence → review → xuất report.**

Review sơ bộ đủ **50 ID** cho thấy:
- **30 mục:** có thể xây oracle tự động rõ ràng sau khi xác minh điều kiện.
- **16 mục:** automation thu bằng chứng, cần review thị giác/ngữ nghĩa.
- **4 mục:** cần chứng minh công cụ xử lý được zoom thật, nhập/sửa tiếng Việt, native validation và đảo thứ tự request.

Đây là **phân loại thiết kế, không phải kết quả Pass/Fail**. Thiếu browser/device hay prerequisite phải ghi **Blocked**, không 
…(truncated)…
`````

## P-006 — Skill GUI: Dependency và pilot

- Công cụ: OpenClaw / OpenAI.
- Model phản hồi: gpt-6.1-sol.

### Prompt nguyên văn

- Timestamp: 2026-11-07 10:16:02 (UTC+07:00)

`````text
ý kiến của tôi:
1. về việc source cố tình chặn 1 click mà click double mới được, ta phải nhóm các test lại, khi block thao tác click vì không được, thì các test kia cũng block, không tốn chi phí để test những test liên quan
2. tôi đồng ý playwright, nhưng pilot là gì nhỉ, là chọn 5 cái để thực hiện trước khi implement thực tế đúng không
3. tôi có miss phần nào tôi cần confirm từ bạn nữa không
chưa implement ở bước này
`````

### Output phản hồi — văn bản truy xuất được

- Timestamp: 2026-11-07 10:16:40 (UTC+07:00)
- Giới hạn nguồn: API báo `contentTruncated=true` nhưng văn bản hiển thị không có dấu cắt; độ đầy đủ chưa xác minh.

`````text
## 1. Nhóm test theo dependency — mình đồng ý

Nên dùng **quan hệ phụ thuộc theo prerequisite**, tránh chạy lại những test chắc chắn không thể tiếp tục:

- Test kiểm tra **click đầu tiên** vẫn chạy. Nếu không có phản hồi đúng expected → **Fail ở test gốc**.
- Những test **bắt buộc cần hành động đó thành công** → **Blocked**, ghi rõ phụ thuộc vào test gốc và liên kết evidence; không cố click thêm để vượt lỗi.
- Những phần **không phụ thuộc** vẫn chạy: nhãn, dấu `*`, nhập/giữ số lượng, layout, accessible name…

Ví dụ: GUI-048 ở Detail thất bại **không tự động block toàn bộ GUI-026**. Phần nhập liệu vẫn kiểm tra được; phần cần chứng minh hành động từ chối quantity có thể bị che khuất và phải Blocked. Tương tự, lỗi ở Detail không tự block GUI-050 nếu prerequisite của nó chuẩn bị bằng control **Home**.

**Cũng cần gọi đúng hiện tượng:** source bỏ qua lần kích hoạt đầu, không nhất thiết yêu cầu thao tác *double-click*. Mình sẽ không biến hai lần click thành cách sử dụng hợp lệ.

Cách này tiết kiệm lượt chạy nhưng không làm mất coverage độc lập.

## 2. Pilot là gì?

**Đúng về ý chọn một nhóm nhỏ chạy trước**, nhưng cần chỉnh một chút:

> Pilot là **triển khai tối thiểu và chạy thật một nhóm đại diện**, trước khi triển khai rộng toàn bộ checklist.

Nghĩa là pilot vẫn có implementation, gồm:
- Harness/fixture dùng chung.
- Một số test đại diện.
- Screenshot, log, trace, report và dependency handling.

Mục tiêu là kiểm chứng **cách chạy và bằng chứng có đáng tin không**, không phải yêu cầu năm test đều Pass. Một test Fail đúng, có evidence đầy đủ, vẫn chứng minh pipeline hoạt động tốt.

Năm ID trước đó chỉ là **đề xuất**, chưa chốt cứng.

## 3. Bạn còn cần confirm gì?

**Đã chốt:**
- Chọn **Playwright Test**.
- Áp dụng dependency để không chạy thừa.
- **Chưa implement ở bước này** — mình giữ nguyên.

**Chưa cần quyết định ngay, nhưng cần trước các bước tương ứng:**

| Thời điểm | Cần xác nhận |
|---|---|
| Trước bắt đầu pilot | Cho phép triển khai local và cài dependency/browser cần thiết trong harness riêng. Việc chọn Playwright chưa được mình coi là phép cài ngay. |
| Trước full cross-platform | Bộ **≥3 nền tảng** đáp ứng đề và quyền truy cập thực tế; hiện chưa chốt Safari/Android thật. |
| Trước xuất evidence nộp bài | **Email sinh viên** để overlay; không suy từ email Git. |

Còn chọn ID pilot, cấu trúc log, trace policy và chi tiết kỹ thuật mình có thể tự điều phối theo các nguyên tắc đã thống nhất, **không cần bạn duyệt từng việc nhỏ**. Commit/push, đăng Issue hoặc video vẫn là quyền riêng, chưa được cấp cho batch này.

*Ghi chú: tra cứu bộ nhớ hiện tạm ngưng do lệch cấu hình chỉ mục; phần đối chiếu trên dựa vào ngữ cảnh và tài liệu đã đọc trong cuộc trò chuyện này.*
`````

## P-007 — Skill GUI: Tạo skill, harness và pilot local

- Công cụ: OpenClaw main, có worker hỗ trợ authoring/review / OpenAI gpt-6.1-sol.
- Phần dưới ghi thông điệp sửa lỗi launcher và phản hồi tổng kết cuối, không phải toàn bộ diễn tiến turn hoặc snapshot source AI ban đầu.

### Prompt nguyên văn

- Timestamp: 2026-11-07 10:47:45 (UTC+07:00)

`````text
oke cho phép triển khai tạo skill, triển khai local và cài dependency/browser cần thiết trong harness riêng
`````

### Thông điệp sửa lỗi launcher trong quá trình thực hiện

- Timestamp: 2026-11-07 10:58:32 (UTC+07:00)
- Giới hạn nguồn: API báo `contentTruncated=true` nhưng văn bản hiển thị không có dấu cắt; độ đầy đủ chưa xác minh.

`````text
Pilot đầu đã tạo đủ evidence và cho thấy dependency gate hoạt động: nhóm validation bị Blocked, còn test nhập liệu độc lập vẫn chạy.

Tuy nhiên, khi mở ảnh kiểm tra, mình phát hiện launcher chưa nạp đúng Tailwind do sai working directory. Mình đã **đánh dấu run đó không hợp lệ cho kết luận GUI**, giữ nguyên bằng chứng, sửa launcher và thêm kiểm tra render trước execution. Mình sẽ chạy lại bằng run mới, không ghi đè run đầu.
`````

### Output tổng kết cuối — văn bản truy xuất được

- Timestamp: 2026-11-07 11:17:12 (UTC+07:00)
- Giới hạn nguồn: API báo `contentTruncated=true` nhưng văn bản hiển thị không có dấu cắt; độ đầy đủ chưa xác minh.

`````text
Đã hoàn tất **skill + harness riêng + pilot local**.

- Skill: `hw03/skills/gui-checklist-execution-evidence/`, kèm source template để tạo lại harness.
- Đã cài **Playwright Test 1.65.0 + Chromium** trong harness/cache riêng.
- **44/44 kiểm tra regression đạt**; các vấn đề từ review đã được xử lý.

### Kết quả pilot
**13 instance thuộc 7 ID**, chỉ Chromium desktop:

| Kết quả | Số lượng |
|---|---:|
| Pass | 3 |
| Fail | 3 |
| Blocked | 5 |
| Cần review | 2 |

**Dependency hoạt động đúng ý bạn:** GUI-048 Fail sau click đầu → năm biến thể validation phụ thuộc bị Blocked, không mở trang/click thêm. Test nhập số lượng độc lập vẫn chạy.

Mỗi instance có folder evidence riêng: kết quả, screenshot, log, trace/video khi có thực thi, checksum và liên kết HTML report. Run lỗi launcher ban đầu được giữ nhưng loại khỏi kết luận GUI.

**Không seed/reset, không sửa source SUT hoặc hồ sơ AI; chưa stage/commit/push.** Chưa chạy full 50 mục hay ≥3 nền tảng.

Ví dụ GUI-045: đang tìm **MacBook** nhưng response cũ ghi đè thành **iPhone**:
`````

### Artifact và phạm vi đã kiểm chứng

- [Skill procedure](../skills/gui-checklist-execution-evidence/SKILL.md), [pilot adapter](../skills/gui-checklist-execution-evidence/references/pilot-adapter.md), [harness source](../tools/gui-harness/README.md).
- Run tham chiếu: `2026-11-07T04-14-40-565Z`, result schema `pilot-0.2`; 13 instance/7 ID trên Windows Chromium headless 1440×900: **3 Pass, 3 Fail, 5 dependency Blocked, 2 needs-review**. **44/44 unit/DOM regression checks đạt**; không đồng nghĩa 44 test GUI hoặc full checklist.
- GUI-048 fail ở click đầu; các biến thể GUI-026 phụ thuộc giữ root reference và không mở trang/action. GUI-025 nhập số lượng độc lập vẫn chạy. GUI-040 thiếu empty-state message/icon; GUI-045 response cũ ghi đè kết quả mới. GUI-032 Home/Detail vẫn needs-review dù native passed.
- Run `2026-11-07T03-55-37-468Z` bị loại vì launcher cwd/Tailwind; giữ evidence nhưng không dùng để kết luận GUI. AI sửa launcher/render gate rồi chạy run mới, không ghi đè.
- Main AI đã sửa feedback oracle, provenance của lỗi kỹ thuật/oracle, phân biệt technical/dependency block và verifier schema/artifact sau tự kiểm và AI review. Các chỉnh sửa code là AI thực hiện, không khai là sinh viên tự viết.
- Phản hồi tổng kết có ảnh `02-both-responses-complete.png` (1440×900), thuộc GUI-045 của run tham chiếu. Screenshot/trace/video và native report ở kho evidence local; raw artifacts chưa bảo đảm redacted để export.
- Đây là fixed pilot adapter, không full JSON contract/generic DAG compiler; chưa full 50 ID, ≥3 nền tảng, real zoom, IME, browser chrome hoặc identity overlay. Source SUT/DB được kiểm tra không đổi; không có dữ liệu usability người thật mới.


<a id="doi-chieu-20261109"></a>
## Đối chiếu bổ sung — 09/11/2026

Đây là **trích tuyển và sổ bằng chứng kỹ thuật**, không phải toàn bộ lịch sử theo HW03 §9. Đã đối chiếu lịch sử hội thoại qua công cụ tìm kiếm/lịch sử, Git log và verification JSON trên đĩa; không đọc raw transcript. Trường contentTruncated=true vẫn xuất hiện khi lấy riêng một thông điệp nên không chứng nhận đã khôi phục toàn bộ turn. Không phục dựng prompt hoặc output còn thiếu; không đổi nội dung các mục P-000–P-007. Không chép trao đổi riêng, quản lý quyền, dữ liệu người tham gia hoặc nội dung video.

<a id="p-008"></a>
## P-008 — A-06: Khả thi portal local dùng SUT

- Timestamp prompt: 2026-11-09 00:54:13 (UTC+07:00).
- Công cụ/model: OpenClaw main / OpenAI gpt-6.1-sol.
- Nguồn: thông điệp user kỹ thuật truy xuất từ lịch sử; API có cờ contentTruncated ở cửa sổ lịch sử. Không khẳng định đây là prompt duy nhất tạo toàn bộ portal.

### Prompt nguyên văn — văn bản truy xuất được


```text
tôi muốn làm theo kiểu build web hay gì đó local, có dùng source SUT, rồi có quay screen shot. chạy local, sau đó tôi sẽ tunnel ra, liệu có khả thi không? hoặc cách nào đó cho bạn tôi vào 1 link web nào đó và thực hiện? khả thi không
```

### Output và artifact

Chưa khôi phục phản hồi trực tiếp tương ứng thành một cặp đầy đủ; **không điền lời tóm tắt sau này vào ô output nguyên văn**. Artifact hiện hành: [CONTRACT](../tools/usability-study/CONTRACT.md), [VERIFICATION](../tools/usability-study/VERIFICATION.md), source portal/server/scripts/tests. Scope đã chuyển từ upload video ngoài sang compact screen-only recorder trong các lượt sau; không quy recorder cho riêng P-008.

<a id="p-009"></a>
## P-009 — A-05/A-07: Review SUS và brainstorm probes

- Timestamp prompt: 2026-11-09 21:47:21 (UTC+07:00).
- Timestamp phản hồi nguồn: 2026-11-09 21:48:30 (UTC+07:00).
- Công cụ/model: OpenClaw main / OpenAI gpt-6.1-sol.
- Prompt và phần output dưới đây là văn bản truy xuất được; source history có contentTruncated=true. Output **trích nguyên văn phần kỹ thuật**, kết thúc trước đoạn phối hợp riêng; không phải toàn bộ turn. Không công bố raw answers hoặc dữ liệu pilot.

### Prompt nguyên văn

```text
check lại 1 tí, các câu hỏi hiện tại là bạn tự nghĩ hã. còn SUS là phần câu hỏi nào? tôi thấy có 1 số câu kì cục khó trả lời quá, brainstorm lại câu hỏi giúp tôi (giữ SUS và nói tôi biết SUS/UEQ-S mà bạn dùng là những câu hỏi nào)
```

### Output nguyên văn — trích đoạn kỹ thuật

```text
**Đúng một phần: những câu hỏi mở là mình tự soạn; 10 câu SUS thì dựa trên thang có sẵn, không phải mình tự nghĩ.** Mình đã rút câu hỏi mở quá mạnh nên có câu vừa cụt vừa khó trả lời — cần sửa.

## 1. Hiện đang dùng SUS, không dùng UEQ-S

Đề §6 yêu cầu **SUS hoặc UEQ-S**, cộng câu hỏi mở về **độ rõ ràng, phục hồi khi gặp lỗi, tốc độ và sự tin tưởng**. Không cần dùng cả hai thang.

Phần **“Đánh giá EShop” với 10 câu chọn mức 1–5** chính là SUS:

1. Tôi nghĩ rằng tôi muốn sử dụng hệ thống này thường xuyên.
2. Tôi thấy hệ thống này phức tạp một cách không cần thiết.
3. Tôi nghĩ hệ thống này dễ sử dụng.
4. Tôi nghĩ tôi cần sự hỗ trợ của một người có chuyên môn kỹ thuật để có thể sử dụng hệ thống này.
5. Tôi thấy các chức năng khác nhau trong hệ thống này được tích hợp tốt với nhau.
6. Tôi nghĩ hệ thống này có quá nhiều điểm không nhất quán.
7. Tôi hình dung rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh.
8. Tôi thấy hệ thống này rất rườm rà khi sử dụng.
9. Tôi cảm thấy rất tự tin khi sử dụng hệ thống này.
10. Tôi cần học nhiều thứ trước khi có thể bắt đầu sử dụng hệ thống này.

**Lưu ý:** đây là bản Việt làm việc do AI hỗ trợ dịch, **chưa phải bản tiếng Việt đã được xác thực tâm trắc**. Những từ như “tích hợp”, “không nhất quán” đúng là khó hiểu, nhưng không nên tùy tiện viết lại rồi vẫn xem như thang chuẩn không thay đổi.

Nguồn đối chiếu: [SUS — MeasuringU](https://measuringu.com/sus/), thang gốc của John Brooke.

## 2. Phần mình tự soạn có vấn đề gì?

Phần **“Chia sẻ thêm”** không phải SUS hay UEQ-S:

- **“Điều gì khó hiểu…?”** ngầm giả định người dùng phải gặp chỗ khó hiểu.
- **“Chỗ nào nhanh, chậm hoặc tốn công?”** hỏi nhiều ý cùng lúc, khó biết cần trả lời gì.
- **“Bạn tin lựa chọn của mình phù hợp đến đâu?”** khá trừu tượng; người chưa chọn được sản phẩm càng khó trả lời.
- Chọn **“Không gặp”** rồi vẫn phải gõ “không gặp” là thao tác thừa.

## 3. Bộ câu hỏi mở mình đề xuất thay thế

Giữ nguyên SUS, sau đó chỉ hỏi **4 câu chính**, với ô giải thích xuất hiện khi phù hợp:

| Nhóm | Câu đề xuất | Hỏi thêm khi có tình huống |
|---|---|---|
| **Dễ hiểu** | **Trong lúc tìm điện thoại, có thông tin hoặc nút nào bạn chưa hiểu rõ không?** | Đó là chỗ nào? Bạn nghĩ nó có nghĩa gì? |
| **Phục hồi** | **Trong lúc làm, bạn có bấm nhầm, gặp lỗi hoặc bị kẹt ở bước nào không?** | Bạn đã làm gì tiếp theo? Có tiếp tục được không? |
| **Tốc độ** | **Có bước nào mất nhiều thời gian hơn bạn mong đợi không?** | Đó là bước nào? Điều gì làm bạn mất thời gian? |
| **Tin tưởng** | **Thông tin trên EShop đã đủ để bạn quyết định chọn một chiếc điện thoại chưa?** | Thông tin nào giúp bạn quyết định, hoặc bạn còn cần biết thêm điều gì? |

Cách trả lời:
- Cho phép **Có / Không / Không chắc** tùy câu.
- Không gặp thì **không bắt gõ giải thích**.
- Câu mở cho phép bỏ qua; không bắt người dùng nghĩ ra một vấn đề.
- Các câu này là **phỏng vấn bổ sung**, không cộng thành điểm SUS.

Câu cuối **không bắt buộc**:
> **Nếu được thay đổi một điều trên EShop, bạn muốn thay đổi điều gì?**
```

### Artifact và kết quả sau revision — không phải output nguyên văn của lượt brainstorm

- [INSTRUMENTS](../usability/INSTRUMENTS.md), [probes-v04.mjs](../tools/usability-study/portal/probes-v04.mjs) và [probe tests](../tools/usability-study/tests/probes-v04.test.mjs). Câu chữ do AI soạn; review của sinh viên không chuyển tác giả thành sinh viên tự viết.
- Giữ nguyên SUS 10 câu/thang/scoring; không triển khai UEQ-S. Probes tự soạn không cộng SUS; Có/Không/Không chắc/Bỏ qua, optional follow-up, không chọn sẵn và không gửi text ẩn. Snapshot/raw v0.3 không đổi theo v0.4.
- Build và 54/54 node:test đạt theo VERIFICATION. Evidence synthetic v0.4 10 nhóm và v0.3 9 nhóm đều PASS; native display picker vẫn UNVERIFIED, humanParticipants=0 trong hai run này.
- Test đầu lấy snapshot sai ở admin session thay vì export; sửa assertion theo contract rồi chạy lại. Failed evidence compact-e2e-1794236178039 được giữ, không ghi đè thành PASS.

### Sổ bằng chứng A-04–A-07

Mốc dưới là lịch sử kiểm chứng, không phải chứng nhận đã chạy lại toàn bộ vào ngày đối chiếu. Artifact ngoài Git dùng đường dẫn tương đối từ thư mục HW03 cha repo; không liên kết/đính kèm private DB hoặc video.

| Artifact / kiểm chứng | Kết quả có bằng chứng | Nguồn / giới hạn |
|---|---|---|
| A-04 Task 1 export | 52 ID/122 variants; effective 75 Pass/31 Fail/15 Blocked/1 needs-review; 31 Fail ánh xạ 19 nhóm | [Bộ Task 1](../gui/task1/START-HERE.md), [mapping](../gui/task1/findings/mapping.json). 19 nhóm triệu chứng không tự chứng minh 19 root causes; native passed không phải GUI Pass. Bản report tiến độ 73/31/15/3 trước review không thay số cuối. |
| A-05 bộ chuẩn bị | Protocol, scenario, SUS, templates, pilot và analysis | [Usability index](../usability/README.md). Thông điệp nguồn chuẩn bị ghi kiểm 17 local links/16 bảng/công thức SUS; đó là snapshot lịch sử, không phải chỉ số hiện hành sau mọi revision. |
| A-06 runtime/recorder | 62 fingerprint SUT không đổi; startup dùng run-* riêng; các lỗi CSP/race/autosave/withdrawal/retry đã có regression | [VERIFICATION](../tools/usability-study/VERIFICATION.md). Các count 31→32→50→54 là các revision khác nhau, không cộng thành số test/participant. AI worker review không phải human acceptance. |
| A-07 compact v0.4 | PASS; 10 nhóm browser; syntheticOnly=true, humanParticipants=0 | _working/eshop-sut-HW03/online-study/compact-e2e-1794236257548/verification.json. Native picker chưa kiểm thật. |
| A-07 snapshot v0.3 | PASS; 9 nhóm browser; syntheticOnly=true, humanParticipants=0 | _working/eshop-sut-HW03/online-study/compact-e2e-1794236316214/verification.json. Không migrate đáp án cũ. |
| A-07 report v0.4 | PASS; 10 headings, 12 tables; PDF 92,164 bytes; printWidthOverflow=false | compact-e2e-1794236257548/report-render-verification.json trong cùng work root. allPagesManuallyInspected=false. |
| A-07 question-preview | Build + 4 targeted node tests PASS; HTTPS browser kiểm 4 probes/10 SUS, reset, 0 API nghiên cứu; private/admin route 404 | _working/eshop-sut-HW03/online-study/question-preview-20261109/verification.json. Lỗi syntax regex của static server lượt đầu đã được sửa bằng whitelist asset rồi kiểm lại; không coi server lỗi là PASS. Không ghi URL tunnel tạm vào hồ sơ nộp. |

**Còn thiếu:** cặp prompt/output đầy đủ của phần full execution/export Task 1, chuẩn bị Task 2, triển khai/runtime/recorder và worker review. Các artifact có thể truy nguồn kỹ thuật nhưng bản trích tuyển này **chưa đáp ứng log mọi tương tác**. Không dùng tóm tắt để giả thành nguyên văn, không tự điền AI Critique hoặc chữ ký. Lượt thử nội bộ không được tính thay bảy người ngoài lớp, pilot đạt tiêu chí tuyển người hay moderated evaluation hoàn tất.


## Sổ bằng chứng A-08 — 10/11/2026

Đây là **bản ghi kỹ thuật**, không phải prompt/output nguyên văn và không tăng số tương tác trích tuyển. Chưa nhập cặp transcript đầy đủ của lượt xuất pilot; không dùng mô tả công việc thay nguyên văn. Không chép trao đổi riêng, đáp án, điểm cá nhân, hình video hoặc invitation.

- Artifact: [biên bản pilot nội bộ Markdown/PDF/receipt](../usability/pilot/2026-11-10-internal-v04/README.md), commit 8fd1147.
- Kiểm nhận: phase done, 10 SUS hợp lệ, bốn trường lựa chọn probes và một WebM; SUS tính lại local khớp export; hash video khớp, container 1 video track/0 audio. Short decode/playback tiến lên; chưa review hết nội dung hoặc đo duration hữu hạn. Đây là kiểm kỹ thuật, không phải K1 hoặc moderation observation.
- Export riêng: JSON/CSV/Markdown/HTML/PDF và Git log; PDF private 10 mục, không print-width overflow, chưa kiểm tay mọi trang. PDF biên bản không dữ liệu cá nhân được kiểm 6 mục/1 bảng và mẫu render đầu. Validator 17 Markdown files không lỗi ở lượt pilot.
- Raw answers/video không đưa vào AI/Git. Report không tự tạo findings/severity, notes hoặc timing. Review/verified/frozen vẫn chưa được đánh; main sample contribution=0.
- Theo đề §6/§12/§14, hồ sơ này ghi pilot và evidence hiện có nhưng chưa chứng nhận đủ refine hoặc toàn bộ Phase 1. Việc chưa có bảy phiên và roster vẫn được ghi đúng thực tế.
