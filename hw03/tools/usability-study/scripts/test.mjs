import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { appRoot } from './environment.mjs';
const files = [];
function walk(dir) { if (!fs.existsSync(dir)) return; for (const e of fs.readdirSync(dir, {withFileTypes:true})) { const f=path.join(dir,e.name); if(e.isDirectory() && !['node_modules','dist'].includes(e.name)) walk(f); else if(e.isFile() && e.name.endsWith('.test.mjs')) files.push(f); } }
for(const d of ['tests','server','runtime']) walk(path.join(appRoot,d));
if(!files.length) throw new Error('Chưa có bài kiểm tra.');
const r=spawnSync(process.execPath,['--test',...files],{cwd:appRoot,stdio:'inherit'});
process.exitCode=r.status ?? 1;
