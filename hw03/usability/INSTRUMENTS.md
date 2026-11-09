# Task 2 — SUS và câu hỏi mở trên web (v0.4, cần pilot lại phần sửa)

## 0. Cách triển khai trên web

Theo [plan online](ONLINE-STUDY-PLAN.md), 10 SUS items là radio 1–5 không chọn sẵn. Probes v0.4 có bốn câu chính, lựa chọn rõ Có/Không/Không chắc/Bỏ qua và câu mở tiếp theo không bắt buộc (§6). Probes snapshot v0.3 trở về trước giữ form/câu chữ cũ. Lưu raw và version phía server; không hiện công thức/score, đáp án moderator hoặc bản Anh đối chiếu trên màn hình participant mặc định. Autosave có trạng thái rõ, cho nộp thiếu với lý do thay vì ép trung lập. Moderator hỏi follow-up live sau SUS rồi lưu riêng, không sửa lời participant.

## 1. Lựa chọn và giới hạn

Dùng **System Usability Scale (SUS)**: 10 câu, thang 1–5, trả lời sau task rồi mới hỏi probes. Đây là lựa chọn triển khai được đề cho phép, không phải thang bắt buộc duy nhất. Nguồn đã đọc ngày 09/11/2026: [Measuring Usability with SUS — MeasuringU](https://measuringu.com/sus/) (tác giả bài: Jeff Sauro; thang gốc John Brooke, 1986). Không lấy hướng dẫn SUS từ slide S13 vì slide không trình bày thang này.

Bản Việt dưới đây là **bản dịch làm việc do AI hỗ trợ, chưa được xác thực tâm trắc**, giữ thứ tự và chiều tích cực/tiêu cực của 10 câu gốc. Sinh viên cần review, pilot khả năng hiểu và freeze trước bảy phiên; không tuyên bố tương đương một bản SUS tiếng Việt đã thẩm định. Giữ bản Anh để đối chiếu, không tùy biến câu giữa các phiên. Nếu cần bản Việt đã thẩm định, phải xác minh nguồn/quyền dùng trước khi thay.

**Hướng dẫn:** “Hãy đánh giá EShop dựa trên trải nghiệm vừa thực hiện. Hệ thống trong các câu sau là website EShop. Chọn một mức cho mỗi câu, không có đáp án đúng/sai.” Kết quả chỉ phản ánh trải nghiệm flow được thử, không đại diện toàn EShop.

1 = Hoàn toàn không đồng ý; 2 = Không đồng ý; 3 = Trung lập; 4 = Đồng ý; 5 = Hoàn toàn đồng ý. Không có trả lời thì để missing, không gán 3 thay người tham gia.

## 2. Mười câu (phát cho participant phần này, không phát đáp án hoặc cách đảo điểm)

| ID | Bản Việt làm việc | Bản Anh đối chiếu từ nguồn |
|---|---|---|
| S01 | Tôi nghĩ rằng tôi muốn sử dụng hệ thống này thường xuyên. | I think that I would like to use this system frequently. |
| S02 | Tôi thấy hệ thống này phức tạp một cách không cần thiết. | I found the system unnecessarily complex. |
| S03 | Tôi nghĩ hệ thống này dễ sử dụng. | I thought the system was easy to use. |
| S04 | Tôi nghĩ tôi cần sự hỗ trợ của một người có chuyên môn kỹ thuật để có thể sử dụng hệ thống này. | I think that I would need the support of a technical person to be able to use this system. |
| S05 | Tôi thấy các chức năng khác nhau trong hệ thống này được tích hợp tốt với nhau. | I found the various functions in this system were well integrated. |
| S06 | Tôi nghĩ hệ thống này có quá nhiều điểm không nhất quán. | I thought there was too much inconsistency in this system. |
| S07 | Tôi hình dung rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh. | I would imagine that most people would learn to use this system very quickly. |
| S08 | Tôi thấy hệ thống này rất rườm rà khi sử dụng. | I found the system very cumbersome to use. |
| S09 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. | I felt very confident using the system. |
| S10 | Tôi cần học nhiều thứ trước khi có thể bắt đầu sử dụng hệ thống này. | I needed to learn a lot of things before I could get going with this system. |

Nếu không hiểu, ghi nguyên câu thắc mắc; không diễn giải dẫn hướng. Review vấn đề diễn đạt sau pilot. Tách bản participant khỏi phần hướng dẫn moderator/scoring khi phát tài liệu.

## 3. Chấm điểm — chỉ cho người phân tích

- Kiểm đủ 10 giá trị **nguyên 1–5**. Missing/ngoài khoảng: không tính tổng cho người đó, tìm lại raw nếu lỗi nhập; không suy đáp án hoặc thay bằng trung bình.
- Câu lẻ 1/3/5/7/9: contribution = response − 1.
- Câu chẵn 2/4/6/8/10: contribution = 5 − response.
- SUS cá nhân = tổng 10 contributions × 2,5; miền 0–100, **không phải phần trăm hoặc tỷ lệ hoàn thành**.
- Tính từng người trước rồi tổng hợp bảy phiên chính; loại pilot khỏi thống kê. Nếu thiếu dữ liệu, báo số đủ thực tế, không gọi là đủ 7 SUS.
- Không dùng SUS tự chẩn đoán bug hay đặt một ngưỡng đậu/rớt cho bài. Mốc phổ biến từ nghiên cứu bên ngoài không phải yêu cầu HW03; ở đây ưu tiên điểm từng người, mean/median/range và notes.
- Kiểm công thức bằng dữ liệu kỹ thuật tách khỏi study: lẻ 5/chẵn 1 → 100; lẻ 1/chẵn 5 → 0; toàn 3 → 50. Không đưa các vector này vào bảng participant.

## 4. Probes sau SUS — hỏi đủ bốn nhóm

| Nhóm | Câu hỏi chính trung lập | Đào sâu khi phù hợp |
|---|---|---|
| Clarity | Có chỗ nào bạn thấy khó hiểu trong quá trình tìm và lựa chọn không? | Bạn hiểu tên/giá/mô tả đó thế nào? Bạn mong nhìn thấy thông tin gì? |
| Error recovery | Trong lúc làm có lúc nào bạn không biết đi tiếp hoặc không tìm được thứ mong muốn không? | Nếu có: bạn đã thử gì, điều gì giúp/cản bạn? Nếu không: ghi không gặp tình huống; câu hỏi giả định nếu có phải gắn nhãn hypothetical, không tính là hành vi thực tế. |
| Speed | Bạn thấy quá trình này nhanh/chậm hoặc tốn công ở điểm nào? | Đoạn nào làm bạn chờ hoặc làm lại? Tránh áp thời gian đo được lên câu trả lời trước. |
| Trust | Bạn tự tin đến đâu rằng sản phẩm đã chọn phù hợp nhu cầu và ngân sách? Vì sao? | Có thông tin nào còn thiếu hoặc khiến bạn chưa tin tưởng không? |

Câu kết tùy chọn: “Nếu chỉ thay đổi một điều trên website, bạn muốn đổi gì?” Phân biệt lời nói nguyên văn, diễn giải và suy luận của analyst; không dùng probe làm một thang điểm chuẩn hóa thứ hai.

## 5. Câu chữ rút gọn cho compact-screen-v1

Bundle INSTRUMENTS-v0.3 giữ nguyên cả 10 câu SUS và phép chấm của bản v0.2; chỉ rút câu chữ probes trên portal. Không đổi bundle giữa các phiên đã freeze. Bộ probes v0.2 ở §4 tiếp tục mô tả snapshot legacy.

- Clarity: “Điều gì khó hiểu khi tìm và lựa chọn?”
- Recovery: “Bạn có gặp khó khăn hoặc không tìm được thứ mong muốn không?” (Có / Không gặp / Không muốn trả lời), rồi “Nếu có, bạn đã xử lý thế nào? Nếu không gặp, ghi ‘không gặp’.”
- Speed: “Chỗ nào nhanh, chậm hoặc tốn công?”
- Trust: “Bạn tin lựa chọn của mình phù hợp đến đâu? Vì sao?”

Mỗi nhóm vẫn có chỗ từ chối/ghi lý do, không suy rằng lời tự báo là hành vi đã quan sát. Câu cải tiến tùy chọn có thể hỏi live và ghi notes riêng. Không thu danh tính hoặc âm thanh trên portal compact; moderator ghi notes và roster xác minh riêng.

## 6. Probes v0.4 — câu trung lập và nhánh ngắn

Giữ nguyên 10 câu SUS, thứ tự, thang 1–5 và cách tính. **Không có UEQ-S được triển khai.** Bốn câu dưới đây do nhóm thiết kế/AI hỗ trợ soạn, không phải thang chuẩn hóa, không tính thành SUS. UI hiển thị Có / Không / Không chắc / Bỏ qua câu này; giải thích không bắt buộc. Không chọn sẵn. Participant có thể bỏ qua từng câu mà không cần giải trình.

| Nhóm | Câu chính | Câu mở tiếp theo (không bắt buộc) |
|---|---|---|
| Clarity | Trong lúc tìm điện thoại, có thông tin hoặc nút nào bạn chưa hiểu rõ không? | Đó là chỗ nào? Bạn nghĩ nó có nghĩa gì? |
| Recovery | Trong lúc làm, bạn có bấm nhầm, gặp lỗi hoặc bị kẹt ở bước nào không? | Bạn đã làm gì tiếp theo? Có tiếp tục được không? |
| Speed | Có bước nào mất nhiều thời gian hơn bạn mong đợi không? | Đó là bước nào? Điều gì làm bạn mất thời gian? |
| Trust | Thông tin trên EShop đã đủ để bạn quyết định chọn một chiếc điện thoại chưa? | Thông tin nào giúp bạn quyết định, hoặc bạn còn cần biết thêm điều gì? |

Clarity/recovery/speed chỉ hiện giải thích khi Có hoặc Không chắc; Không/Bỏ qua không bắt nhập lại. Trust hiện giải thích khi Có/Không/Không chắc, dùng được cả khi chưa chọn được sản phẩm; Bỏ qua thì ẩn. Góp ý tùy chọn cuối: “Nếu được thay đổi một điều trên EShop, bạn muốn thay đổi điều gì?”

Raw lưu riêng clarityChoice/recoveryChoice/speedChoice/trustChoice với yes/no/unsure/skip và nguyên văn giải thích. Trường recoveryObserved trong answers là **tự báo** tương thích schema, yes→true/no→false/unsure hoặc skip→null; không thay recoveryObserved của moderator. Không gán chuỗi “không gặp” hoặc lý do giả vào ô trống. Chuyển nhánh ẩn thì không gửi nội dung cũ trong ô ẩn; skip/unsure không bị gộp. Bảng report thể hiện lựa chọn và giải thích tách rời.

Study mới từ npm start chọn probeVersion=v0.4 và dataDir private-compact-v04 mới. Service/API vẫn mặc định v0.3 nếu không chỉ định để tương thích. Snapshot cũ giữ instrumentProvenance, câu chữ và dữ liệu; không ghi ngược v0.4 vào pilot đã thu. Cần pilot/review phần thay đổi trước freeze mới.
