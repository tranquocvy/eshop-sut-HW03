# Web tổ chức Task 2

## Chạy local

Cần Node.js **24.22+** và dependency cache đã có ở HW03/_working/eshop-sut-HW03/t01-runtime (hoặc t02-runtime).

    npm run setup
    npm run build
    npm start

- Điều phối: http://127.0.0.1:4312/moderator
- Portal: http://127.0.0.1:4310 — participant cần link mời riêng.
- EShop: http://localhost:4311 — khác hostname để tách cookies.
- Console chỉ báo đường dẫn tệp admin-password.txt; đọc riêng trên máy tổ chức, không đưa mật khẩu vào chat/ảnh/Git. Ctrl+C dừng dịch vụ.

Đây là local, không tự mở tunnel hoặc browser. Setup chỉ nối cache hiện có, không cài gói. Clone thiếu cache phải chuẩn bị dependencies/browser trước; không chạy install/startup trong source SUT gốc. Có thể dùng STUDY_FRONTEND_DEPS cho node_modules React/Vite đã có; xem [runtime guide](runtime/README.md) cho backend cache.

## Người tham gia: năm nhóm bước

**Tham gia → Nhiệm vụ → Đánh giá → Gửi video → Hoàn tất.**

1. Xác nhận điều kiện và đồng ý ngắn gọn. Không nhập tên/số điện thoại; không xin quyền mic hoặc camera.
2. Đọc nhiệm vụ, đợi người điều phối cho bắt đầu. Mở EShop tab riêng, trở lại portal bấm **Quay màn hình** rồi tự chọn tab EShop trong hộp thoại trình duyệt.
3. Làm nhiệm vụ, bấm **Dừng quay**, tự báo kết quả và điền SUS 10 câu + probes v0.4: Có/Không/Không chắc/Bỏ qua, giải thích có nhánh và không bắt buộc. SUS giữ nguyên; không dùng UEQ-S.
4. Xem lại, **Tải bản dự phòng**, rồi bấm **Gửi video đã quay**. Nếu upload lỗi, giữ trang mở để gửi lại; có đường gửi file quay riêng.
5. Nhận biên nhận. Đã nhận video/khảo sát không tự chứng minh hoàn thành độc lập hoặc phiên hợp lệ.

Chỉ quay màn hình, audio=false; không có getUserMedia/mic/camera. Chrome/Edge desktop qua HTTPS hoặc localhost là môi trường ưu tiên. Trình duyệt phải cho người dùng tự chọn bề mặt; portal không tự chọn hoặc đọc được tab nào đang quay. Đóng/tải lại tab hoặc crash có thể mất video chưa gửi: cảnh báo rời trang không thay bản dự phòng. Giữ portal mở; đổi kích thước cửa sổ không được tháo recorder đã mount. File lỗi/chạm cap chỉ là bản có thể thiếu, chỉ tải dự phòng, không tự gửi như evidence hoàn chỉnh.

## Người tổ chức

- Đăng nhập trang điều phối. Nhãn/liên hệ chung đã có sẵn cho study mới; không cần điền số cá nhân. Chốt hạn rút/xóa và thông tin lưu trữ/quyền xem trước lời mời thật.
- Tạo PILOT-01, gửi riêng một người. Link chỉ đổi phiên một lần; không mở thử link của participant.
- Giữ điều phối trực tiếp bên ngoài portal; chọn phiên và cho bắt đầu khi sẵn sàng. Hỏi participant think-aloud và ghi notes; **web không ghi âm**. Không dẫn cách giải nhiệm vụ.
- Review video, K1, nguồn đo và pilot trước freeze/P01–P07. Synthetic tests không phải pilot hoặc người tham gia.
- Danh sách xác minh 7 người có tên/liên hệ đã che vẫn cần thu và nộp riêng theo đề. Luồng rút gọn không thu roster này; export bảng rỗng không thay evidence thật.

## Dữ liệu và phiên bản

Study mới từ npm start chọn **compact-screen-v1**, mặc định dataDir ngoài repo: HW03/_working/eshop-sut-HW03/online-study/private-compact-v04/. Build và runtime cũng ngoài repo. Không mã hóa dữ liệu bằng app; ACL/encryption/backup là kiểm soát của máy tổ chức, app không thay chúng.

- Study legacy/phiên cũ giữ snapshot và raw consent riêng; không sửa lịch sử thành screen-only. Không dùng lại pilot cũ làm pilot cho quy trình đã đổi mà chưa review/thử lại.
- STUDY_WORK_DIR, STUDY_DATA_DIR, --data-dir và --config chỉ định đường dẫn riêng; --config khởi tạo DB mới, không ghi đè cấu hình DB cũ. Đổi provenance phải dùng study/dataDir mới. Không xóa thư mục private để chữa lỗi startup.
- Runtime chuẩn bị trong run-* mới mỗi lượt, không unlink/ghi đè App.css cũ. Các run cũ được giữ; chỉ dọn artifact đã dừng sau review. WorkDir cần cho phép tạo thư mục và dependency cache phải đọc được; không yêu cầu Administrator hoặc sửa ACL.
- Thông tin người tổ chức vẫn ở cấu hình admin riêng; participant API dùng nhãn/liên hệ chung. Text tự do, ảnh và video vẫn cần human privacy review trước chia sẻ.

## Tunnel và SUT

Chỉ mở khi người tổ chức yêu cầu: **hai hostname HTTPS riêng** cho portal và SUT, không tunnel admin listener hoặc thư mục source/private. Đặt đúng studyOrigin/sutOrigin trước invitation; không tái dùng snapshot localhost cho máy ngoài. Quick Tunnel là tạm và dừng theo process, không có bảo đảm uptime. Kiểm link từ máy khác, quay/dừng/upload/phát lại trước pilot thật; fetch từ Gateway không chứng minh delivery ở máy participant.

Source UI và backend SUT không sửa; chỉ external Axios transport adapter, no-init backend loader và DB snapshot read-only. Không gọi bundle byte-identical, không sửa bug để đạt task. Gateway chỉ cho product-read APIs trong flow, không expose source/DB. Loader không phải OS sandbox; chỉ dùng DB demo. Xem [runtime/README.md](runtime/README.md).

## Kiểm và báo cáo

    npm test
    npm run test:compact
    npm run test:e2e
    npm run test:report
    npm run integrity

[VERIFICATION.md](VERIFICATION.md) phân biệt kiểm kỹ thuật, native permission và delivery thật. Browser test compact dùng canvas synthetic làm display stream với MediaRecorder thật, không giả đây là native picker hoặc recording người thật.

Export JSON/CSV/Markdown/HTML để in PDF luôn là DRAFT cần review. Không tự đăng Issues, gửi video hoặc đưa private data vào Git. Không xuất Git log/ZIP tự động.

- [Protocol](../../usability/PROTOCOL.md), [SUS/probes](../../usability/INSTRUMENTS.md), [plan online](../../usability/ONLINE-STUDY-PLAN.md).
- [API contract](CONTRACT.md), [service guide](server/README.md), [recorder lifecycle](portal/recorder.README.md).
