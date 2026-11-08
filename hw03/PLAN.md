# HW03 — Kế hoạch thực hiện v0.4

## 1. Phạm vi

- **Màn hình chính:** Home / Product Listing & Search (FR-05).
- **Màn hình bổ trợ:** Product Detail (FR-06), header/navigation liên quan.
- **Luồng usability:** tìm sản phẩm theo nhu cầu → đọc chi tiết → lựa chọn sản phẩm phù hợp. Kết thúc ở lựa chọn, không gồm đặt hàng.
- Không mở rộng luồng sang đăng ký/đăng nhập, OTP, giỏ hàng, coupon hoặc checkout. Control hiện trên màn hình vẫn được xét trong GUI theo phạm vi ghi rõ.
- Chọn sản phẩm và tiêu chí scenario sau khi kiểm tra dữ liệu thật; chưa tự đặt ví dụ thành requirement.
- Màn hình chính/flow phải không trùng thành viên nhóm; sinh viên xác nhận việc đăng ký với nhóm.

## 2. Nguồn và baseline

- Đề gốc: 2026.HW03.GUI Usability_En.pdf, tại thư mục HW03 cha repo; §5–7 (scope/tasks/skills), §9–12 (AI/commit), §14–15/17 (nộp/rubric/quy định).
- Slide `S13_GUI Testing & Usability Testing.pdf`: đã cung cấp tại thư mục HW03 cha repo; đã đọc qua ba dải trang 1–20, 21–40, 41–55. Phương pháp thiết kế GUI dựa trên tr.7–8, 11–20, 22–28.
- [README/spec SUT](../README.md), [API specification](../api_specification.md). Source code chỉ cho biết triển khai, không tự trở thành expected.
- Baseline nguồn https://github.com/ttbhanh/eshop-sut : commit 85af3ba875c88283615e22cb108f13e2fccaf0e9.
- Repo riêng https://github.com/tranquocvy/eshop-sut-HW03 ; origin là repo này, upstream là nguồn giảng viên. Giữ HW02 riêng, không sửa production code để làm test pass.

## 3. Thứ tự làm bài

