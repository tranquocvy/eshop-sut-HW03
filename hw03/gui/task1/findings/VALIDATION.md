# Kiểm tra gói findings

- Mapping: 31/31 failed instances, 31 unique instance keys; mỗi instance ánh xạ đúng một trong 19 finding groups (12 R, 7 H).
- 64 local Markdown links hợp lệ khi kiểm tra; toàn bộ target thuộc findings.
- 56 screenshot source mappings được kiểm SHA256; 20 PNG độc nhất sau deduplication. Tất cả nguồn là screenshot của failed variant; không sửa byte ảnh.
- Expected của mọi instance khớp nguyên văn trong GUI_Checklist.md hiện có; không thay Expected để khớp thực tế.
- PNG metadata scan: chỉ IHDR, IDAT, IEND; không có text/EXIF metadata.
- Đã xem trực quan cả 20 ảnh: chỉ giao diện test EShop và dữ liệu sản phẩm/từ khóa kiểm thử; không thấy credential, tài khoản cá nhân, thông tin desktop ngoài ứng dụng. Không có trace.zip, tọa độ người dùng hoặc raw chat trong gói.
- Kết luận chỉ áp dụng saved Windows Chromium run. Không chạy lại SUT, không reset/seed hay sửa source/raw/supplements. Không publish issue hoặc commit.

Nguồn canonical: run 2026-11-08T07-51-06-876Z, REVIEW-SUPPLEMENT-005/EFFECTIVE-SUMMARY.json. Trạng thái: 75 pass, 31 fail, 15 blocked, 1 needs-review. Source paths trong manifest được giải từ run root, không phải các file raw được phân phối trong repository.
