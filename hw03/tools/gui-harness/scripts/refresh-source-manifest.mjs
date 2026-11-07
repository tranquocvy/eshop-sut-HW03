import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
// Chỉ cập nhật inventory source runner, không copy code vào skill hoặc chạy SUT.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=['.gitignore','README.md','package.json','package-lock.json','playwright.config.mjs'];
function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.isFile())files.push(p);else throw Error('Refuse nonregular source '+p);}}
for(const dir of ['scripts','lib','cases','tests'])walk(dir);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest={kind:'runner-source; not execution results',runner:'@playwright/test 1.65.0',excluded:['node_modules','.browsers','runtime database','screenshots','logs','run artifacts'],files:Object.fromEntries(files.sort().map(f=>[f.split(path.sep).join('/'),sha(path.join(root,f))]))};
fs.writeFileSync(path.join(root,'bundle-manifest.json'),JSON.stringify(manifest,null,2)+String.fromCharCode(10));console.log(JSON.stringify({sourceFiles:files.length,skillFolderUnchanged:true}));