| ID | Sản phẩm / phạm vi | Điều kiện hoàn tất | Trạng thái |
|---|---|---|---|
| T00 | Baseline, kế hoạch và hồ sơ AI | Repo riêng; nguồn/baseline rõ; khai AI đúng thực tế | Đã có repo, PLAN và biểu mẫu AI Markdown. Hồ sơ đã cập nhật tới A-04; log đầy đủ và chữ ký chưa hoàn thiện, thuộc T07. |
| T01 | Thiết kế GUI checklist — phần thiết kế Task 1 | >40 mục, đủ IA-01–04; giữ bản AI đầu; review và bổ sung có truy vết | **Hoàn tất thiết kế:** [52 mục v0.5](gui/GUI_Checklist.md), bản AI đầu 48 mục được bảo toàn. GUI-049/050 do AI đề xuất; GUI-051/052 và lý do AI bỏ sót do sinh viên đề xuất. Kết quả execution theo T02, không gộp vào thiết kế. |
| T02 | Thực thi GUI và báo lỗi — Task 1; mở rộng cross-platform — Task 3 | Task 1: execution, Notes/ảnh Failed, report/Excel và bug Issues. Task 3: lặp lại theo ≥3 nền tảng, evidence riêng | **Task 1:** lượt chạy/review và xuất local đã xong; 52 ID/122 biến thể, 119 biến thể/51 ID có UI observations. Effective **75 Pass / 31 Fail / 15 Blocked / 1 needs-review**. [Report/Excel](gui/task1/START-HERE.md), [19 nhóm findings và ảnh](gui/task1/findings/README.md) (12 R, 7 H). **Chưa đóng trọn Task 1:** đã đăng [19 Issues có screenshots](https://github.com/tranquocvy/eshop-sut-HW03/issues); 15 Blocked và GUI-036 Detail applicability giữ nguyên. **Task 3:** chưa hoàn tất ≥3 nền tảng; không tính hai viewport là hai nền tảng. |
| T03 | Bộ chuẩn bị usability và pilot — Task 2 | Mục tiêu, scenario theo goal, SUS/UEQ-S, probe clarity/recovery/speed/trust; pilot người thật và sửa | Chưa có bộ bàn giao/pilot người thật được xác minh; không coi pilot GUI tự động là usability pilot. |
| T04 | 7 phiên usability — Task 2 | Đúng 7 người ngoài lớp, consent, phiên thật, notes và thang đo; ghi riêng từng phiên | Chưa có phiên usability người thật được ghi nhận; không sinh dữ liệu thay người tham gia. |
| T05 | Phân tích usability — Task 2 | Tính điểm từ dữ liệu thật; pain points/severity; phân biệt bug/design; review và báo bug thật | Chưa có dữ liệu 7 phiên để phân tích; findings GUI Task 1 không thay kết quả usability. |
| T06 | Agent Skill và demo — §7 | Skill có source và kiểm chứng dùng thật; video đầu-cuối/YouTube link | **Đã có** [skill](skills/gui-checklist-execution-evidence/SKILL.md), [harness pilot](tools/gui-harness/README.md), pilot và lượt full Task 1 bằng adapter local; kiểm tra hiện hành **44/44 unit/DOM** đạt, validator 10 resource links đạt. Adapter đi kèm vẫn là pilot cố định, không khai đã tích hợp full-run adapter. **Còn:** video/YouTube demo và bằng chứng reuse flow khác chưa có. |
| T07 | Hồ sơ cuối và ZIP — §14 | Hợp nhất các task; AI Critique, Audit Markdown/PDF, self-assessment, Git log cuối bài, kiểm giải nén | **Chưa hoàn tất bài.** Task 1 đã có report Markdown/HTML/PDF và Excel. Audit/Disclosure/Privacy Markdown đã cập nhật; PromptLog vẫn là trích tuyển, chưa đủ lịch sử. Chưa có report toàn bài, AI Critique hoàn chỉnh, Audit PDF, self-assessment cuối, Git log cuối bài hoặc ZIP. |


**Phân biệt mã:** T00–T07 là bước nội bộ của PLAN, không phải số Task trong đề. Task 1 của đề = thiết kế và thực thi/báo lỗi GUI (T01 + phần Task 1 của T02); Task 2 = usability (T03–T05); Task 3 = cross-platform (phần còn lại của T02). Giữ nguyên mã T00–T07. Task 3 tái sử dụng quy trình Task 1 nhưng có kết quả và capture riêng. T03 có thể chuẩn bị khi flow/data đã được xác minh; pilot phải trước bảy phiên chính. Skill được phát triển cùng task thực tế, không dựng lại demo ở cuối.

## 4. Checklist tiến độ theo giai đoạn

### 4.1. Thiết kế — T01

- [x] Đọc slide/spec, xác định screen/state/viewport và expected có căn cứ.
- [x] Kiểm tra SUT/data riêng tại baseline, không sửa code sản phẩm. Đã đọc database read-only và khảo sát UI render trên bản sao; backend mở database hiện có READONLY, không chạy lại initializer/seed.
- [x] Tạo bản AI đầu **ít nhất 41 mục**, không lặp, phủ IA-01–04: UI standards, Forms, Navigation, Feedback/state. Bản đầu có 48 mục.
- [x] Mỗi mục có ID, IA, màn hình/trạng thái, điều kiện/thao tác và expected quan sát được.
- [x] AI tự kiểm tra và worker pre-review; sinh viên xác nhận đã đọc/kiểm tra checklist, giữ GUI-049/050 và bổ sung GUI-051/052 ngày 07/11/2026. Giữ riêng nguồn sửa/bổ sung của AI và sinh viên.
- [x] Sinh viên bổ sung GUI-051 (phục hồi từ tìm kiếm rỗng sang có dữ liệu) và GUI-052 (response HTTP 500), kèm giải thích AI bỏ sót theo HW03 §6; xem [Checklist §6](gui/GUI_Checklist.md#6-hai-mục-sinh-viên-đề-xuất-sau-review--gui-051-và-gui-052). GUI-049/050 vẫn được ghi đúng là do AI phát hiện; AI chỉ chuẩn hóa hai mục sinh viên gửi vào bảng.
- [x] Giữ bản đầu 48 mục trong PromptLog (A-02-initial), ghi thay đổi theo phiên bản và đúng nguồn phát hiện/người sửa trong Audit/Disclosure.

### 4.2. Execution và bộ bàn giao Task 1 — T02

- [x] Kiểm tra Excel checklist 52 ID và execution 122 biến thể từ kết quả thực tế; không chuyển Blocked/needs-review thành Passed/Failed. Đã kiểm ZIP/XML và số dòng; chưa kiểm bằng ứng dụng Excel.
- [x] Xuất report Markdown/HTML/PDF, Notes và ảnh Failed; map 31 biến thể Fail vào 19 nhóm findings và issue drafts. Đã kiểm render HTML và checksum ảnh. Report Markdown/PDF đã hợp nhất trực tiếp đủ 19 nhóm, map 31 Fail và 20 ảnh nguồn; PDF render qua Markdown parser, 36 trang, đã kiểm text extraction và ảnh trang mẫu (không tuyên bố đã nhìn mọi trang).
- [x] Đã đăng 19 nhóm findings trên GitHub Issues, mỗi Issue có screenshots nhúng; URL đã đồng bộ vào report/findings local. Chỉ ảnh evidence được commit/push; report và các phần còn sửa chưa publish.
- [x] Giữ riêng raw/native, kết quả sau review và xác nhận kiểm thủ công; GUI-033 Home/Detail Pass theo kiểm thủ công được báo lại, không phải lượt chạy mới của agent.

### 4.3. Giới hạn còn mở của Task 1

- [x] Đã ghi rõ 15 Blocked trong report/Excel; không chuyển thành Passed/Failed giả: zoom thật GUI-015 (2), IME thật GUI-017 (1), prerequisite validation GUI-026/027 (10), state GUI-050 (1), message-disappearance GUI-051 (1).
- [ ] Kiểm chứng bổ sung các phần Blocked khi có capability/state phù hợp; các trạng thái hiện vẫn Blocked, không tự chạy lại hoặc sửa SUT để lấy Pass.
- [ ] Chốt applicability GUI-036 Detail khi navbar không có mục Detail; không dùng việc bấm sản phẩm vào Detail làm bằng chứng selected-state navbar.
- GUI-033 Home/Detail đã Pass theo xác nhận kiểm thủ công; không còn trong queue cần review. GUI-051 recovery sang iPhone đạt riêng, không suy message-disappearance đạt.
- Lượt chạy kết thúc không đồng nghĩa tất cả assertion đã thực thi đầy đủ hoặc toàn bộ Task 1 đã đủ nghĩa vụ nộp bài.

### 4.4. Skill và hồ sơ cuối — T06/T07

- [x] Có skill/harness source và đã kiểm unit/DOM 44/44; giữ rõ giới hạn adapter pilot so với adapter full run local.
- [ ] Bổ sung video demo skill đầu-cuối và YouTube link; không coi trace/video test tự động là demo đã nộp.
- [ ] Hoàn thiện log AI, AI Critique, Mandatory Disclosure và các biểu mẫu theo thực tế; không tự ký hoặc dựng lịch sử thiếu.
- [ ] Hợp nhất report Task 1/2/3 và self-assessment khi các task liên quan hoàn tất; PDF Task 1 không thay report cuối toàn bài.
- [ ] **Chỉ xuất Git commit log khi hoàn thiện bài, chuẩn bị nộp.** Không có file Git log trong bộ Task 1 hiện hành; không tạo lại lịch sử giả.
- [ ] Đóng ZIP và kiểm giải nén ở bước cuối; chưa đóng gói bài hiện tại.

## 5. Điều kiện thực thi và evidence

- GUI: Pass/Fail từng mục; Failed có Notes và ảnh. Bug có Markdown + GitHub Issue kèm ảnh.
- Cross-platform: chạy checklist trên ≥3 nền tảng; dự kiến Chrome + Firefox + Safari/Android Chrome, chỉ chốt khi có truy cập thật. Expo Go điện thoại thật có thể thay một nền tảng theo đề, nhưng không mặc nhiên tương đương checklist web.
- **Task 3 riêng:** BrowserStack/LambdaTest trial được ưu tiên; phương án thay thế phải đúng điều kiện đề. Ảnh cross-platform thể hiện môi trường/localhost và đáp ứng cả email sinh viên overlay (§6), MSSV/họ tên (§11). Không áp các điều kiện capture riêng Task 3 lên mọi ảnh Task 1.
- Usability: scenario theo goal, SUS/UEQ-S (hoặc thang tự thiết kế có justification), probe clarity/error recovery/speed/trust; pilot rồi 7 người ngoài lớp, consent và phản hồi thật.
- Không đưa liên hệ/recordings lên GitHub hoặc AI nếu chưa có đồng ý/phạm vi xử lý phù hợp. Không sinh giả participant, feedback, execution hoặc ảnh.

## 6. Hồ sơ và tự đánh giá

| Hạng mục | Điểm |
|---|---:|
| GUI Checklist | 30 |
| Usability Evaluation | 40 |
| Cross-platform | 20 |
| Agent Skills | 10 |
| Tổng | 100 |

- Báo cáo chính Markdown + PDF; bug report/ảnh Issues; Excel checklist/test summary.
- Evidence usability: scenario, observation notes, scale responses, severity findings, recordings khi có và bảng 7 người.
- Ảnh cross-platform; skill/video demo; README có self-assessment và thống kê screens/flows, checklist designed/executed/pass/fail, bugs, participants và video.
- AI Critique 200–300 từ, AI Audit Markdown + PDF và log tương tác đầy đủ theo đề. Commit theo bước thực hiện/từng usability session; **xuất commit log text ở cuối bài, trước đóng ZIP**, không xuất snapshot cho riêng Task 1.
- Quy định chung về AI-02/03/05 và AI-06: HW01 tiếng Anh, Required Templates, dòng 104–106 (Every AI-assisted submission / before ANY AI-assisted homework is graded). Chưa coi là đã ký; cần bản mẫu/tình trạng thực tế.
- ZIP: 23120410_HW03_AI_GUIUsability_<000-100>.zip; hạn nộp xem Moodle. Không nộp trễ; thiếu tài liệu bắt buộc hoặc sao chép có thể bị 0 theo đề.

## 7. Hồ sơ liên quan

- [Bộ bàn giao Task 1](gui/task1/START-HERE.md): report HTML/Markdown/PDF, Excel, kết quả và findings.
- [AI Audit](ai/AI_Audit_Report.md).
- [Disclosure](ai/AI_Disclosure.md).
- [Prompt Log](ai/PromptLog.md).