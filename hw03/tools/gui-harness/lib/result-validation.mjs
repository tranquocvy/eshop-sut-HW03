import fs from 'node:fs';import path from 'node:path';
const assessments=new Set(['pass','fail','blocked','needs-review']);const native=new Set(['passed','failed','timedOut','skipped','interrupted']);
export function dependencyBlocked(r){return r.assessment==='blocked'&&r.blockKind==='dependency';}
export function validateResult(r){
 if(!r||typeof r!=='object'||r.schemaVersion!=='pilot-0.2')throw Error('Unsupported result schema');
 if(!/^GUI-\d{3}$/.test(r.id)||typeof r.variant!=='string'||!r.variant||/[\\/]/.test(r.variant))throw Error('Invalid instance key');
 if(!assessments.has(r.assessment)||!native.has(r.nativeStatus))throw Error('Invalid assessment/native status');
 if(!Object.hasOwn(r,'actual')||r.actual===undefined||!r.expected||typeof r.expected!=='string')throw Error('Missing expected/actual');
 if(r.actual===null&&r.assessment!=='blocked')throw Error('Missing actual observation');
 if(typeof r.platform!=='string'||!r.platform||typeof r.viewport!=='string'||!r.viewport||!Number.isInteger(r.attempt)||r.attempt<1)throw Error('Invalid environment/attempt');
 if(!Number.isFinite(Date.parse(r.startedAt))||!Number.isFinite(Date.parse(r.endedAt))||Date.parse(r.endedAt)<Date.parse(r.startedAt))throw Error('Invalid result timestamps');
 if(!Array.isArray(r.evidence)||r.evidence.some(f=>typeof f!=='string')||new Set(r.evidence).size!==r.evidence.length)throw Error('Invalid evidence references');
 if(![null,'dependency','technical'].includes(r.blockKind)||!(r.rootEvidence===null||typeof r.rootEvidence==='string'))throw Error('Invalid block fields');
 if(typeof r.oracleFailure!=='boolean'||!Array.isArray(r.oracleAssertions))throw Error('Explicit oracle outcome required');
 for(const a of r.oracleAssertions)if(!a.key||!['pass','fail'].includes(a.assessment)||!Object.hasOwn(a,'actual')||!a.expected||!['R','L','H'].includes(a.source?.class)||!Array.isArray(a.source?.refs)||!a.source.refs.length)throw Error('Invalid oracle assertion record');
 if(r.assessment==='pass'&&(r.nativeStatus!=='passed'||!r.oracleAssertions.length||r.oracleAssertions.some(a=>a.assessment!=='pass')||r.humanReview?.required))throw Error('False pass status');
 if(r.assessment==='fail'&&(r.nativeStatus!=='failed'||!r.oracleFailure||!r.oracleAssertions.some(a=>a.assessment==='fail')))throw Error('Fail without explicit oracle mismatch');
 if(r.assessment==='blocked'&&(!r.blockKind||!r.reason))throw Error('Blocked needs explicit kind/reason');
 if(r.assessment!=='blocked'&&r.blockKind!==null)throw Error('Block kind on nonblocked result');
 if(dependencyBlocked(r)&&(!r.rootEvidence||r.nativeStatus!=='skipped'))throw Error('Dependency block requires skipped + root reference');
 if(r.blockKind==='technical'&&r.rootEvidence!==null)throw Error('Technical block cannot pretend dependency root');
}
export function validateArtifact(file){
 const stat=fs.statSync(file);if(!stat.isFile()||stat.size===0)throw Error('Artifact must be nonempty regular file');
 const fd=fs.openSync(file,'r');const head=Buffer.alloc(32);try{fs.readSync(fd,head,0,32,0);}finally{fs.closeSync(fd);}
 const ext=path.extname(file).toLowerCase();
 if(ext==='.png'){if(stat.size<33||head.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||head.toString('ascii',12,16)!=='IHDR'||head.readUInt32BE(16)===0||head.readUInt32BE(20)===0)throw Error('Unrecognized PNG artifact');}
 else if(ext==='.zip'){if(stat.size<=22||head.readUInt32LE(0)!==0x04034b50)throw Error('Unrecognized nonempty ZIP artifact');}
 else if(ext==='.webm'){if(stat.size<32||head.readUInt32BE(0)!==0x1a45dfa3)throw Error('Unrecognized WebM artifact');}
 else throw Error('Unsupported artifact type');
}
