# Task 2 — Kế hoạch phân tích (chưa có kết quả)

Nguồn yêu cầu: HW03 §6 Task 2, §14/15; slide S13 “Summarizing performance results”, “Summarizing preference results”, “Analyzing Data”. Task 2 có 40 điểm cho scenario + 7 sessions + analysis, không có phân bổ con được đề công bố. Bản này là cách thực hiện, không phải scoring rubric tự đặt cho bài.

## 0. Cách đưa analysis vào web

Theo [plan online](ONLINE-STUDY-PLAN.md), moderator UI xem raw/derived SUS, performance, notes, findings, evidence và xuất JSON/CSV/Markdown/PDF. Các bảng dưới đây là specification, không buộc participant nhập file ngoài web. Máy tính score chỉ tự động phần công thức; moderator vẫn review K1, severity, sources, quotes và bug classification. Participant self-report, portal markers và thời gian xác minh từ video/live là ba nguồn riêng; không suy hành vi chi tiết từ việc đổi bước trên portal.

Export có hai phạm vi: report/dataset đã khử định danh và gói private cho giảng viên/TA. Video participant record rồi upload/import được quản lý bằng ID/hash/review; không phát URL download public.

## 1. Kiểm dữ liệu trước khi tính

- Pilot riêng, bảy participant chính duy nhất; tách attempt chạy lại và lý do. Không đếm repeated attempt như người thứ tám hoặc che lần lỗi.
- Kiểm eligibility/consent riêng, version và evidence references, timestamp, raw SUS nguyên 1–5 đủ 10 câu. Không đưa định danh vào bảng phân tích.
- Missing thì đánh missing kèm lý do; không bù điểm, tự sinh phản hồi hoặc loại low score. Báo số phiên thật và số SUS hợp lệ riêng nếu chưa đủ.

## 2. Performance

Bảng mỗi người: outcome, K1 từng tiêu chí, sản phẩm/giá/căn cứ, thời gian giây, hỗ trợ chỉ đường, lỗi/do dự quan sát được, recovery exposure.

- Completion độc lập = số completed-independent / số phiên chính đánh giá được. Báo kèm x/n, không chỉ phần trăm; assisted báo riêng.
- Hoàn thành có tính hỗ trợ = (independent + assisted) / cùng mẫu số; không tráo với independent.
- Nếu technical interruption chưa giải quyết: báo cả tổng số attempts, số participant và n đánh giá được; không giả đủ 7 kết quả. Tìm cách thu bổ sung hợp lệ, giữ lịch sử.
- Thời gian: báo từng người; median/mean/range khi đủ dữ liệu, tách assisted/unfinished. Không trộn thời gian dừng sớm với thời gian hoàn thành rồi kết luận nhanh hơn. Ghi cách xử lý pause trước freeze.
- Lỗi là hành động sai/lặp gây cản trở hoặc không đạt mục tiêu có evidence, không phải mọi click/back. Freeze định nghĩa sau pilot. Do dự ghi hành vi và duration nếu đo được, không đoán trạng thái tâm lý.
- Recovery: chỉ dùng mẫu số những người thực sự có cơ hội gặp; không phát sinh ≠ thành công. Bảy người không đủ suy rộng tần suất cho toàn thị trường.

## 3. SUS và preference

Dùng [công thức](INSTRUMENTS.md), lưu contributions và tổng derived riêng khỏi raw. Review lại từng người và tổng hợp; không chấm dựa vào overall impression.

Bảng dự kiến: participant ID, mười raw responses/reference, mười contributions, SUS 0–100 hoặc missing, lý do. Chưa điền dòng kết quả thật.

- Tổng hợp scores hợp lệ: n, mean, median, min–max; có thể thêm SD nếu cần, ghi sample SD và cách tính. Không gọi SUS là phần trăm hoặc task-success.
- Không suy high SUS chứng minh không có bug hoặc low SUS chứng minh root cause.
- Giới hạn: mẫu n=7, một flow ngắn, catalog nhỏ, bản dịch Việt làm việc chưa thẩm định; không tự gán percentile/grade hoặc kết luận toàn hệ thống.
- Gom probes theo clarity/recovery/speed/trust; tách ý kiến và hành vi; quote cần timestamp/reference, không có nguyên văn thì ghi paraphrase.

