# HW03 — Kế hoạch thực hiện v0.3

## 1. Phạm vi

- **Màn hình chính:** Home / Product Listing & Search (FR-05).
- **Màn hình bổ trợ:** Product Detail (FR-06), header/navigation liên quan.
- **Luồng usability:** tìm sản phẩm theo nhu cầu → đọc chi tiết → lựa chọn sản phẩm phù hợp. Kết thúc ở lựa chọn, không gồm đặt hàng.
- Không mở rộng luồng sang đăng ký/đăng nhập, OTP, giỏ hàng, coupon hoặc checkout. Control hiện trên màn hình vẫn được xét trong GUI theo phạm vi ghi rõ.
- Chọn sản phẩm và tiêu chí scenario sau khi kiểm tra dữ liệu thật; chưa tự đặt ví dụ thành requirement.
- Màn hình chính/flow phải không trùng thành viên nhóm; sinh viên xác nhận việc đăng ký với nhóm.

## 2. Nguồn và baseline

- Đề gốc: 2026.HW03.GUI Usability_En.pdf, tại thư mục HW03 cha repo; §5–7 (scope/tasks/skills), §9–12 (AI/commit), §14–15/17 (nộp/rubric/quy định).
- Slide GUI Checklist và Usability Evaluation: chưa được cung cấp; cần đọc trước khi chốt phương pháp thiết kế.
- [README/spec SUT](../README.md), [API specification](../api_specification.md). Source code chỉ cho biết triển khai, không tự trở thành expected.
- Baseline nguồn https://github.com/ttbhanh/eshop-sut : commit 85af3ba875c88283615e22cb108f13e2fccaf0e9.
- Repo riêng https://github.com/tranquocvy/eshop-sut-HW03 ; origin là repo này, upstream là nguồn giảng viên. Giữ HW02 riêng, không sửa production code để làm test pass.

## 3. Thứ tự làm bài

| ID | Sản phẩm / phạm vi | Điều kiện hoàn tất | Trạng thái |
|---|---|---|---|
| T00 | Baseline, kế hoạch và hồ sơ AI | Repo gốc riêng; nguồn/thiếu nguồn rõ; log có nguồn; sinh viên review kế hoạch | Repo đã xác minh; kế hoạch và hồ sơ đã tạo |
| T01 | Thiết kế GUI checklist | Đọc slide/spec; >40 mục không lặp, phủ IA-01–04; giữ bản AI đầu; review và sửa có truy vết | Chưa cập nhật |
| T02 | Thực thi GUI và cross-platform | Checklist được review; kết quả tách theo ≥3 nền tảng; notes/ảnh Failed; bug Markdown + GitHub Issues có ảnh | Chưa cập nhật |
| T03 | Bộ chuẩn bị usability và pilot | Mục tiêu, scenario theo goal, SUS/UEQ-S, probe clarity/recovery/speed/trust; review; pilot người thật và sửa | Chưa cập nhật |
| T04 | 7 phiên usability | Đúng 7 người ngoài lớp, consent, phiên thật, notes và phản hồi thang đo; ghi từng phiên riêng | Chưa cập nhật |
| T05 | Phân tích usability | Tính điểm từ dữ liệu thật; nhóm pain points, severity, phân biệt bug/design; review; báo bug thật | Chưa cập nhật |
| T06 | Agent Skill và demo | Tận dụng/xây skill cùng T01/T03, kiểm chứng qua dùng thật; video đầu-cuối và YouTube link | Chưa cập nhật |
| T07 | Hồ sơ cuối và ZIP | Đủ mục §14; AI Critique 200–300 từ; biểu mẫu đúng thực tế; self-assessment; kiểm tra giải nén | Chưa cập nhật |

Task 1 và Task 3 thực thi cùng quy trình, nhưng kết quả tách rõ từng nền tảng. T03 có thể chuẩn bị khi flow/data đã được xác minh; pilot phải trước bảy phiên chính. Skill được phát triển cùng task thực tế, không dựng lại demo ở cuối.

## 4. Gate của việc tiếp theo — T01

- [ ] Đọc slide/spec, xác định screen/state/viewport và expected có căn cứ.
- [ ] Kiểm tra SUT/data riêng tại baseline, không sửa code sản phẩm.
- [ ] Tạo bản AI đầu **ít nhất 41 mục**, không lặp, phủ IA-01–04: UI standards, Forms, Navigation, Feedback/state.
- [ ] Mỗi mục có ID, IA, màn hình/trạng thái, điều kiện/thao tác và expected quan sát được.
- [ ] AI tự kiểm tra; worker có thể pre-review, nhưng sinh viên phải review bản cuối, tìm/bổ sung thiếu sót của AI và giải thích nguyên nhân.
- [ ] Giữ bản đầu và thay đổi sau review; ghi đúng người góp ý/người sửa.
- [ ] Xuất Excel sau review thiết kế; chưa điền actual/pass trước execution.

## 5. Điều kiện thực thi và evidence

- GUI: Pass/Fail từng mục; Failed có Notes và ảnh. Bug có Markdown + GitHub Issue kèm ảnh.
- Cross-platform: chạy checklist trên ≥3 nền tảng; dự kiến Chrome + Firefox + Safari/Android Chrome, chỉ chốt khi có truy cập thật. Expo Go điện thoại thật có thể thay một nền tảng theo đề, nhưng không mặc nhiên tương đương checklist web.
- BrowserStack/LambdaTest trial được ưu tiên; phương án thay thế phải đúng điều kiện đề. Ảnh thể hiện môi trường/localhost và đáp ứng cả email sinh viên overlay (§6), MSSV/họ tên (§11).
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
- AI Critique 200–300 từ, AI Audit Markdown + PDF, log tương tác đầy đủ theo đề; commit từng bước/từng usability session và xuất commit log text.
- Quy định chung về AI-02/03/05 và AI-06: HW01 tiếng Anh, Required Templates, dòng 104–106 (Every AI-assisted submission / before ANY AI-assisted homework is graded). Chưa coi là đã ký; cần bản mẫu/tình trạng thực tế.
- ZIP: 23120410_HW03_AI_GUIUsability_<000-100>.zip; hạn nộp xem Moodle. Không nộp trễ; thiếu tài liệu bắt buộc hoặc sao chép có thể bị 0 theo đề.

## 7. Hồ sơ liên quan

- [AI Audit](ai/AI_Audit_Report.md).
- [Disclosure](ai/AI_Disclosure.md).
- [Prompt Log](ai/PromptLog.md).