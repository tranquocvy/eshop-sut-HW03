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
| **Ngày làm bài:** | 04–10/11/2026; đối chiếu hồ sơ 10/11/2026 |
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
| **A-02 — Thiết kế GUI checklist**<br>OpenClaw main / worker reviewer, gpt-6.1-sol; PDF extractor gpt-6-astra.<br>P-004: 2026-11-05 20:54:48 (UTC+07:00).<br>[Prompt và output nguồn](PromptLog.md#p-004--a-02-tạo-gui-checklist). | [Bản AI đầu v0.1 — 48 mục](PromptLog.md#a-02-initial).<br>Phản hồi P-004 báo v0.2 sau AI review; nguồn lịch sử có cờ cắt.<br>[Bản hiện hành v0.5 — 52 mục](../gui/GUI_Checklist.md). | **INCOMPLETE** | Chấp nhận sau sửa. HW03 §6 Task 1 yêu cầu >40 mục và IA-01–04; S13 tr.16–19 hướng dẫn checklist, navigation và EP/BVA/state. Bản đầu thiếu kiểm tra dấu `*` theo FR-06/22 và badge theo FR-23; GUI-026 có nguy cơ nhầm nút không hoạt động với validation. Sinh viên đã review, giữ GUI-049/050 và bổ sung **GUI-051 (phục hồi sau kết quả rỗng)**, **GUI-052 (HTTP 500)** cùng lý do AI bỏ sót ngày 07/11/2026. **INCOMPLETE vì bản AI cần sửa và được sinh viên bổ sung**, không phải vì sinh viên chưa review/bổ sung. Verdict đánh giá thiết kế, không chứng nhận execution hoặc toàn bộ nghĩa vụ bài nộp. | **AI sửa** oracle, điều kiện/context, keyboard và traceability; **worker AI đề xuất GUI-049**, **main AI thêm GUI-050**. AI khảo sát UI rồi làm rõ **GUI-012**. **Sinh viên review** và chọn giữ GUI-049/050; AI diễn đạt lý do trong [§5](../gui/GUI_Checklist.md#5-lý-do-bổ-sung-gui-049-và-gui-050). **Sinh viên bổ sung GUI-051/052 và lý do AI bỏ sót** trong [§6](../gui/GUI_Checklist.md#6-hai-mục-sinh-viên-đề-xuất-sau-review--gui-051-và-gui-052); AI gán ID/chuẩn hóa và làm rõ điều kiện test. Không chuyển nguồn phát hiện GUI-049/050 từ AI sang sinh viên. |
| **A-03 — Agent Skill thực thi GUI và harness/pilot**<br>OpenClaw main và worker author/reviewer / gpt-6.1-sol.<br>[P-005 — khảo sát công cụ](PromptLog.md#p-005--skill-gui-khảo-sát-và-chọn-công-cụ), [P-006 — dependency](PromptLog.md#p-006--skill-gui-dependency-và-pilot), [P-007 — triển khai](PromptLog.md#p-007--skill-gui-tạo-skill-harness-và-pilot-local). | [Skill source](../skills/gui-checklist-execution-evidence/SKILL.md), [adapter pilot](../skills/gui-checklist-execution-evidence/references/pilot-adapter.md), [harness source](../tools/gui-harness/README.md).<br>Output P-005 bị cắt; P-007 là tổng kết sau sửa, không phải snapshot source AI ban đầu đầy đủ.<br>Pilot schema 0.2: run `2026-11-07T04-14-40-565Z`. | **INCOMPLETE** | **Chấp nhận phạm vi pilot sau sửa.** Sinh viên xác nhận ngày 07/11/2026 đã kiểm và thấy evidence từng GUI đầy đủ; không suy thành review toàn bộ source hoặc kết luận Pass cho hai instance GUI-032.<br>HW03 §7: skill tái sử dụng; kiểm chứng theo [contract](../skills/gui-checklist-execution-evidence/references/contract.md) và adapter thực tế, không suy full conformance từ file skill.<br>44/44 unit/DOM regression checks; pilot 13 instance/7 ID Windows Chromium: 3 Pass, 3 Fail, 5 Blocked, 2 needs-review. Không full checklist/≥3 nền tảng; chưa có bằng chứng reuse flow khác hoặc video demo. Kiểm hash/header không thay human review hay chứng nhận authenticity. | Sinh viên góp ý **dependency theo prerequisite** và chọn Playwright; AI triển khai. **AI sửa** launcher cwd/Tailwind và thêm render gate; sửa feedback oracle, explicit oracle provenance, technical/dependency block và verifier schema/artifact sau tự kiểm/AI review. Run lỗi launcher bị loại, run mới giữ riêng; không sửa SUT để Pass. Không khai code AI sửa là sinh viên tự viết. |

### A-04 — Thực thi và tổng hợp kết quả Task 1 (08/11/2026)

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do | (5) Bản sửa và xác minh |
|---|---|---|---|---|
| OpenClaw main/worker / gpt-6.1-sol; đối chiếu đề bằng PDF extractor gpt-6-astra. Nguồn prompt/output nguyên văn giai đoạn này chưa được nhập đầy đủ vào PromptLog; không dựng lại lịch sử hoặc coi mô tả này là prompt nguyên văn. | Adapter local full run, raw/native evidence; [report Task 1 và Excel](../gui/task1/START-HERE.md), [findings](../gui/task1/findings/README.md). | **INCOMPLETE** | HW03 §6 yêu cầu execution và bug report; §14 yêu cầu Excel/test summary và Markdown/PDF. Native 122 passed chỉ xác nhận collection, không phải GUI acceptance. Raw 44/26/14/38 được rà lại thành effective 75/31/15/1; 15 Blocked và 1 applicability pending chưa được kiểm chứng đầy đủ. | AI rà ảnh/DOM/network và dependency, sửa false Pass bằng lớp assessment dẫn xuất, không ghi đè ảnh/result gốc. Review kiểm thủ công GUI-033 Home/Detail được khai riêng. Bộ xuất chỉ có Task 1 Windows Chromium, không chứng nhận Task 3 hoặc usability người thật. Không khai toàn bộ sửa kỹ thuật của AI là sinh viên tự viết. |

### A-05–A-07 — Bổ sung Task 2 và revision câu hỏi (09/11/2026)

Bổ sung theo lịch sử truy xuất được và artifact hiện hành; không coi đây là snapshot đầy đủ của mọi bản AI đầu. Công cụ: OpenClaw main/worker, OpenAI gpt-6.1-sol. Các kiểm chứng dưới đây do AI thực thi, không gán thành code hoặc kiểm thử do sinh viên tự làm.

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do / căn cứ | (5) Bản sửa và xác minh |
|---|---|---|---|---|
| **A-05 — Thiết kế đánh giá và instruments.** Log chuẩn bị chưa đủ nguyên văn; xem [sổ đối chiếu](PromptLog.md#doi-chieu-20261109). | [Thiết kế](../usability/EVALUATION-DESIGN.md), [protocol](../usability/PROTOCOL.md), [instruments](../usability/INSTRUMENTS.md), [pilot](../usability/PILOT.md), [analysis](../usability/ANALYSIS.md). | **INCOMPLETE** | HW03 §6: moderated usability, scenario theo mục tiêu, SUS hoặc UEQ-S và probes clarity/recovery/speed/trust. Có tài liệu không chứng minh đủ pilot hoặc bảy phiên thật. Bản Việt SUS là bản làm việc AI hỗ trợ, chưa xác thực tâm trắc. | AI viết protocol, mẫu và hướng dẫn scoring; giữ **SUS 10 câu**, không triển khai UEQ-S. Câu hỏi mở ban đầu có giả định vấn đề xảy ra và tăng gánh nặng trả lời; được sửa ở A-07. Không tự điền câu trả lời, notes quan sát hay thành công nhiệm vụ. |
| **A-06 — Portal, dịch vụ riêng, runtime và recorder.** [P-008](PromptLog.md#p-008). Prompt triển khai/worker chưa được chép đầy đủ. | [Contract](../tools/usability-study/CONTRACT.md), [kiểm chứng](../tools/usability-study/VERIFICATION.md), source portal/server/scripts/tests trong usability-study. | **INCOMPLETE** | HW03 §6 yêu cầu dữ liệu người thật có điều phối, consent và evidence; công cụ hỗ trợ không thay phương pháp hoặc chứng minh participant hợp lệ. Kiểm bounded metadata video không phải codec validation hay chứng minh nội dung màn hình. | AI xây participant/moderator tách listener, private storage, draft/submitted, provenance snapshot, DRAFT export và screen-only recorder. **Sửa startup bằng run-* mới**, không sửa ACL; sửa **blob CSP, phase contamination/autosave, failed withdrawal và failed-draft retry loop**. Review AI độc lập có phát hiện và regression, không phải human review toàn bộ source. 62 fingerprint SUT giữ nguyên trong các lượt được ghi. Các lượt fail được giữ riêng. |
| **A-07 — Probes v0.4 và trang xem thử.** [P-009](PromptLog.md#p-009); output là trích đoạn xác minh được, không toàn bộ turn. | [Probes](../tools/usability-study/portal/probes-v04.mjs), [compact UI](../tools/usability-study/portal/compact-view.jsx), [instrument](../usability/INSTRUMENTS.md), [tests](../tools/usability-study/tests/probes-v04.test.mjs). Preview tại route /question-preview trong portal/src.jsx. | **INCOMPLETE** | HW03 §6 và nguồn SUS đã dẫn trong INSTRUMENTS. Probes là câu tự soạn, không phải SUS/UEQ-S và không cộng điểm SUS. Phiên bản câu chữ phải gắn với snapshot, không áp câu mới lên raw cũ. | **Giữ SUS, thay bốn probes** bằng Có/Không/Không chắc/Bỏ qua, không chọn sẵn; follow-up tùy nhánh và không bắt giải thích. Text ẩn không gửi; recoveryObserved là mapping tự báo, không phải quan sát moderator. **54/54 node:test**, compact v0.4 **10 nhóm**, v0.3 **9 nhóm** đạt theo evidence; report synthetic 10 headings/12 tables, 92,164 bytes, không overflow, chưa đọc mọi trang. Sửa assertion test lấy snapshot sai vị trí rồi rerun; không sửa raw để đạt. Preview build và 4 targeted tests đạt, browser kiểm 4 probes/10 SUS, reset và 0 API nghiên cứu. Lỗi syntax server preview đầu đã sửa; native picker/participant off-host vẫn không được chứng nhận từ các test này. |

### A-08 — Biên bản và kiểm nhận pilot nội bộ v0.4 (10/11/2026)

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do / căn cứ | (5) Bản sửa và xác minh |
|---|---|---|---|---|
| OpenClaw main / OpenAI gpt-6.1-sol; đối chiếu đề bằng PDF extractor gpt-6-astra. Đây là bản ghi công việc kỹ thuật, chưa có cặp prompt/output nguyên văn đầy đủ; không coi mô tả này là prompt. | [Biên bản Markdown/PDF và receipt](../usability/pilot/2026-11-10-internal-v04/README.md), commit 8fd1147; export đầy đủ giữ riêng ngoài Git. | **INCOMPLETE** | HW03 §6: pilot và refine trước phiên chính; §12: commit theo bước/session; §14: report Markdown/PDF và session evidence. Pilot nội bộ không thay bảy người ngoài lớp. Chưa có observation/timing hoặc review toàn bộ video để xác nhận K1, findings hoặc freeze. | AI kiểm cấu trúc bản nộp: **10 SUS, 4 trường probes, 1 WebM**; tính lại SUS bằng script local khớp export mà không đưa raw/điểm cá nhân vào context AI. Kiểm hash/metadata: **1 video, 0 audio**, decode đoạn ngắn đạt; không chứng minh toàn bộ nội dung đúng task. Xuất JSON/CSV/Markdown/HTML/PDF riêng; PDF private 10 mục, không tràn ngang, chưa kiểm tay mọi trang. Biên bản Git không có raw answers/video/contact/invite. **Không tự đánh reviewed/verified/frozen**, không sinh notes, thời gian hoặc severity còn thiếu. |

## **4\. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.

Bảng Mục 3 có **9 artifact A-00–A-08**, đều có verdict. A-04 còn giới hạn coverage/applicability và chưa đủ prompt/output nguyên văn; việc có verdict không thay nghĩa vụ log đầy đủ. Verdict A-03 đánh giá bản AI đầu phải sửa và bản pilot hiện hành được chấp nhận trong phạm vi đã kiểm, không chứng nhận toàn bộ nghĩa vụ bài nộp.

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 9 | 100% |
| **VALID (đúng, dùng nguyên)** | 1 | 11,11% |
| **INVALID (sai; loại bỏ)** | 0 | 0% |
| **INCOMPLETE (chấp nhận sau khi sửa, hoặc còn giới hạn ghi rõ)** | 8 | 88,89% |

## **5\. Kết luận — Khi nào nên / không nên dùng AI?**

Trong các artifact đã audit, đề xuất phạm vi được giữ nguyên; kế hoạch, checklist và skill/harness trong phạm vi pilot được chấp nhận sau sửa. Checklist ban đầu 48 mục đã phủ bốn nhóm nhưng vẫn thiếu đối chiếu dấu trường bắt buộc và badge; một số oracle/điều kiện cần làm rõ. AI reviewer và main AI phát hiện, tích hợp các sửa đổi kỹ thuật và GUI-049/050; sinh viên đã review, chọn giữ hai mục này, đồng thời bổ sung GUI-051/052 cùng lý do AI bỏ sót. AI chỉ chuẩn hóa phần bổ sung của sinh viên vào checklist. A-02 giữ INCOMPLETE — chấp nhận sau sửa/bổ sung, vì bản AI ban đầu chưa bao phủ đầy đủ các trường hợp được phát hiện qua cả AI review và sinh viên review. Verdict A-02 chỉ đánh giá thiết kế checklist 52 mục; phần review/bổ sung của sinh viên đã được ghi nhận, không chứng nhận execution hoặc skill/harness. A-03 là INCOMPLETE vì bản đầu có lỗi launcher và thiếu safeguards oracle/verifier; AI đã sửa, kiểm thử lại và sinh viên xác nhận evidence pilot ổn ngày 07/11/2026. Việc xác nhận này không biến hai instance needs-review thành Pass, không chứng nhận toàn bộ source, setup một lệnh, reuse flow khác hoặc full cross-platform. PromptLog đi kèm hiện có tám tương tác P-000/P-002/P-004/P-005/P-006/P-007/P-008/P-009 và sổ bằng chứng A-04–A-07; vẫn không phải log đầy đủ theo HW03 §9. P-005–P-007 ghi thêm quá trình tạo skill/harness và pilot 13 instance/7 ID; phần A-03 chỉ ghi GUI pilot, không ghi dữ liệu usability người thật. Lượt thử nội bộ Task 2 được tách khỏi hồ sơ này và không tính thay mẫu chính.

**Cập nhật 09/11/2026:** A-05–A-07 đều INCOMPLETE trong phạm vi nêu trên. Hồ sơ không kết luận Task 2 hoặc bảy phiên chính hoàn tất. Log bổ sung hai tương tác kỹ thuật P-008/P-009 và sổ bằng chứng; vẫn là trích tuyển, không phải toàn bộ lịch sử. Không chuyển lỗi/sửa của AI thành đóng góp tự viết của sinh viên.

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