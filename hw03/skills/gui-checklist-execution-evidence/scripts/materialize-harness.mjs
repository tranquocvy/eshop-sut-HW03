import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
// Chỉ copy inventory source trong tools; không cài dependency/browser hoặc chạy SUT.
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../tools/gui-harness');
if(!fs.existsSync(path.join(source,'package.json')))throw Error('Missing sibling hw03/tools/gui-harness; keep repository layout intact');
const arg=process.argv[2];if(!arg)throw Error('Usage: node scripts/materialize-harness.mjs <NEW_HARNESS_DIRECTORY>');
const target=path.resolve(arg);if(fs.existsSync(target))throw Error('Refuse existing target; preserve current harness/evidence');
if(target===source||target.startsWith(source+path.sep))throw Error('Target must be outside runner source');
const manifest=JSON.parse(fs.readFileSync(path.join(source,'bundle-manifest.json'),'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const [file,hash]of Object.entries(manifest.files)){const full=path.resolve(source,file),rel=path.relative(source,fs.realpathSync(full));if(rel.startsWith('..')||path.isAbsolute(rel)||!fs.statSync(full).isFile())throw Error('Unsafe source '+file);if(sha(full)!==hash)throw Error('Stale source manifest '+file);}
fs.mkdirSync(target,{recursive:true});for(const file of [...Object.keys(manifest.files),'bundle-manifest.json']){const dest=path.join(target,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(source,file),dest,fs.constants.COPYFILE_EXCL);}
console.log(JSON.stringify({created:target,next:'Review README; set SUT_REPO/SUT_RUNTIME/SUT_DEPENDENCY_SOURCE/GUI_RUNS_ROOT; install npm ci and browser only with task authorization.',installed:false,startedRuntime:false}));
