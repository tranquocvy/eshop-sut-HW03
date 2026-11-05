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
| **Ngày:** | 05/11/2026 |
| **Họ tên sinh viên:** | TRẦN QUỐC VỸ |
|  |  |
| **MSSV:** | 23120410 |

## **2\. Câu hỏi Khai báo**

### **1\. Công cụ AI đã dùng:**

*Liệt kê mọi công cụ AI dùng cho bài tập này (ví dụ AI Tool (e.g., ChatGPT, Claude, Gemini), ChatGPT, GitHub Copilot, Cursor, Gemini).*

- **OpenClaw / OpenAI gpt-6.1-sol:** đọc và tổng hợp yêu cầu, đề xuất phạm vi, soạn kế hoạch, AI review và hỗ trợ sửa tài liệu.
- **PDF extractor / OpenAI gpt-6-astra:** trích xuất và đối chiếu đề gốc.

### **2\. Giai đoạn nào của bài tập có dùng AI:**

*Tick tất cả: [x] brainstorm  [x] outline  [x] viết nháp  [x] phản hồi  [x] sửa chữa  [ ] code  [ ] phân tích dữ liệu  [ ] thiết kế đồ hoạ  [x] khác (ghi rõ: đọc đề/template, chọn phạm vi và setup repo).*

Phạm vi sửa chữa là kế hoạch, setup repo và hồ sơ AI, không phải production code hoặc kết quả kiểm thử. Chưa có phân tích dữ liệu usability.

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

[Prompt Log](PromptLog.md) lưu prompt, timestamp và phần output nguồn hiện có; output P-000 bị cắt ở cuối.

### **4\. Phần cụ thể AI đóng góp:**

*Càng cụ thể càng tốt. Ví dụ: 'AI sinh TC01–TC15 ở Mục 3.2; tôi viết lại TC04 và TC11; AI KHÔNG đóng góp vào Mục 1, 2, 4, hoặc AI Critique.'*

AI đề xuất Home / Product Listing & Search (FR-05), với Product Detail (FR-06) là màn hình bổ trợ và luồng kết thúc ở lựa chọn sản phẩm (A-00). AI soạn kế hoạch T00–T07, bổ sung nguồn chính sách và căn cứ đối chiếu rồi rút gọn cấu trúc (A-01). Ngoài hai artifact này, AI hỗ trợ thiết lập repo riêng và chuẩn bị biểu mẫu.

Code SUT giữ nguyên từ nguồn giảng viên. Chưa có checklist, script kiểm thử, dữ liệu người tham gia hoặc kết quả test/usability mới.

### **5\. Cách tôi rà soát / chỉnh sửa / xác minh đầu ra AI:**

*Mô tả phương pháp xác minh (chạy test, kiểm tra spec, hỏi TA, tra RFC, đối chiếu ISTQB syllabus, v.v.).*

Tôi đã review và chấp nhận phạm vi FR-05/FR-06 và PLAN v0.3. Tôi giữ nguyên đề xuất phạm vi; đối với kế hoạch, tôi yêu cầu làm gọn cách trình bày, AI thực hiện chỉnh sửa. Việc bổ sung nguồn/căn cứ và kiểm tra kỹ thuật do AI hỗ trợ thực hiện.

[AI Audit Report](AI_Audit_Report.md) ghi A-00 **VALID**, A-01 **INCOMPLETE — chấp nhận sau khi sửa**. Hai verdict này áp dụng cho artifact chuẩn bị, không phải kết quả execution.

### **6\. Trích dẫn (nếu môn yêu cầu):**

*Môn Kiểm chứng Phần mềm dùng phong cách IEEE. Ví dụ: Anthropic. (2026). AI Tool (e.g., ChatGPT, Claude, Gemini) \[Large language model\]. https\://claude.ai*

[1] FIT@HCMUS, “HW03 – GUI & Usability,” 2026, §5–10, §14–15.

[2] FIT@HCMUS, “HW01 – QA/QC Jobs · 20 Defects · Test a Physical Product,” 2026, “AI Collaboration Protocol” và “Required Templates.”

[3] FIT@HCMUS, “AI-02 AI Audit Report; AI-03 AI Disclosure Form; AI-05 Privacy & Responsible Use Checklist,” AI Policy · Templates 2026 v1.0.

[4] ttbhanh, “eshop-sut,” GitHub. [Trực tuyến]. Có tại: https://github.com/ttbhanh/eshop-sut .

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