import fs from 'node:fs';
import path from 'node:path';
import { appRoot, ensureWork, dependencyRoot } from './environment.mjs';
const deps = dependencyRoot();
if (!deps) throw new Error('Chưa tìm thấy thư viện React/Vite đã cài. Đặt STUDY_FRONTEND_DEPS tới thư mục node_modules của bản runtime riêng, rồi chạy lại. Không chạy cài đặt trong source SUT.');
ensureWork();
for (const dir of [appRoot, path.join(appRoot, 'portal')]) {
  fs.mkdirSync(dir, { recursive: true });
  const link = path.join(dir, 'node_modules');
  if (fs.existsSync(link)) {
    if (fs.realpathSync(link).toLowerCase() !== fs.realpathSync(deps).toLowerCase()) throw new Error('Thư viện hiện có khác đường dẫn đã chọn; kiểm tra thủ công, không tự ghi đè.');
  } else fs.symlinkSync(deps, link, process.platform === 'win32' ? 'junction' : 'dir');
}
console.log('Đã nối thư viện có sẵn. Không cài thêm gói và không sửa source SUT.');
