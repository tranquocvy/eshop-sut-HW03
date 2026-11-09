import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { repoRoot, ensureWork } from './environment.mjs';
export function sourceFingerprints() {
 const files = execFileSync('git', ['ls-files', '-z', '--', 'frontend-web', 'backend', 'frontend-admin', 'frontend-mobile'], { cwd: repoRoot, encoding: 'utf8' }).split(String.fromCharCode(0)).filter(Boolean);
 return Object.fromEntries(files.map(f => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(repoRoot, f))).digest('hex')]));
}
export function verifyFingerprints(before, after = sourceFingerprints()) {
 if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Source hoặc database SUT đã thay đổi. Dừng kiểm chứng.');
 return Object.keys(before).length;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
 const out = path.join(ensureWork(), 'source-fingerprints.json');
 if (process.argv.includes('--save')) { fs.writeFileSync(out, JSON.stringify(sourceFingerprints(), null, 2)); console.log('Đã lưu fingerprint source bên ngoài repo.'); }
 else if (fs.existsSync(out)) console.log('Không đổi: ' + verifyFingerprints(JSON.parse(fs.readFileSync(out, 'utf8'))) + ' file SUT.');
 else console.log('Chưa có baseline; chạy npm run integrity -- --save trước khi build.');
}
