import fs from 'node:fs';
export function dependencyKey({page,platform,viewport,fixture}){return [page,platform,viewport,fixture].join('|');}
export function gate(record,scope){if(!record)return {allowed:false,reason:'prerequisite-not-executed'};if(record.scope!==dependencyKey(scope))return {allowed:false,reason:'prerequisite-scope-mismatch'};return record.assessment==='pass'?{allowed:true}:{allowed:false,reason:record.assessment==='needs-review'?'prerequisite-needs-review':'control-not-responding',rootEvidence:record.result};}
export function loadDependency(file,key){if(!fs.existsSync(file))return null;return JSON.parse(fs.readFileSync(file,'utf8'))[key]||null;}
