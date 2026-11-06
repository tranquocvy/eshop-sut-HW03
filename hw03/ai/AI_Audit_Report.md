**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **AI Audit Report — Mẫu 5 mục cho mỗi Artifact**

*Phụ lục bắt buộc đính kèm cho mọi bài tập có dùng AI (HW\#01–HW\#06, Seminar).*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1\. Thông tin Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | TRẦN QUỐC VỸ |
| **MSSV:** | 23120410 |
| **Lớp / Khoá:** | 23_3 |
| **Mã bài tập (ví dụ HW\#00, HW\#02):** | HW03-AI — GUI & Usability |
| **Ngày làm bài:** | 07/11/2026 |
| **Công cụ AI đã dùng:** | OpenClaw main và worker reviewer — OpenAI gpt-6.1-sol; PDF extractor — OpenAI gpt-6-astra (đối chiếu đề/slide) |
| **Công cụ AI đã dùng:** | [x] Có  [ ] Không |

## **2\. Hướng dẫn (đọc trước khi điền)**

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).  
* Dán nguyên văn prompt — KHÔNG paraphrase.  
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).  
* Gắn nhãn: VALID / INVALID / INCOMPLETE.  
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.  
* Hiển thị bản sửa với phần thay đổi được tô sáng.  
* Hàng mẫu in nghiêng — thay trước khi nộp.

## **3\. Bảng Audit — 1 hàng / artifact**

| (1) Prompt \+ Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB) | (5) Bản SV sửa |
| :---- | :---- | :---- | :---- | :---- |
| **A-01 — Cơ sở lập kế hoạch và kế hoạch HW03**<br>OpenClaw / gpt-6.1-sol.<br>P-000: 12:34:01 04/11/2026 (UTC+07:00).<br>[Prompt nguyên văn](PromptLog.md#p-000--a-01-đọc-đề-và-cơ-sở-lập-kế-hoạch). | [Output tóm tắt đề gốc](PromptLog.md#p-000--a-01-đọc-đề-và-cơ-sở-lập-kế-hoạch), phần cuối bị cắt trong nguồn.<br>P-000 cung cấp cơ sở yêu cầu; file kế hoạch được soạn ở lượt sau.<br>Bản được chấp nhận: [PLAN v0.3](../PLAN.md). | **INCOMPLETE** | Chấp nhận sau khi sửa. HW03 §5–7 yêu cầu phạm vi, GUI/usability và cross-platform; §14–15 quy định hồ sơ và rubric. Bản kế hoạch đã được bổ sung nguồn chính sách, làm rõ căn cứ đối chiếu rồi rút gọn cấu trúc; sinh viên xác nhận chấp nhận bản cuối trong trao đổi ngày 05/11/2026. | AI bổ sung **nguồn AI-05/AI-06 và căn cứ đối chiếu đề** ở v0.2; theo góp ý sinh viên **rút gọn cấu trúc** ở v0.3. [Bản cuối](../PLAN.md) giữ FR-05/FR-06 và T00–T07. |
| **A-00 — Lựa chọn phạm vi**<br>OpenClaw / gpt-6.1-sol.<br>P-002: 13:05:55 04/11/2026 (UTC+07:00).<br>[Prompt nguyên văn](PromptLog.md#p-002--a-00-lựa-chọn-phạm-vi). | [Output nguyên văn](PromptLog.md#p-002--a-00-lựa-chọn-phạm-vi).<br>Màn hình chính Home / Product Listing & Search (FR-05), bổ trợ Product Detail (FR-06); kết thúc luồng ở lựa chọn sản phẩm. | **VALID** | Giữ nguyên đề xuất phạm vi sau review. HW03 §5 cho chọn màn hình và luồng end-to-end; §6.1 yêu cầu đủ IA-01–04. Phạm vi có UI, form tìm kiếm, navigation và feedback để thiết kế checklist; tiêu chí hoàn thành scenario sẽ được cụ thể hoá từ dữ liệu SUT. | Không sửa nội dung phạm vi; giữ nguyên [PLAN §1](../PLAN.md#1-phạm-vi). |
| **A-02 — Thiết kế GUI checklist**<br>OpenClaw main / worker reviewer, gpt-6.1-sol; PDF extractor gpt-6-astra.<br>P-004: 2026-11-05 20:54:48 (UTC+07:00).<br>[Prompt và output nguồn](PromptLog.md#p-004--a-02-tạo-gui-checklist). | [Bản AI đầu v0.1 — 48 mục](PromptLog.md#a-02-initial).<br>Phản hồi P-004 báo v0.2 sau AI review; nguồn lịch sử có cờ cắt.<br>[Bản hiện hành v0.4 — 50 mục](../gui/GUI_Checklist.md). | **INCOMPLETE** | Chấp nhận sau sửa. HW03 §6 Task 1 yêu cầu >40 mục và IA-01–04; S13 tr.16–19 hướng dẫn checklist, navigation và EP/BVA/state. Bản đầu thiếu kiểm tra dấu `*` theo FR-06/22 và badge theo FR-23; GUI-026 có nguy cơ nhầm nút không hoạt động với validation. Sinh viên xác nhận review v0.3 ngày 07/11/2026 và đề nghị giữ hai mục; v0.4 chỉ thêm lý do. Verdict đánh giá thiết kế, không chứng nhận execution hoặc toàn bộ nghĩa vụ bài nộp. | **AI sửa** oracle, điều kiện/context, keyboard và traceability; **worker AI đề xuất GUI-049**, **main AI thêm GUI-050**. AI khảo sát UI rồi làm rõ **GUI-012**. Sinh viên review và chọn giữ; AI diễn đạt lý do trong [§5](../gui/GUI_Checklist.md#5-lý-do-bổ-sung-gui-049-và-gui-050). Không khai hai mục là sinh viên tự phát hiện. |

## **4\. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 3 | 100% |
| **VALID (đúng, dùng nguyên)** | 1 | 33,33% |
| **INVALID (sai; loại bỏ)** | 0 | 0% |
| **INCOMPLETE (chấp nhận sau khi sửa)** | 2 | 66,67% |

## **5\. Kết luận — Khi nào nên / không nên dùng AI?**

Trong ba artifact đã audit, đề xuất phạm vi được giữ nguyên; kế hoạch và checklist được chấp nhận sau sửa. Checklist ban đầu 48 mục đã phủ bốn nhóm nhưng vẫn thiếu đối chiếu dấu trường bắt buộc và badge; một số oracle/điều kiện cần làm rõ. AI reviewer và main AI phát hiện, tích hợp các sửa đổi; sinh viên xác nhận review và đề nghị giữ GUI-049/050. AI hữu ích để mở rộng độ phủ và đối chiếu nguồn, nhưng việc review bởi AI không tự chứng minh phần bổ sung độc lập của sinh viên hoặc kết quả thực thi. Bản hiện hành 50 mục vẫn là thiết kế; không có Pass/Fail hoặc dữ liệu usability mới. PromptLog đi kèm là bản trích tuyển ba tương tác, không phải log đầy đủ theo HW03 §9.

## **6\. Mandatory Disclosure (dán nguyên văn)**

*"\[Test case / script / dataset / báo cáo\] này được sinh phiên bản đầu bởi \[tên công cụ AI\]; tôi đã rà soát và chỉnh sửa \[phần X\], bổ sung \[edge case Y, Z\]; \[phần W\] do tôi tự viết. AI Audit Report chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."*

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