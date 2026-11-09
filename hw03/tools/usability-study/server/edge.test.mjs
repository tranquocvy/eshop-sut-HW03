import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,mkdir,writeFile,readdir,stat} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import {createStudyService} from './index.mjs';
const fields={organizer:'Synthetic',organizerContact:'synthetic@example.invalid',storageDescription:'temp',accessDescription:'test',deleteBy:'2099-12-31',withdrawBy:'2099-12-30'};
async function free(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
function req(base,route,{method='GET',body,raw,headers={},cookie,csrf}={}){return new Promise((resolve,reject)=>{
 const h={...headers};if(method!=='GET'&&h.Origin===undefined)h.Origin=base;if(cookie)h.Cookie=cookie;if(csrf)h['X-CSRF-Token']=csrf;if(body!==undefined)h['Content-Type']='application/json';
 const q=http.request(base+route,{method,headers:h},r=>{const parts=[];r.on('data',b=>parts.push(b));r.on('end',()=>{const text=Buffer.concat(parts).toString();let data;try{data=JSON.parse(text);}catch{data=text;}resolve({status:r.statusCode,data,headers:r.headers,text});});});q.on('error',reject);q.end(raw??(body===undefined?undefined:JSON.stringify(body)));
});}
async function fixture(extra={}){
 const parent=await mkdtemp(path.join(os.tmpdir(),'study-edge-synthetic-')),dir=path.join(parent,'private'),portal=path.join(parent,'portal');
 await mkdir(portal);await writeFile(path.join(portal,'index.html'),'<!doctype html><h1>Synthetic portal</h1>');await writeFile(path.join(portal,'secret.sqlite'),'not static');
 const p=await free(),a=await free(),pc='http://127.0.0.1:'+p,ac='http://127.0.0.1:'+a;
 const service=createStudyService({dataDir:dir,portalDir:portal,participantPort:p,adminPort:a,...extra,config:{...fields,...extra.config}});
 await service.start();const password=(await readFile(path.join(dir,'admin-password.txt'),'utf8')).trim();
 const r=await req(ac,'/api/admin/login',{method:'POST',body:{password}});assert.equal(r.status,200,r.text);
 const adminCookie=r.headers['set-cookie'][0].split(';')[0],adminCSRF=r.data.csrf;
 const admin=(route,body,opts={})=>req(ac,route,{method:body===undefined?'GET':'POST',body,cookie:adminCookie,csrf:adminCSRF,...opts});
 return {service,parent,dir,portal,pc,ac,password,admin,async close(){await service.close();await rm(parent,{recursive:true,force:true});}};
}
async function participant(f,headers={}){
 const inv=await f.admin('/api/admin/invitations',{kind:'pilot',code:'PILOT-01',expiresHours:1});assert.equal(inv.status,201,inv.text);
 const token=new URL(inv.data.inviteUrl).hash.slice(8),e=await req(f.pc,'/api/exchange',{method:'POST',body:{token},headers});assert.equal(e.status,200,e.text);
 const client={...e.data,cookie:e.headers['set-cookie'][0].split(';')[0],setCookie:e.headers['set-cookie'][0]};
 client.step=async(step,data,extra={})=>{const r=await req(f.pc,'/api/session/step',{method:'POST',cookie:client.cookie,csrf:client.csrf,headers,body:{step,data,revision:client.session.revision,operationId:crypto.randomUUID(),...extra}});if(r.status===200)Object.assign(client,r.data);return r;};
 client.refresh=async()=>Object.assign(client,(await req(f.pc,'/api/session',{cookie:client.cookie,headers})).data);
 return client;
}
async function toVideo(f,c,{screen=true,audio=true,accommodation,stopAtSUS=false}={}){
 const steps=[
 ['screening',{adult:true,vietnamese:true,shopping:true,outsideClass:true,uninvolved:true,experience:'synthetic',itBackground:'synthetic'}],
 ['consent',{participate:true,screen,audio,research:true,verification:true,publicEvidence:false,name:'Synthetic',maskedContact:'***'}]];
 for(const [k,d] of steps)assert.equal((await c.step(k,d)).status,200);
 if(accommodation){assert.equal((await f.admin('/api/admin/sessions/'+c.session.id+'/review',{accommodation})).status,200);await c.refresh();}
 assert.equal((await c.step('prepare',{recorderChecked:true,playbackChecked:true,callReady:true,desktop:true})).status,200);
 assert.equal((await f.admin('/api/admin/sessions/'+c.session.id+'/review',{releaseTask:true})).status,200);await c.refresh();
 for(const [k,d] of [['scenario',{understood:true}],['task',{finished:false,product:'',price:'',reason:'',stopReason:'synthetic'}],['sus',{values:Array(10).fill(null),missingReason:'synthetic missing'}],['probes',{clarity:'',recovery:'',recoveryObserved:null,speed:'',trust:'',improvement:'',missingReason:'synthetic refusal'}]]){if(stopAtSUS&&k==='sus')break;assert.equal((await c.step(k,d)).status,200);}
}
const mp4=Buffer.concat([Buffer.from([0,0,0,24]),Buffer.from('ftypisom'),Buffer.alloc(32)]);
function upload(f,c,options={}){return req(f.pc,'/api/evidence',{method:'POST',cookie:c.cookie,csrf:c.csrf,raw:mp4,headers:{'Content-Type':'video/mp4','X-File-Name':'synthetic.mp4','X-Operation-Id':crypto.randomUUID(),...options}});}
test('static root boundary, no admin routing, no secret queries, no reflected CORS',async()=>{
 const f=await fixture();try{
 assert.equal((await req(f.pc,'/')).status,200);
 assert.equal((await req(f.ac,'/admin')).status,200);
 assert.equal((await req(f.pc,'/secret.sqlite')).status,404);
 assert.equal((await req(f.pc,'/../private/admin-password.txt')).status,404);
 assert.equal((await req(f.pc,'/%2e%2e%5cprivate/admin-password.txt')).status,404);
 assert.equal((await req(f.pc,'/health',{headers:{Origin:'http://evil.invalid'}})).headers['access-control-allow-origin'],undefined);
 assert.equal((await req(f.ac,'/api/admin/state',{headers:{'X-Forwarded-For':'127.0.0.1'}})).status,401);
 assert.equal((await f.admin('/api/admin/config',{config:{}},{headers:{Origin:''}})).status,403);
 assert.equal((await req(f.pc,'/api/exchange',{method:'POST',body:{token:'invalid'}})).status,401);
 const i=await f.admin('/api/admin/invitations',{kind:'pilot',code:'PILOT-01',expiresHours:1e-12});
 const r=await req(f.pc,'/api/exchange',{method:'POST',body:{token:new URL(i.data.inviteUrl).hash.slice(8)}});assert.equal(r.status,401);
 }finally{await f.close();}
});
test('configured HTTPS exact origin/host produces Secure host-only cookie',async()=>{
 const f=await fixture({config:{studyOrigin:'https://study.example.invalid',sutOrigin:'https://sut.example.invalid'}});
 try{
 const c=await participant(f,{Host:'study.example.invalid',Origin:'https://study.example.invalid'});
 assert(c.setCookie.includes('; Secure'));assert(!c.setCookie.includes('Domain='));
 assert.equal((await req(f.pc,'/api/session',{cookie:c.cookie})).status,403);
 assert.equal((await req(f.pc,'/api/session',{cookie:c.cookie,headers:{Host:'study.example.invalid',Origin:'https://sut.example.invalid'}})).status,403);
 assert.equal((await req(f.pc,'/api/session',{cookie:c.cookie,headers:{Host:'study.example.invalid',Origin:'https://study.example.invalid','X-Forwarded-Host':'evil.invalid'}})).status,200);
 }finally{await f.close();}
});
test('consent refusal cannot silently pass prepare; accommodation is explicit; upload phase gating',async()=>{
 const f=await fixture();try{
 const c=await participant(f);
 assert.equal((await upload(f,c)).status,409);
 assert.equal((await c.step('screening',{adult:true,vietnamese:true,shopping:true,outsideClass:true,uninvolved:true,experience:'',itBackground:''})).status,200);
 assert.equal((await c.step('consent',{participate:true,screen:false,audio:false,research:true,verification:true,publicEvidence:false,name:'',maskedContact:''})).status,200);
 const p={recorderChecked:false,playbackChecked:false,callReady:true,desktop:true};
 assert.equal((await c.step('prepare',p)).status,400);
 assert.equal((await f.admin('/api/admin/sessions/'+c.session.id+'/review',{accommodation:'Synthetic explicit decision: no recording; observe live only'})).status,200);await c.refresh();
 assert.equal((await c.step('prepare',p)).status,200);
 assert.equal(c.session.answers.consent.screen,false);assert.equal(c.session.answers.consent.audio,false);
 }finally{await f.close();}
});
test('streaming size and global quotas reject without losing surveys or leaving staging files',async()=>{
 for(const extra of [{config:{maxVideoMB:0.00003}},{maxStorageMB:0.00003}]){
 const f=await fixture(extra);try{
 const c=await participant(f);await toVideo(f,c);
 const r=await upload(f,c,{'Transfer-Encoding':'chunked'});assert.equal(r.status,413,r.text);
 await c.refresh();assert.equal(c.session.phase,'video');assert.deepEqual(c.session.answers.sus.values,Array(10).fill(null));
 assert.deepEqual(await readdir(path.join(f.dir,'tmp')),[]);assert.deepEqual(await readdir(path.join(f.dir,'videos')),[]);
 }finally{await f.close();}
 }
});
test('manual import requires source, WebM magic accepted, no fabricated waiver, disconnected upload cleans temp',async()=>{
 const f=await fixture();try{
 const c=await participant(f);await toVideo(f,c);
 const route='/api/admin/sessions/'+c.session.id+'/evidence',headers={'Content-Type':'video/webm','X-File-Name':'synthetic.webm','X-Operation-Id':crypto.randomUUID()};
 const webm=Buffer.concat([Buffer.from([0x1a,0x45,0xdf,0xa3]),Buffer.alloc(36)]);
 let r=await f.admin(route,undefined,{method:'POST',raw:webm,headers});assert.equal(r.status,400);
 headers['X-Source-Description']='Synthetic received by moderator test only';r=await f.admin(route,undefined,{method:'POST',raw:webm,headers});assert.equal(r.status,201,r.text);
 const id=r.data.evidence.id;
 assert.equal((await f.admin('/api/admin/sessions/'+c.session.id+'/review',{evidenceReview:{id:'missing',status:'waived-with-reason',reason:'test'}})).status,404);
 assert.equal((await f.admin('/api/admin/sessions/'+c.session.id+'/review',{evidenceReview:{id,status:'needs-replacement',reason:'Synthetic fixture not a full movie'}})).status,200);
 // Disconnect after request data is sent; wait for socket close, then a normal request confirms service remains usable.
 await new Promise(resolve=>{
 const q=http.request(f.pc+'/api/evidence',{method:'POST',headers:{Origin:f.pc,Cookie:c.cookie,'X-CSRF-Token':c.csrf,'Content-Type':'video/mp4','Content-Length':'1000','X-File-Name':'broken.mp4','X-Operation-Id':crypto.randomUUID()}});
 q.on('error',()=>resolve());q.on('close',resolve);q.flushHeaders();q.write(mp4);setTimeout(()=>q.destroy(),30);
 });
 await c.refresh();assert.equal(c.session.phase,'video');
 // An ordinary round trip settles the asynchronous aborted request cleanup.
 await f.admin('/api/admin/state');assert.deepEqual(await readdir(path.join(f.dir,'tmp')),[]);
 }finally{await f.close();}
});
test('withdraw removes sole identity from SQLite, evidence, exports, and correlated finding',async()=>{
 const f=await fixture();try{
 const c=await participant(f);await toVideo(f,c);assert.equal((await upload(f,c)).status,201);
 await c.refresh();assert.equal((await c.step('finish',{videoLater:false,videoReason:''})).status,200);
 const finding={title:'synthetic',kind:'design',severity:'minor',reason:'synthetic',participantIds:[c.session.id],evidenceRefs:c.session.evidence.map(e=>e.id),expected:'',actual:'',reproduction:'',recommendation:'',issueUrl:''};
 assert.equal((await f.admin('/api/admin/findings',finding)).status,200);
 assert.equal((await c.step('withdraw',{reason:'synthetic'})).status,200);
 const s=await f.admin('/api/admin/state');assert.equal(s.data.findings.length,0);assert.deepEqual(s.data.sessions[0].answers,{});
 assert.deepEqual(await readdir(path.join(f.dir,'videos')),[]);
 const db=await readFile(path.join(f.dir,'study.sqlite'));assert(!db.includes(Buffer.from('"name":"Synthetic"')));
 assert.equal((await f.admin('/api/admin/export?format=participants')).data.participants.length,0);
 }finally{await f.close();}
});
test('admin rate limit is real and storage inside repository is rejected',async()=>{
 const f=await fixture();try{
 for(let i=0;i<7;i++)assert.equal((await req(f.ac,'/api/admin/login',{method:'POST',body:{password:'wrong'}})).status,401);
 assert.equal((await req(f.ac,'/api/admin/login',{method:'POST',body:{password:f.password}})).status,429);
 }finally{await f.close();}
 const forbidden=path.resolve('hw03/tools/usability-study/server/rejected-private-data');
 const svc=createStudyService({dataDir:forbidden});
 await assert.rejects(()=>svc.start(),/outside repository/);
 await assert.rejects(()=>stat(forbidden),{code:'ENOENT'});
});
test('no evidence requires explicit missing reason independent of videoLater and remains pending',async()=>{
 const f=await fixture();try{
 const c=await participant(f);await toVideo(f,c);
 assert.equal((await c.step('finish',{videoLater:false,videoReason:''})).status,400);
 assert.equal(c.session.phase,'video');
 assert.equal((await c.step('finish',{videoLater:false,videoReason:'Không có recording; đã từ chối, moderator cần ghi giới hạn.'})).status,200);
 assert.equal(c.session.phase,'done');assert.equal(c.session.evidenceStatus,'pending');
 const r=await f.admin('/api/admin/export');assert.equal(r.data.summary.reviewedMain,0);assert.equal(r.data.summary.assignmentComplete,false);
 }finally{await f.close();}
});
test('consent draft never durably saves identity without all affirmative required choices; decline scrubs prior draft',async()=>{
 const f=await fixture();try{
 const c=await participant(f);
 await c.step('screening',{adult:true,vietnamese:true,shopping:true,outsideClass:true,uninvolved:true,experience:'',itBackground:''});
 const choices={participate:true,screen:false,audio:false,research:true,verification:true,publicEvidence:false,name:'ONLY-PRIVATE-IDENTITY',maskedContact:'con***'};
 for(const patch of [{participate:false},{research:false},{verification:false}]){
  const r=await c.step('consent',{...choices,...patch},{draft:true});assert.equal(r.status,200);
  assert.equal(r.data.session.drafts.consent.name,undefined);assert.equal(r.data.session.drafts.consent.maskedContact,undefined);
  assert.equal(r.data.session.answers.consent,undefined);
  assert(!(await readFile(path.join(f.dir,'study.sqlite'))).includes(Buffer.from(choices.name)));
  assert(!(await f.admin('/api/admin/export?format=participants')).text.includes(choices.name));
 }
 assert.equal((await c.step('consent',choices,{draft:true})).status,200);
 assert((await readFile(path.join(f.dir,'study.sqlite'))).includes(Buffer.from(choices.name)));
 const r=await c.step('consent',{...choices,participate:false});assert.equal(r.status,200);assert.equal(c.session.phase,'declined');
 assert.equal(c.session.answers.consent.participate,false);assert.equal(c.session.answers.consent.screen,false);
 assert.equal(c.session.answers.consent.name,undefined);
 assert(!(await readFile(path.join(f.dir,'study.sqlite'))).includes(Buffer.from(choices.name)));
 }finally{await f.close();}
});
test('invitations refuse invalid calendar dates, expired policy and withdrawal after deletion',async()=>{
 const f=await fixture();try{
 for(const bad of [
 {withdrawBy:'2099-02-29'},{deleteBy:'2099-04-31'},{withdrawBy:'2000-01-01'},
 {deleteBy:'2000-01-01'},{withdrawBy:'2099-12-31',deleteBy:'2099-12-30'},{withdrawBy:'2099-13-01'}
 ]){
  assert.equal((await f.admin('/api/admin/config',{config:{...fields,...bad}})).status,200);
  const r=await f.admin('/api/admin/invitations',{kind:'pilot',code:'PILOT-01'});assert.equal(r.status,400,r.text);
 }
 assert.equal((await f.admin('/api/admin/config',{config:fields})).status,200);
 assert.equal((await f.admin('/api/admin/invitations',{kind:'pilot',code:'PILOT-01'})).status,201);
 }finally{await f.close();}
});
test('participant credential expires server-side at 24h even across restart; reissue/revoke clear old credentials',async(t)=>{
 const f=await fixture();try{
 const c=await participant(f),base=Date.now();t.mock.timers.enable({apis:['Date'],now:base});
 t.mock.timers.tick(86400000);
 assert.equal((await req(f.pc,'/api/session',{cookie:c.cookie})).status,401);
 assert.equal((await c.step('screening',{adult:true},{draft:true})).status,401);
 await f.service.close();await f.service.start();
 assert.equal((await req(f.pc,'/api/session',{cookie:c.cookie})).status,401);
 const login=await req(f.ac,'/api/admin/login',{method:'POST',body:{password:f.password}});
 const admin=(body)=>req(f.ac,'/api/admin/sessions/'+c.session.id+'/invitation',{method:'POST',body,cookie:login.headers['set-cookie'][0].split(';')[0],csrf:login.data.csrf});
 const re=await admin({revoke:false,expiresHours:1});assert.equal(re.status,200);
 const e=await req(f.pc,'/api/exchange',{method:'POST',body:{token:new URL(re.data.inviteUrl).hash.slice(8)}});
 assert.equal(e.status,200);assert(!e.text.includes('credentialExpiresAt'));
 const newCookie=e.headers['set-cookie'][0].split(';')[0];
 assert.equal((await req(f.pc,'/api/session',{cookie:newCookie})).status,200);
 assert.equal((await req(f.pc,'/api/session',{cookie:c.cookie})).status,401);
 assert.equal((await admin({revoke:true})).status,200);
 assert.equal((await req(f.pc,'/api/session',{cookie:newCookie})).status,401);
 }finally{t.mock.timers.reset();await f.close();}
});
test('structured Vietnamese reports preserve raw JSON separately, denominators, missing data and XSS defenses',async()=>{
 const f=await fixture();try{
 const c=await participant(f);await toVideo(f,c);
 await c.step('finish',{videoLater:false,videoReason:'Không quay, chưa có evidence'});
 await f.admin('/api/admin/sessions/'+c.session.id+'/review',{reviewed:true,notes:'Pilot change rationale: <img src=x onerror=alert(1)>',outcome:'unfinished',taskSeconds:12,timingSource:'Quan sát live synthetic'});
 await f.admin('/api/admin/config',{config:{pilotReview:true,frozen:true,version:2}});
 await f.admin('/api/admin/findings',{title:'<script>alert(1)</script>',kind:'usability',severity:'major',reason:'Cản task',participantIds:[c.session.id],evidenceRefs:[],expected:'Mở chi tiết',actual:'Dừng',reproduction:'Bước 1 | Bước 2',recommendation:'Kiểm lỗi',issueUrl:'https://example.invalid/issues/1'});
 const j=await f.admin('/api/admin/export');
 assert.equal(j.data.sessions[0].sus.score,null);assert.equal(j.data.sessions[0].answers.sus.values.length,10);
 assert.equal(j.data.sessions[0].review.notes.length,1);assert.equal(j.data.configHistory.length,1);assert.equal(j.data.sessions[0].snapshot.version,1);
 for(const format of ['markdown','html']){
  const r=await f.admin('/api/admin/export?format='+format);assert.equal(r.status,200);
  for(const s of ['Mục tiêu','Scenario','Phương pháp','mẫu số','SUS','Performance','freeze','Findings','Evidence manifest','DRAFT','privacy','12','Quan sát live synthetic','issues/1','&lt;script&gt;'])assert(r.text.includes(s),s);
  assert(!r.text.includes('<script>'));assert(!r.text.includes('<img src=x'));assert(!r.text.includes('<pre>'));assert(!r.text.includes('"sessions":'));
  if(format==='html'){assert(r.text.includes('<table>'));assert(r.text.includes('<h2>'));}
  else assert(r.text.includes('&#124;'));
 }
 }finally{await f.close();}
});
test('safe startup provenance is frozen per invitation, immutable in config, persists and refuses build mixing',async()=>{
 const provenance={sutCommit:'a'.repeat(40),sourceHashes:{'frontend-web/src/main.jsx':'b'.repeat(64),'backend/database.sqlite':'c'.repeat(64)},transport:'External Axios URL prefix adapter; original source byte-identical'};
 const f=await fixture({provenance});try{
 const c=await participant(f);assert.deepEqual(c.config.sutProvenance,provenance);
 assert.equal((await f.admin('/api/admin/config',{config:{sutProvenance:null}})).status,400);
 const exp=await f.admin('/api/admin/export');assert.deepEqual(exp.data.sessions[0].snapshot.sutProvenance,provenance);
 const report=await f.admin('/api/admin/export?format=html');assert(report.text.includes(provenance.sutCommit));assert(report.text.includes('frontend-web/src/main.jsx'));assert(report.text.includes('b'.repeat(64)));
 await f.service.close();await f.service.start();
 const mismatch=createStudyService({dataDir:f.dir,participantPort:0,adminPort:0,provenance:{...provenance,sutCommit:'d'.repeat(40)}});
 await assert.rejects(()=>mismatch.start(),/Provenance SUT khác/);
 await mismatch.close();
 const omitted=createStudyService({dataDir:f.dir,participantPort:0,adminPort:0});await assert.rejects(()=>omitted.start(),/Provenance SUT khác/);await omitted.close();
 }finally{await f.close();}
 for(const name of ['../private','C:/private','/private','dir/../secret']){
 assert.throws(()=>createStudyService({dataDir:os.tmpdir(),provenance:{...provenance,sourceHashes:{[name]:'b'.repeat(64)}}}),/đường dẫn/);
 }
});
test('neutral SUS draft restores across restart but stays unscored and separate until final submission',async()=>{
 const f=await fixture();try{
 const c=await participant(f);await toVideo(f,c,{stopAtSUS:true});assert.equal(c.session.phase,'sus');
 const historical=structuredClone(c.session.answers);
 const draft={values:Array(10).fill(3),missingReason:''};
 assert.equal((await c.step('sus',draft,{draft:true})).status,200);
 assert.equal(c.session.answers.sus,undefined);assert.deepEqual(c.session.drafts.sus,draft);
 await f.service.close();await f.service.start();await c.refresh();
 assert.deepEqual(c.session.answers,historical);assert.deepEqual(c.session.drafts.sus,draft);
 // Admin authentication is intentionally memory-only after restart.
 const login=await req(f.ac,'/api/admin/login',{method:'POST',body:{password:f.password}});
 const admin=(format)=>req(f.ac,'/api/admin/export?format='+format,{cookie:login.headers['set-cookie'][0].split(';')[0]});
 const pending=(await admin('json')).data.sessions[0];
 assert.equal(pending.answers.sus,undefined);assert.deepEqual(pending.drafts.sus,draft);
 assert.equal(pending.sus.score,null);assert.equal(pending.sus.contributions,null);assert.equal(pending.sus.status,'draft');
 assert((await admin('markdown')).text.includes('Bản nháp'));
 assert((await admin('csv')).text.includes('"draft"'));
 assert.equal((await c.step('sus',draft)).status,200);assert.equal(c.session.phase,'probes');
 assert.equal(c.session.drafts.sus,undefined);assert.deepEqual(c.session.answers.sus,draft);
 const final=(await admin('json')).data.sessions[0];
 assert.equal(final.sus.score,50);assert.deepEqual(final.sus.contributions,Array(10).fill(2));assert.equal(final.sus.status,'submitted');
 assert.equal(final.drafts.sus,undefined);assert.deepEqual(final.answers.task,historical.task);
 assert.equal((await c.step('sus',{values:Array(10).fill(5),missingReason:''},{draft:true})).status,409);
 }finally{await f.close();}
});
test('legacy current-phase answers migrate to draft without changing historical final answers',async()=>{
 const f=await fixture();try{
 const c=await participant(f);await toVideo(f,c,{stopAtSUS:true});
 const historical=structuredClone(c.session.answers);
 await f.service.close();
 const {DatabaseSync}=await import('node:sqlite'),db=new DatabaseSync(path.join(f.dir,'study.sqlite'));
 try{
 const state=JSON.parse(db.prepare('SELECT value FROM state WHERE id=1').get().value);
 state.sessions[0].answers.sus={values:Array(10).fill(3),missingReason:''};
 db.prepare('UPDATE state SET value=? WHERE id=1').run(JSON.stringify(state));
 }finally{db.close();}
 await f.service.start();await c.refresh();
 assert.deepEqual(c.session.answers,historical);assert.deepEqual(c.session.drafts.sus.values,Array(10).fill(3));
 assert.equal((await c.step('sus',c.session.drafts.sus)).status,200);
 assert.equal(c.session.drafts.sus,undefined);assert.deepEqual(c.session.answers.task,historical.task);
 }finally{await f.close();}
});
