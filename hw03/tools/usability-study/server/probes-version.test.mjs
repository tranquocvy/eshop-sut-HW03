import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import net from 'node:net';import {createStudyService} from './index.mjs';
async function port(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
test('probe version config change and restart preserve prior invitation snapshot',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'study-probe-version-synthetic-'));const p=await port(),a=await port(),pc='http://127.0.0.1:'+p,ac='http://127.0.0.1:'+a;
 const config={participantFlow:'compact-screen-v1',probeVersion:'v0.3',organizer:'synthetic',organizerContact:'synthetic@example.invalid',storageDescription:'synthetic private',accessDescription:'synthetic only',withdrawBy:'2099-12-30',deleteBy:'2099-12-31'};
 let service=createStudyService({dataDir:dir,participantPort:p,adminPort:a,config}),cookie,csrf;
 async function call(route,body){const r=await fetch(ac+route,{method:body===undefined?'GET':'POST',headers:{Origin:ac,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(csrf?{'X-CSRF-Token':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)});return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
 async function login(){const r=await call('/api/admin/login',{password:(await fs.readFile(path.join(dir,'admin-password.txt'),'utf8')).trim()});assert.equal(r.status,200);cookie=r.cookie;csrf=r.data.csrf;}
 try{await service.start();await login();const inv=await call('/api/admin/invitations',{kind:'pilot',code:'PILOT-01'});assert.equal(inv.status,201);const old=(await call('/api/admin/export')).data.snapshots[0];assert.equal(old.provenance.instruments,'INSTRUMENTS-v0.3');
 assert.equal((await call('/api/admin/config',{config:{probeVersion:'v0.4',version:2}})).status,200);assert.equal((await call('/api/admin/config',{config:{probeVersion:'bogus'}})).status,400);
 const state=(await call('/api/admin/state')).data;assert.equal(state.config.probeVersion,'v0.4');assert.deepEqual((await call('/api/admin/export')).data.snapshots[0],old);
 await service.close();service=createStudyService({dataDir:dir,participantPort:p,adminPort:a,config:{...config,probeVersion:'v0.4'}});await service.start();cookie=csrf=undefined;await login();assert.deepEqual((await call('/api/admin/export')).data.snapshots[0],old);
 const token=new URL(inv.data.inviteUrl).hash.slice(8);const ex=await fetch(pc+'/api/exchange',{method:'POST',headers:{Origin:pc,'Content-Type':'application/json'},body:JSON.stringify({token})});assert.equal(ex.status,200);const e=await ex.json();assert.equal(e.config.probeVersion,'v0.3');assert.equal(e.config.provenance.instruments,'INSTRUMENTS-v0.3');
 }finally{await service.close();await fs.rm(dir,{recursive:true,force:true});}
});
