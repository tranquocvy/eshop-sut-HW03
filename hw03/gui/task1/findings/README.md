# Task 1 — Findings và bằng chứng

## Kết luận

31 failed variants được ánh xạ duy nhất vào **19 nhóm triệu chứng**: 12 R requirement-bug groups và 7 H heuristic/design groups. Không báo cáo 31 bugs. Root cause mã nguồn chưa được chứng minh.

Trạng thái chuẩn REVIEW-SUPPLEMENT-005: 75 pass / 31 fail / 15 blocked / 1 needs-review; 52 IDs, 122 instances, 119 UI-observed instances, 51 UI-observed IDs. Raw records giữ nguyên; effective review không ghi đè raw.

Toàn bộ 19 nhóm cũng được ghi trực tiếp, kèm Expected/Actual, cách tái hiện và screenshots trong [báo cáo Markdown chính](../Task1_Report.md) và [PDF tương ứng](../Task1_Report.pdf); các file dưới đây giữ observation và issue draft chi tiết.

## Danh mục

- [R01 — Home prices use VND instead of ₫](R01.md) / [Issue #1](https://github.com/tranquocvy/eshop-sut-HW03/issues/1) — GUI-004
- [R02 — Product detail omits category](R02.md) / [Issue #2](https://github.com/tranquocvy/eshop-sut-HW03/issues/2) — GUI-005
- [R03 — Home product images have empty alternative text](R03.md) / [Issue #3](https://github.com/tranquocvy/eshop-sut-HW03/issues/3) — GUI-006, GUI-047
- [R04 — Home has two level-one headings](R04.md) / [Issue #4](https://github.com/tranquocvy/eshop-sut-HW03/issues/4) — GUI-008
- [R05 — Detail positive action uses green instead of blue](R05.md) / [Issue #5](https://github.com/tranquocvy/eshop-sut-HW03/issues/5) — GUI-010
- [H01 — Narrow Home heading collapses into a word column](H01.md) / [Issue #6](https://github.com/tranquocvy/eshop-sut-HW03/issues/6) — GUI-012
- [H02 — Search field has only a placeholder](H02.md) / [Issue #7](https://github.com/tranquocvy/eshop-sut-HW03/issues/7) — GUI-016
- [R06 — Search keyword is rendered as HTML](R06.md) / [Issue #8](https://github.com/tranquocvy/eshop-sut-HW03/issues/8) — GUI-022
- [H03 — Quantity spinbutton lacks an accessible name](H03.md) / [Issue #9](https://github.com/tranquocvy/eshop-sut-HW03/issues/9) — GUI-023
- [R07 — Detail breadcrumb is missing](R07.md) / [Issue #10](https://github.com/tranquocvy/eshop-sut-HW03/issues/10) — GUI-030
- [R08 — Add action produces no visible feedback on Home and Detail](R08.md) / [Issue #11](https://github.com/tranquocvy/eshop-sut-HW03/issues/11) — GUI-031, GUI-048
- [R09 — Home has no route-dependent selected navigation state](R09.md) / [Issue #12](https://github.com/tranquocvy/eshop-sut-HW03/issues/12) — GUI-036
- [R10 — Home list and search omit loading indication](R10.md) / [Issue #13](https://github.com/tranquocvy/eshop-sut-HW03/issues/13) — GUI-037, GUI-038
- [R11 — No-result search lacks message and illustration](R11.md) / [Issue #14](https://github.com/tranquocvy/eshop-sut-HW03/issues/14) — GUI-040
- [H04 — Home request failures have no error feedback](H04.md) / [Issue #15](https://github.com/tranquocvy/eshop-sut-HW03/issues/15) — GUI-041, GUI-052
- [H05 — Detail request failure remains loading](H05.md) / [Issue #16](https://github.com/tranquocvy/eshop-sut-HW03/issues/16) — GUI-043
- [H06 — Older search response overwrites newer results](H06.md) / [Issue #17](https://github.com/tranquocvy/eshop-sut-HW03/issues/17) — GUI-045
- [H07 — Search label follows unsubmitted draft text](H07.md) / [Issue #18](https://github.com/tranquocvy/eshop-sut-HW03/issues/18) — GUI-046
- [R12 — Required quantity label lacks asterisk](R12.md) / [Issue #19](https://github.com/tranquocvy/eshop-sut-HW03/issues/19) — GUI-049

## Truy xuất và giới hạn

- [JSON bijective mapping](mapping.json): đúng 31 unique failed instance keys, mỗi key thuộc một finding.
- [Screenshot source paths + SHA256](evidence/manifest.json): paths tính từ immutable run root; ảnh chỉ từ failed variants, copy byte-identical, deduplicate theo SHA256.
- Đã đăng 19 Issues có screenshots nhúng; xem URL ở từng finding. Ảnh được pin vào commit 85b35d4884268a438a6e9360721cb94f6c7d1cef; repo đã public, Issues và ảnh truy cập được không đăng nhập.
- Windows Chromium là môi trường duy nhất; kiểm thử >=3 platforms thuộc Task 3, không suy rộng ở đây.
- sqlite OPEN_READONLY/initializer bypass giới hạn kết luận về write/persistence; add feedback chỉ là quan sát UI.
- GUI-051 blocked do thiếu empty-state GUI-040, liên kết R11, không đếm thành bug.
- GUI-036 Detail applicability vẫn needs-review; không dùng breadcrumb thay navbar.
- GUI-033 H/D pass là manual do người dùng báo cáo, không phải agent-run mới.
- Recipes chỉ tái dựng từ saved evidence, không chạy lại SUT. Không kèm raw trace hoặc user coordinates.