## 4. Findings và severity

Gom triệu chứng giống nhau nhưng giữ trace participant IDs/evidence. Phân biệt bug trái yêu cầu có căn cứ, design issue hệ thống, sở thích cá nhân và chưa rõ. Chưa đủ evidence thì không khẳng định root cause.

Thang làm việc sau đây cần review qua pilot, không phải thang do đề quy định:

| Mức | Tiêu chí tác động |
|---|---|
| S3 — nghiêm trọng | Ngăn hoàn thành mục tiêu, không có cách phục hồi độc lập quan sát được hoặc gây lựa chọn sai đáng kể |
| S2 — vừa | Gây nhầm/lặp lại/đi vòng hoặc cần hỗ trợ nhưng còn phục hồi được |
| S1 — nhẹ | Khó chịu/khó hiểu nhỏ, không cản mục tiêu đáng kể |
| S0 — thông tin | Preference/đề xuất hoặc observation chưa đủ chứng minh vấn đề |

Báo severity theo impact và occurrence x/n riêng. Ưu tiên xem cả hai, không biến “severity AND probability” trong slide thành công thức nhân tùy ý. Một blocker chỉ gặp một người vẫn có thể cần ưu tiên cao; giải thích quyết định.

Mỗi finding gồm: RQ, evidence, affected x/exposed n, impact, classification, severity/reason, recommendation, limitations, nguồn expected nếu bug. Chưa có findings từ usability thì không dùng 19 nhóm Task 1 làm số liệu thay thế.

## 5. Bug reporting và báo cáo cuối

- Genuine bug: xác minh repro riêng sau phiên, không tác động vào phiên người thật. Không sửa SUT cho khớp expected.
- Đối chiếu Issues Task 1 để tránh mở trùng; link Issue đã có và thêm evidence usability phù hợp khi được phép. Bug mới: Markdown + GitHub Issue có screenshot; screenshot không lộ participant/contact, có quyền chia sẻ phù hợp.
- Không phải mọi pain point đều phải mở bug Issue. Design recommendations vẫn nằm trong report có evidence và giới hạn.
- Report Task 2: mục tiêu/profile/flow → phương pháp và pilot/chỉnh sửa → participant summary khử định danh → từng phiên → performance/SUS → pain points/severity → bugs/recommendations → giới hạn → references/evidence index.
- Tích hợp report chính Markdown + PDF; bảng participant có tên/liên hệ đã che và private evidence nộp riêng đúng phạm vi. README cuối toàn bài cập nhật số thật, không tự chấm 40 điểm vì đã có tài liệu.

## 6. Ma trận yêu cầu → evidence gate

| Yêu cầu | Vị trí chuẩn bị | Bằng chứng hoàn tất còn cần |
|---|---|---|
| Mục tiêu, scenario goal-based, một flow | EVALUATION-DESIGN.md / PROTOCOL.md | UI khả thi, student review, scenario freeze |
| Pilot và refine | PILOT.md | Phiên thật và change record |
| 7 người ngoài lớp phù hợp profile | TEMPLATES.md / PILOT.md | Eligibility và danh sách xác minh riêng, bảy phiên thật |
| Think-aloud/moderation/notes/capture | PROTOCOL.md / TEMPLATES.md | Recording/notes/timestamps và consent thực tế |
| Scale sau phiên, probes bốn nhóm | INSTRUMENTS.md / TEMPLATES.md | Raw responses và lời trả lời thật |
| Score/group/severity | ANALYSIS.md | Raw-to-derived checks, findings có evidence |
| Bug Markdown + Issues có ảnh | ANALYSIS.md | Repro/nguồn expected, Issue links/screenshots thật |
| Commit từng bước/từng session, report/evidence cuối | README.md / ANALYSIS.md | Commit được phép, report Markdown/PDF và gói nộp riêng; Git log xuất cuối bài |

Không có kiểm định thống kê so sánh nhóm hoặc benchmark thời gian bắt buộc trong đề; không tự biến chúng thành dependency của việc hoàn thành Task 2.
