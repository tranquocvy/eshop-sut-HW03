import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
export const harness=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Source trong repo và harness copy ngoài repo dùng chung biến override.
const candidate=path.resolve(harness,'../../..');
const repositorySource=fs.existsSync(path.join(candidate,'hw03/gui/GUI_Checklist.md'));
export const repo=path.resolve(process.env.SUT_REPO || (repositorySource?candidate:path.join(harness,'../../../eshop-sut-HW03')));
const work=repositorySource?path.resolve(repo,'../_working',path.basename(repo)):path.resolve(harness,'..');
export const runtime=path.resolve(process.env.SUT_RUNTIME || path.join(work,'t02-runtime'));
export const dependencySource=path.resolve(process.env.SUT_DEPENDENCY_SOURCE || path.join(work,'t01-runtime'));
export const runs=path.resolve(process.env.GUI_RUNS_ROOT || path.join(work,'t02-runs'));
export const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const json=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
export const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
export function sources(){return git('ls-files').split(/\r?\n/).filter(p=>/^(backend|frontend-web)\//.test(p)&&!p.includes('node_modules')&&!p.endsWith('database.sqlite'));}
export function fingerprint(){const files=Object.fromEntries(sources().map(p=>[p,sha(path.join(repo,p))]));return {head:git('rev-parse','HEAD'),files,repoDatabase:sha(path.join(repo,'backend/database.sqlite')),checklist:sha(path.join(repo,'hw03/gui/GUI_Checklist.md')),protectedAI:Object.fromEntries(['PromptLog.md','AI_Audit_Report.md','AI_Disclosure.md','AI_Privacy_Checklist.md'].map(f=>[f,sha(path.join(repo,'hw03/ai',f))]))};}

export function harnessFingerprint(){const entries={};function walk(dir){for(const e of fs.readdirSync(path.join(harness,dir),{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(mjs|cjs|json|md)$/.test(e.name))entries[p]=sha(path.join(harness,p));}}for(const d of ['lib','scripts','cases','tests'])walk(d);for(const f of ['package.json','package-lock.json','playwright.config.mjs','README.md'])entries[f]=sha(path.join(harness,f));return entries;}
