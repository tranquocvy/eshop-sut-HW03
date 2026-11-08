**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC15003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **Biểu mẫu Khai báo Sử dụng AI**

*Đính kèm cho mọi bài tập có dùng AI ở bất kỳ mức nào.*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1\. Thông tin Môn học & Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Mã bài tập:** | HW03-AI |
| **Tên bài tập:** | GUI & Usability |
| **Cấp độ AI (1–5):** | Cấp \_\_\_\_ |
| **Ngày:** | 07/11/2026 |
| **Họ tên sinh viên:** | TRẦN QUỐC VỸ |
|  |  |
| **MSSV:** | 23120410 |

## **2\. Câu hỏi Khai báo**

### **1\. Công cụ AI đã dùng:**

*Liệt kê mọi công cụ AI dùng cho bài tập này (ví dụ AI Tool (e.g., ChatGPT, Claude, Gemini), ChatGPT, GitHub Copilot, Cursor, Gemini).*

- **OpenClaw main và worker reviewer / OpenAI gpt-6.1-sol:** tổng hợp yêu cầu, chọn phạm vi, soạn kế hoạch và checklist, AI review, khảo sát UI chuẩn bị, hỗ trợ sửa tài liệu và tạo skill/harness thực thi pilot GUI.
- **PDF extractor / OpenAI gpt-6-astra:** trích xuất và đối chiếu đề gốc, slide S13; extraction văn bản 55 trang theo các dải, chỉ có một số ảnh slide. Worker review không xác minh trực quan toàn bộ PDF.

### **2\. Giai đoạn nào của bài tập có dùng AI:**

*Tick tất cả: [x] brainstorm  [x] outline  [x] viết nháp  [x] phản hồi  [x] sửa chữa  [x] code  [ ] phân tích dữ liệu  [ ] thiết kế đồ hoạ  [x] khác (ghi rõ: đọc đề/template, chọn phạm vi và setup repo).*

Phạm vi sửa chữa gồm kế hoạch, checklist, setup repo, hồ sơ AI và helper/harness; không sửa production code để làm test đạt. AI tạo launcher riêng mở fixture READONLY mà không tải initializer/seed, không dùng để kết luận đường ghi dữ liệu. Đã có pilot GUI 13 instance/7 ID bằng Playwright Test và lượt xử lý Task 1 đủ 52 ID/122 biến thể trên Windows Chromium: 119 biến thể/51 ID có UI observations. Kết quả hiệu lực sau AI review và review kiểm thủ công: 75 Pass, 31 Fail, 15 Blocked, 1 needs-review; không đồng nghĩa mọi assertion đều được thực thi. Chưa hoàn tất cross-platform Task 3 hoặc phân tích dữ liệu usability.

### **3\. Prompt / nhiệm vụ chính cho AI:**

*Dán nguyên văn 2–3 prompt quan trọng nhất. Để xem đầy đủ, đính kèm Phụ lục A (prompt\_log.md).*

**P-000 — Đọc đề và cơ sở lập kế hoạch**

```text
session này focus vào các HW của môn software testing, môn này có yêu cầu ailog và các file ai audit. vì thế cần đọc lại các template ở hw01 và hw02 (session này bắt đầu từ hw03 trở đi). Các file này đã được điền thông tin và hoàn thiện để nộp, nên không còn giữ được template gốc, bạn hãy đọc đề và kiểm tra lại cần template nào tôi sẽ gửi bản gốc. Trước mắt ở đoạn chat này hãy đọc hw03 và tóm tắt yêu cầu trước, chưa implement
```

**P-002 — Lựa chọn phạm vi**

```text
bước 1 hãy chọn "Màn hình chính và luồng usability không được trùng với thành viên cùng nhóm". mình là ngời đầu tiên chọn nên hãy chọn cái dễ nhất. chưa impelement ở bước này
```

**P-004 — Tạo GUI checklist**

```text
hãy thực hiện T01 theo plan, tôi đã đính kèm "S13_GUI Testing & Usability Testing.pdf" ở root của src code
```

