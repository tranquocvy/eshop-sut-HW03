import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
export const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const repoRoot = path.resolve(appRoot, '../../..');
export const workRoot = path.resolve(process.env.STUDY_WORK_DIR || path.join(repoRoot, '..', '_working', path.basename(repoRoot), 'online-study'));
export function outsideRepo(candidate) {
  const full = path.resolve(candidate);
  const rel = path.relative(repoRoot, full);
  if (!rel || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel))) throw new Error('Dữ liệu riêng và bản build phải nằm ngoài repository.');
  return full;
}
export function ensureWork() { outsideRepo(workRoot); fs.mkdirSync(workRoot, { recursive: true }); return workRoot; }
export function dependencyRoot() {
  const candidates = [process.env.STUDY_FRONTEND_DEPS, path.resolve(repoRoot, '../_working', path.basename(repoRoot), 't01-runtime/frontend-web/node_modules'), path.resolve(repoRoot, '../_working', path.basename(repoRoot), 't02-runtime/frontend-web/node_modules')].filter(Boolean);
  return candidates.find(p => fs.existsSync(path.join(p, 'vite/package.json')) && fs.existsSync(path.join(p, 'react/package.json')));
}
