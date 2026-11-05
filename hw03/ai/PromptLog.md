# HW03 — Prompt Log theo artifact

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