[Prompt Log](PromptLog.md) là **bản trích tuyển 6 tương tác** P-000/P-002/P-004/P-005/P-006/P-007, không phải toàn bộ lịch sử. P-000/P-005 bị cắt ở cuối; nguồn P-004/P-006/P-007 có cờ cắt hoặc độ đầy đủ chưa xác minh như ghi tại từng mục. Ba prompt ở trên là các ví dụ đại diện; P-005–P-007 bổ sung quá trình chọn công cụ, dependency và tạo skill/harness. AI review không chép toàn văn nhưng đóng góp vẫn được khai.

### **4\. Phần cụ thể AI đóng góp:**

*Càng cụ thể càng tốt. Ví dụ: 'AI sinh TC01–TC15 ở Mục 3.2; tôi viết lại TC04 và TC11; AI KHÔNG đóng góp vào Mục 1, 2, 4, hoặc AI Critique.'*

AI đề xuất Home / Product Listing & Search (FR-05), với Product Detail (FR-06) là màn hình bổ trợ và luồng kết thúc ở lựa chọn sản phẩm (A-00). AI soạn kế hoạch T00–T07, bổ sung nguồn chính sách và căn cứ đối chiếu rồi rút gọn cấu trúc (A-01). Ngoài hai artifact này, AI hỗ trợ thiết lập repo riêng và chuẩn bị biểu mẫu.

**A-02:** AI tạo bản checklist đầu 48 mục. Worker AI review đề xuất GUI-049 về dấu `*`; main AI bổ sung GUI-050 về badge. AI sửa validation/oracle, keyboard, điều kiện context/request và căn cứ R/H; sau khảo sát Home/Detail ở hai viewport trong cùng Edge, làm rõ GUI-012. Bản hiện hành v0.5 có 52 mục. GUI-049/050 và lý do giữ hai mục này có AI hỗ trợ; **GUI-051/052 cùng lý do AI bỏ sót do tôi đề xuất sau review**, AI chỉ gán ID, chuẩn hóa vào bảng và làm rõ điều kiện test. AI còn hỗ trợ ôn lý thuyết và làm rõ yêu cầu bài.

**A-03 — Skill/harness GUI (P-005–P-007):** AI khảo sát framework/skill/plugin, đề xuất Playwright Test và cấu trúc evidence theo ID/variant/platform/attempt; sinh viên góp ý dependency và chọn runner. AI tạo repository-owned skill, contract/adapter, materializer/source template, harness và các test pilot; worker AI hỗ trợ authoring/review. AI sửa launcher/Tailwind và các vấn đề oracle/verifier sau tự kiểm/AI review rồi thực thi lại. Pilot cuối có 13 instance/7 ID trên Windows Chromium desktop: 3 Pass, 3 Fail, 5 Blocked, 2 needs-review; 44/44 unit/DOM regression checks đạt. Đây không phải full execution checklist 52 ID, ≥3 nền tảng hoặc human review của hai instance GUI-032.

Code SUT giữ nguyên từ nguồn giảng viên; helper/harness là code AI tạo riêng. Chưa có dữ liệu người tham gia hoặc phiên usability mới. Raw screenshot/trace/video/native report được bảo toàn riêng, không mặc định đưa toàn bộ vào Git. Bộ xuất Task 1 gồm report, Excel và evidence Failed được chọn có mapping; chỉ có thể coi đã sẵn sàng xuất bản sau kiểm tra privacy, checksum và links.

### **5\. Cách tôi rà soát / chỉnh sửa / xác minh đầu ra AI:**

*Mô tả phương pháp xác minh (chạy test, kiểm tra spec, hỏi TA, tra RFC, đối chiếu ISTQB syllabus, v.v.).*

Tôi đã review và chấp nhận phạm vi FR-05/FR-06 và PLAN v0.3. Tôi giữ nguyên đề xuất phạm vi; đối với kế hoạch, tôi yêu cầu làm gọn cách trình bày, AI thực hiện chỉnh sửa. Việc bổ sung nguồn/căn cứ và kiểm tra kỹ thuật do AI hỗ trợ thực hiện.

