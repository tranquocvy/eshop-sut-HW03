**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **Bảng Kiểm Quyền Riêng tư & Sử dụng AI Có Trách nhiệm**

*Thực hiện bảng kiểm này TRƯỚC KHI nộp bất kỳ bài tập có dùng AI.*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC13003 Kiểm chứng Phần mềm.*

## **1\. Trước khi dùng AI**

* [ ] Đã xác nhận Cấp độ AI cho bài tập này.  
* [ ] Dùng tài khoản Claude Pro tự chọn (không phải tài khoản cá nhân).  
* [ ] Đã đọc Thoả thuận AI của môn học.  
* [ ] Hiểu rõ artifact nào KHÔNG được sinh bằng AI.

## **2\. Trong khi dùng AI**

* [ ] Không nhập dữ liệu cá nhân của bạn, khách hàng, bệnh nhân.  
* [ ] Không paste nguyên si tài liệu có bản quyền lên AI.  
* [ ] Không paste code công ty / code open-source giới hạn license.  
* [ ] Đã ghi mọi prompt \+ phản hồi AI vào prompt\_log.md có timestamp.

## **3\. Trước khi nộp bài**

* [ ] Mọi artifact AI sinh đã được gắn tag trong AI Audit Report.  
* [ ] Mọi trích dẫn AI đã được xác minh (nguồn thực sự tồn tại).  
* [ ] Mọi code AI sinh đã được thực thi và test.  
* [ ] AI Critique 200–300 chữ đã có trong báo cáo.  
* [ ] Đoạn Mandatory Disclosure ở cuối báo cáo.  
* [x] Đính kèm AI Use Disclosure Form.  
* [ ] Sẵn sàng cho vấn đáp ngẫu nhiên 5–7 phút tuần kế nộp bài.

**Căn cứ thiết kế, pilot và lượt Task 1 Windows Chromium**

| Nội dung | Bằng chứng / trạng thái thực tế |
| :---- | :---- |
| Công cụ AI | OpenClaw main/worker reviewer / OpenAI gpt-6.1-sol và PDF extractor / gpt-6-astra. Mục “Claude Pro” trong mẫu không áp dụng cho các công cụ này; HW03 §8 cho phép chọn công cụ AI bất kỳ. |
| Hồ sơ artifact | [Audit](AI_Audit_Report.md): A-00 VALID; A-01, A-02 và A-03 INCOMPLETE (chấp nhận sau sửa). Checklist đầu 48 mục, hiện hành v0.5 có 52 mục. AI review/sửa và phát hiện GUI-049/050; sinh viên đã review, chọn giữ hai mục đó và bổ sung GUI-051/052 cùng lý do AI bỏ sót. A-02 INCOMPLETE vì bản AI được sửa/bổ sung, không phải vì thiếu review/bổ sung của sinh viên. A-03 ghi skill/harness trong phạm vi pilot; A-04 INCOMPLETE ghi execution/report Task 1 và giới hạn coverage/log. 5 artifact có verdict, không chứng nhận toàn bộ bài nộp. |
| Log tương tác | [PromptLog](PromptLog.md) là bản trích tuyển 6 tương tác P-000/P-002/P-004/P-005/P-006/P-007, không phải toàn bộ lịch sử theo HW03 §9. P-000/P-005 thiếu cuối; P-004/P-006/P-007 có giới hạn nguồn ghi tại từng mục. Chưa xác nhận log đủ mọi prompt/phản hồi. |
| Code và thực thi | Không sửa code SUT. AI tạo launcher READONLY, skill/harness và test pilot riêng; không tải initializer/seed. Pilot 13 instance/7 ID trên Windows Chromium desktop có 3 Pass, 3 Fail, 5 Blocked, 2 needs-review; 44/44 unit/DOM regression checks đạt. Đã xử lý lượt Task 1 đủ 52 ID/122 biến thể (119 có UI observations), effective 75 Pass/31 Fail/15 Blocked/1 needs-review. Blocked và applicability chưa được coi là đạt; chưa hoàn tất Task 3 cross-platform hoặc phiên usability. |
| AI Critique và Mandatory Disclosure | Đã xuất bộ report Task 1 Markdown/HTML/PDF và Excel; AI Critique 200–300 từ và Mandatory Disclosure vẫn cần hoàn thiện đúng trách nhiệm tác giả, không tự ký hay giả nhận xét cá nhân của sinh viên. |
| Disclosure | [AI_Disclosure.md](AI_Disclosure.md) đi cùng hồ sơ này; chữ ký chưa điền. |
| Evidence pilot | Raw screenshot/trace/video/native report được giữ local-only; chưa bảo đảm redacted để export. Sinh viên xác nhận evidence từng GUI đầy đủ ngày 07/11/2026. Trong snapshot pilot lịch sử, hai instance GUI-032 còn needs-review; không dùng trạng thái lịch sử này thay kết quả full run hiện hành; xác nhận evidence không thay kết luận Tab-order hoặc chứng nhận tính xác thực từ bytes đơn lẻ. |
| Dữ liệu cá nhân | Hồ sơ hiện có họ tên, MSSV và lớp của sinh viên; chưa có dữ liệu người tham gia usability. |

## **4\. Cam đoan Cuối cùng**

*Trách nhiệm cuối cùng về độ chính xác, tính nguyên bản, và liêm chính của bài nộp này thuộc về tôi. Mọi việc dùng AI không khai báo đều bị coi là vi phạm liêm chính học thuật.*

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