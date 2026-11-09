# Kiểm chứng

- 366 unique platform/variant keys; 52 ID / 122 biến thể mỗi browser.
- JSON/report/Excel: 132 Pass / 78 Fail / 42 Blocked / 114 needs-review.
- 1253 ảnh đóng gói khớp SHA256; một native image Edge GUI-001 không khớp đã loại, xem integrity-exceptions.json.
- Links/ảnh local kiểm tồn tại; đối chiếu 19 nhóm Issues.
- Excel formula error scan sạch; render ba sheet đã kiểm, chưa mở bằng Microsoft Excel.
- PDF 7 trang đã render và kiểm bố cục.
- Không thêm dữ liệu participant/credentials; không ký human review.
- Trace/video raw vẫn ở _working, không đóng gói; sourceRun/sourceResult ghi trong records.
- Firefox prerequisite map nối hai run; giới hạn verifier single-run ghi rõ.
- Chưa commit/push.