Tôi đã đọc và kiểm tra checklist, đề nghị giữ GUI-049/050; hai mục này có nguồn phát hiện ban đầu là AI. Sau review, ngày 07/11/2026 tôi bổ sung **GUI-051: phục hồi từ tìm kiếm không có kết quả sang iPhone mà không reload**, và **GUI-052: xử lý khi API trả HTTP 500**, cùng giải thích vì sao AI bỏ sót từng mục. AI gán ID, chuẩn hóa cách trình bày và làm rõ điều kiện test; checklist hiện hành là v0.5 với 52 mục. Phần AI review/sửa và phần tôi review/bổ sung được ghi riêng trong Checklist §5–6 và Audit A-02.

Tôi đã kiểm tra pilot/evidence và xác nhận evidence từng GUI đầy đủ ngày 07/11/2026. Đây là review bằng chứng pilot, không khai đã review toàn bộ source hoặc kết luận Pass cho hai instance GUI-032.

[AI Audit Report](AI_Audit_Report.md) ghi A-00 **VALID**; A-01, A-02 và A-03 **INCOMPLETE — chấp nhận sau sửa**; A-04 **INCOMPLETE — execution/report còn giới hạn coverage và log được ghi rõ**. A-03 được chấp nhận trong phạm vi pilot sau các sửa đổi launcher/oracle/verifier do AI thực hiện. A-02 giữ INCOMPLETE vì bản AI cần sửa và tôi đã bổ sung GUI-051/052, không phải vì tôi chưa review hoặc chưa bổ sung. Verdict thiết kế không chứng nhận full execution/cross-platform; A-03 cũng chưa chứng nhận reuse hoặc setup một lệnh.

### Bổ sung A-04 — Thực thi và tổng hợp Task 1

AI tạo adapter local, thu observation, đối chiếu ảnh/DOM/network, rà false Pass và tổng hợp báo cáo/Excel/findings từ kết quả đã lưu. Native collector báo 122 passed không phải 122 GUI Pass. Raw assessment ban đầu là 44 Pass/26 Fail/14 Blocked/38 needs-review; effective assessment hiện hành là 75/31/15/1. GUI-033 Home/Detail được chốt theo xác nhận kiểm thủ công của sinh viên, không khai là agent đã chạy bổ sung reverse traversal đầy đủ. GUI-036 Detail còn applicability; phần recovery của GUI-051 đạt nhưng message-disappearance bị chặn do không có message ban đầu.

[Report Task 1](../gui/task1/START-HERE.md) là bộ xuất dẫn xuất; không sửa SUT hoặc ghi đè attempt gốc. Transcript cho giai đoạn mới chưa được bổ sung đầy đủ vào PromptLog; không tự dựng prompt/output lịch sử. AI không khai đã thực hiện usability với người thật.

### **6\. Trích dẫn (nếu môn yêu cầu):**

*Môn Kiểm chứng Phần mềm dùng phong cách IEEE. Ví dụ: Anthropic. (2026). AI Tool (e.g., ChatGPT, Claude, Gemini) \[Large language model\]. https\://claude.ai*

[1] FIT@HCMUS, “HW03 – GUI & Usability,” 2026, §5–10, §14–15.

[2] FIT@HCMUS, “HW01 – QA/QC Jobs · 20 Defects · Test a Physical Product,” 2026, “AI Collaboration Protocol” và “Required Templates.”

[3] FIT@HCMUS, “AI-02 AI Audit Report; AI-03 AI Disclosure Form; AI-05 Privacy & Responsible Use Checklist,” AI Policy · Templates 2026 v1.0.

[4] ttbhanh, “eshop-sut,” GitHub. [Trực tuyến]. Có tại: https://github.com/ttbhanh/eshop-sut .

[5] FIT@HCMUS, “S13_GUI Testing & Usability Testing,” tr.7–8, 11–20, 22–28.

## **3\. Cam đoan Trung thực**

*Bằng việc ký tên dưới đây, tôi cam đoan thông tin khai báo ở trên là chính xác và đầy đủ. Tôi hiểu rằng việc không khai báo hoặc khai báo sai lệch về việc dùng AI sẽ bị coi là vi phạm liêm chính học thuật và có thể dẫn đến điểm 0 cho bài tập cùng việc bị chuyển lên hội đồng kỷ luật.*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | TRẦN QUỐC VỸ |
| :---- | :---- |
| **MSSV:** | 23120410 |
| **Lớp / Khoá:** | 23_3 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** |  |
| **Ngày:** |  |
| **Chữ ký:** |  |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.