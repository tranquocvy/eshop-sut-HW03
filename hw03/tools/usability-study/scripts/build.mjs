import path from 'node:path';
import fs from 'node:fs';
import { build } from 'vite';
import { appRoot, ensureWork } from './environment.mjs';
import { sourceFingerprints, verifyFingerprints } from './integrity.mjs';
const before = sourceFingerprints();
const work = ensureWork();
const outDir = path.join(work, 'portal-dist');
try {
 await build({ root: path.join(appRoot, 'portal'), build: { outDir, emptyOutDir: true } });
 fs.writeFileSync(path.join(work, 'portal-build.json'), JSON.stringify({builtAt:new Date().toISOString(),outDir,sourceFiles:Object.keys(before).length},null,2));
 console.log('Đã build web khảo sát ở thư mục làm việc riêng.');
} finally { verifyFingerprints(before); }
