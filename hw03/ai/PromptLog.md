# HW03 — Prompt Log trích tuyển theo artifact
**Phạm vi:** bản trích tuyển gồm **3 tương tác** P-000, P-002 và P-004 cho 3 artifact A-00–A-02; không phải toàn bộ lịch sử AI của HW03. Các lượt vận hành, ôn tập, trao đổi khác và AI-to-AI review không được chép toàn văn trong bản trích này. Đóng góp AI review và các sửa đổi có ảnh hưởng đến checklist vẫn được khai trong Audit/Disclosure. Bản trích tuyển này chưa chứng minh đáp ứng yêu cầu ghi mọi tương tác tại HW03 §9.


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
