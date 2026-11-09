import {test,after,before} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,stat,readdir} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import http from 'node:http';
import {createStudyService} from './index.mjs';
import {scoreSUS,validateStep,csvCell} from './domain.mjs';
let dir,service,p,a,pc,ac,adminCSRF,adminCookie;
async function freePort(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
async function request(base,route,{method='GET',body,headers={},cookie,csrf,raw}={}){
 const h={...headers};if(method!=='GET'&&!('Origin' in h))h.Origin=base;if(cookie)h.Cookie=cookie;if(csrf)h['X-CSRF-Token']=csrf;
 if(body!==undefined)h['Content-Type']='application/json';
 return new Promise((resolve,reject)=>{const q=http.request(base+route,{method,headers:h},r=>{const parts=[];r.on('data',b=>parts.push(b));r.on('end',()=>{const text=Buffer.concat(parts).toString();let data;try{data=JSON.parse(text);}catch{data=text;}const headers=new Headers();for(const [k,v] of Object.entries(r.headers))if(v!==undefined)headers.set(k,Array.isArray(v)?v.join(','):v);resolve({status:r.statusCode,data,headers,text});});});q.on('error',reject);q.end(raw??(body===undefined?undefined:JSON.stringify(body)));});
}
async function admin(route,body,opts={}){return request(ac,route,{method:body===undefined?'GET':'POST',body,cookie:adminCookie,csrf:adminCSRF,...opts});}
const filledConfig={organizer:'Synthetic technician',organizerContact:'synthetic@example.invalid',storageDescription:'Private synthetic temp directory',accessDescription:'Synthetic moderator only',deleteBy:'2099-12-31',withdrawBy:'2099-12-30'};
const screening={adult:true,vietnamese:true,shopping:true,outsideClass:true,uninvolved:true,experience:'test synthetic',itBackground:'test synthetic'};
const consent={participate:true,screen:true,audio:true,research:true,verification:true,publicEvidence:false,name:'SYNTHETIC-IDENTITY-ONLY',maskedContact:'sy***@example.invalid'};
const prepare={recorderChecked:true,playbackChecked:true,callReady:true,desktop:true};
async function invite(kind,code){const r=await admin('/api/admin/invitations',{kind,code,expiresHours:1});assert.equal(r.status,201,r.text);assert(!r.text.includes('cookieHash'));return r.data;}
async function exchange(invite){const token=new URL(invite.inviteUrl).hash.slice('#invite='.length),r=await request(pc,'/api/exchange',{method:'POST',body:{token}});assert.equal(r.status,200,r.text);return {...r.data,cookie:r.headers.get('set-cookie').split(';')[0],token};}
async function step(client,step,data,extra={}){const r=await request(pc,'/api/session/step',{method:'POST',cookie:client.cookie,csrf:client.csrf,body:{step,data,revision:client.session.revision,operationId:crypto.randomUUID(),...extra}});if(r.status===200)Object.assign(client,r.data);return r;}
async function flow(client){
 for(const [key,data] of [['screening',screening],['consent',consent],['prepare',prepare]])assert.equal((await step(client,key,data)).status,200);
 const release=await admin('/api/admin/sessions/'+client.session.id+'/review',{releaseTask:true,notes:'Synthetic moderation note'});assert.equal(release.status,200,release.text);
 Object.assign(client,(await request(pc,'/api/session',{cookie:client.cookie})).data);
 for(const [key,data] of [['scenario',{understood:true}],['task',{finished:false,product:'',price:'',reason:'',stopReason:'Synthetic stop, no real session'}],['sus',{values:Array(10).fill(3),missingReason:''}],['probes',{clarity:'synthetic',recovery:'not observed',recoveryObserved:null,speed:'synthetic',trust:'synthetic',improvement:'',missingReason:'No actual observed recovery'}]])assert.equal((await step(client,key,data)).status,200);
}
before(async()=>{
 dir=await mkdtemp(path.join(os.tmpdir(),'study-server-synthetic-'));
 p=await freePort();a=await freePort();pc='http://127.0.0.1:'+p;ac='http://127.0.0.1:'+a;
 service=createStudyService({dataDir:dir,participantPort:p,adminPort:a});await service.start();
});
after(async()=>{await service?.close();await rm(dir,{recursive:true,force:true});});
test('SUS extrema, missing and invalid input; CSV formula defense',()=>{
 assert.equal(scoreSUS([5,1,5,1,5,1,5,1,5,1]).score,100);
 assert.equal(scoreSUS([1,5,1,5,1,5,1,5,1,5]).score,0);
 assert.equal(scoreSUS(Array(10).fill(3)).score,50);
 for(const v of [undefined,[],Array(10).fill(null),Array(10).fill(0),Array(10).fill(1.5)])assert.equal(scoreSUS(v).score,null);
 assert.equal(csvCell('=cmd'),'"\'=cmd"');
});
test('domain rejects implicit choices, bad SUS, phase and contact coercion',()=>{
 const s={phase:'consent',answers:{},review:{}};
 assert.throws(()=>validateStep(s,'consent',{participate:true}),/Vui lòng/);
 assert.throws(()=>validateStep(s,'sus',{values:Array(10).fill(6),missingReason:''}),/SUS/);
 assert.throws(()=>validateStep(s,'consent',{...consent,maskedContact:'full@example.invalid'}),/che/);
 assert.equal(validateStep(s,'consent',{...consent,participate:false}),'declined');
 assert.equal(validateStep(s,'screening',{...screening,adult:false}),'ineligible');
});
test('bootstrap, auth, boundaries, and empty real dataset',async()=>{
 assert.equal((await request(pc,'/health')).status,200);
 for(const route of ['/api/admin/state','/api/admin/bootstrap'])assert.equal((await request(pc,route,{headers:{'X-Forwarded-Host':new URL(ac).host}})).status,404);
 assert.equal((await request(pc,'/health',{headers:{Host:'evil.invalid'}})).status,403);
 assert.equal((await request(pc,'/health',{headers:{Origin:'https://evil.invalid'}})).status,403);
 assert.equal((await request(ac,'/api/admin/state')).status,401);
 const boot=await request(ac,'/api/admin/bootstrap');assert.deepEqual(boot.data,{needsLogin:true,configured:true});
 const password=(await readFile(path.join(dir,'admin-password.txt'),'utf8')).trim();
 assert(!boot.text.includes(password));
 assert.equal((await request(ac,'/api/admin/login',{method:'POST',headers:{Origin:pc},body:{password}})).status,403);
 assert.equal((await request(ac,'/api/admin/login',{method:'POST',body:{password:'wrong'}})).status,401);
 const r=await request(ac,'/api/admin/login',{method:'POST',body:{password}});assert.equal(r.status,200,r.text);
 adminCSRF=r.data.csrf;adminCookie=r.headers.get('set-cookie').split(';')[0];
 assert(r.headers.get('set-cookie').includes('HttpOnly'));assert(r.headers.get('set-cookie').includes('SameSite=Strict'));assert(!r.headers.get('set-cookie').includes('Domain='));
 assert.deepEqual((await admin('/api/admin/state')).data.sessions,[]);
 assert.equal((await admin('/api/admin/config',{config:filledConfig},{csrf:'wrong'})).status,403);
});
let pilot,main;
test('config/invite gates and origin/host protections',async()=>{
 assert.equal((await admin('/api/admin/invitations',{kind:'pilot',code:'PILOT-01',expiresHours:1})).status,400);
 assert.equal((await admin('/api/admin/config',{config:{sutOrigin:pc}})).status,400);
 assert.equal((await admin('/api/admin/config',{config:{adminOrigin:'https://evil.invalid'}})).status,400);
 assert.equal((await admin('/api/admin/config',{config:filledConfig})).status,200);
 assert.equal((await admin('/api/admin/invitations',{kind:'main',code:'P01'})).status,409);
 assert.equal((await admin('/api/admin/config',{config:{pilotReview:true,frozen:true}})).status,409);
 const i=await invite('pilot','PILOT-01');pilot=await exchange(i);
 assert.equal((await request(pc,'/api/exchange',{method:'POST',body:{token:pilot.token}})).status,401);
 assert.equal((await request(pc,'/api/exchange?token=secret',{method:'POST',body:{token:pilot.token}})).status,400);
 const dbRaw=await readFile(path.join(dir,'study.sqlite'));assert(!dbRaw.includes(Buffer.from(pilot.token)));
 assert.equal((await request(pc,'/api/session')).status,401);
 assert.equal((await request(pc,'/api/session',{cookie:pilot.cookie})).data.session.id,pilot.session.id);
 assert.equal((await step(pilot,'task',{finished:false})).status,409);
 assert.equal((await request(pc,'/api/session/step',{method:'POST',cookie:pilot.cookie,csrf:'bad',body:{}})).status,403);
 assert.equal((await request(pc,'/api/session/step',{method:'POST',cookie:pilot.cookie,csrf:pilot.csrf,headers:{Origin:ac},body:{}})).status,403);
});
test('draft, stale revision, operation replay, exact phase/release gates',async()=>{
 const op=crypto.randomUUID();
 const r=await step(pilot,'screening',{adult:true},{draft:true,operationId:op});assert.equal(r.status,200);assert.equal(pilot.session.phase,'screening');
 assert.equal((await step(pilot,'screening',screening,{revision:0})).status,409);
 assert.equal((await step(pilot,'screening',screening,{revision:0,operationId:op})).status,200);assert.equal(pilot.session.phase,'screening');
 assert.equal((await step(pilot,'screening',screening)).status,200);
 assert.equal((await step(pilot,'consent',consent)).status,200);
 assert.equal((await step(pilot,'prepare',prepare)).status,200);
 assert.equal((await step(pilot,'scenario',{understood:true})).status,409);
 const released=await admin('/api/admin/sessions/'+pilot.session.id+'/review',{releaseTask:true});assert.equal(released.status,200);
 Object.assign(pilot,(await request(pc,'/api/session',{cookie:pilot.cookie})).data);
 assert.equal((await step(pilot,'scenario',{understood:true})).status,200);
 assert.equal((await step(pilot,'task',{finished:true,product:'',price:'',reason:'',stopReason:''})).status,400);
 assert.equal((await step(pilot,'task',{finished:false,product:'',price:'',reason:'',stopReason:'Synthetic interruption'})).status,200);
 assert.equal((await step(pilot,'sus',{values:Array(10).fill(null),missingReason:''})).status,400);
 assert.equal((await step(pilot,'sus',{values:Array(10).fill(3),missingReason:''})).status,200);
 assert.equal((await step(pilot,'probes',{clarity:'',recovery:'',recoveryObserved:null,speed:'',trust:'',improvement:'',missingReason:'Synthetic refusal, not coerced'})).status,200);
});
const mp4=Buffer.concat([Buffer.from([0,0,0,24]),Buffer.from('ftypisom'),Buffer.alloc(32)]);
async function video(client,{adminImport=false,data=mp4,type='video/mp4',name='synthetic.mp4',op=crypto.randomUUID(),source='Synthetic import',headers={}}={}){
 const base=adminImport?ac:pc,route=adminImport?'/api/admin/sessions/'+client.session.id+'/evidence':'/api/evidence';
 return request(base,route,{method:'POST',cookie:adminImport?adminCookie:client.cookie,csrf:adminImport?adminCSRF:client.csrf,raw:data,headers:{'Content-Type':type,'X-File-Name':encodeURIComponent(name),'X-Operation-Id':op,...(adminImport?{'X-Source-Description':source}:{}),...headers}});
}
let evidenceId;
test('upload MIME/magic/path/quota, dedupe, protected playback and actual verification',async()=>{
 assert.equal((await video(pilot,{type:'text/html'})).status,415);
 assert.equal((await video(pilot,{data:Buffer.alloc(50)})).status,415);
 assert.equal((await video(pilot,{name:'../secret.mp4'})).status,400);
 assert.equal((await video(pilot,{headers:{'Content-Length':'600000000'},data:undefined})).status,413);
 const op=crypto.randomUUID(),r=await video(pilot,{op});assert.equal(r.status,201,r.text);evidenceId=r.data.evidence.id;
 assert(!r.text.includes('filename'));assert.equal(r.data.evidence.status,'received');
 const replay=await video(pilot,{op});assert.equal(replay.status,200);assert(!replay.text.includes('sha256'));assert(!replay.text.includes('filename'));
 const duplicate=await video(pilot);assert.equal(duplicate.status,200);assert.equal(duplicate.data.duplicate,true);
 assert.equal((await request(pc,'/api/admin/evidence/'+evidenceId,{cookie:pilot.cookie})).status,404);
 assert.equal((await request(ac,'/api/admin/evidence/'+evidenceId)).status,401);
 const playback=await admin('/api/admin/evidence/'+evidenceId,undefined,{headers:{Range:'bytes=0-11'}});assert.equal(playback.status,206);assert.equal(playback.headers.get('content-range'),'bytes 0-11/'+mp4.length);
 assert.equal((await admin('/api/admin/evidence/'+evidenceId,undefined,{headers:{Range:'bytes=999-1000'}})).status,416);
 assert.equal((await admin('/api/admin/sessions/'+pilot.session.id+'/review',{evidenceReview:{id:'absent',status:'verified',reason:'synthetic'}})).status,404);
 assert.equal((await admin('/api/admin/sessions/'+pilot.session.id+'/review',{evidenceReview:{id:evidenceId,status:'verified',reason:'Synthetic header-only fixture, not a genuine playable study video'}})).status,200);
 assert.deepEqual(await readdir(path.join(dir,'tmp')),[]);
 Object.assign(pilot,(await request(pc,'/api/session',{cookie:pilot.cookie})).data);
});
test('finish immutable raw, pilot review/freeze gate; main snapshots',async()=>{
 assert.equal((await step(pilot,'finish',{videoLater:false,videoReason:''})).status,200);
 assert.equal((await step(pilot,'sus',{values:Array(10).fill(5),missingReason:''})).status,409);
 assert.equal((await admin('/api/admin/sessions/'+pilot.session.id+'/review',{reviewed:true,outcome:'unfinished',taskSeconds:25})).status,400);
 assert.equal((await admin('/api/admin/sessions/'+pilot.session.id+'/review',{reviewed:true,outcome:'unfinished',taskSeconds:25,timingSource:'Synthetic manual fixture'})).status,200);
 assert.equal((await admin('/api/admin/config',{config:{pilotReview:true,frozen:true,version:2}})).status,200);
 assert.equal((await admin('/api/admin/config',{config:{organizer:'change'}})).status,409);
 main=await exchange(await invite('main','P01'));
 await flow(main);
 assert.equal((await step(main,'finish',{videoLater:true,videoReason:'Synthetic missing recording'})).status,200);
 assert.equal((await admin('/api/admin/sessions/'+main.session.id+'/review',{reviewed:true,outcome:'unfinished'})).status,200);
 const state=(await admin('/api/admin/state')).data;
 assert.equal(state.summary.susDenominator,1);assert.equal(state.summary.mean,50);assert.equal(state.summary.reviewedMain,1);assert.equal(state.summary.assignmentComplete,false);
 assert.equal(state.sessions.find(s=>s.id===pilot.session.id).configVersion,1);
 assert.equal(state.sessions.find(s=>s.id===main.session.id).configVersion,2);
});
test('findings references, privacy-separated exports, HTML/CSV safety',async()=>{
 const finding={title:'<script>alert(1)</script>',kind:'usability',severity:'minor',reason:'synthetic',participantIds:[main.session.id],evidenceRefs:['absent'],expected:'synthetic',actual:'synthetic',reproduction:'synthetic',recommendation:'synthetic',issueUrl:''};
 assert.equal((await admin('/api/admin/findings',finding)).status,400);
 finding.evidenceRefs=[];
 assert.equal((await admin('/api/admin/findings',finding)).status,200);
 for(const format of ['json','csv','markdown','html']){
  const r=await admin('/api/admin/export?format='+format);assert.equal(r.status,200);assert(!r.text.includes(consent.name));assert(!r.text.includes(consent.maskedContact));assert(!r.text.includes('cookieHash'));assert(!r.text.includes(pilot.token));assert(r.headers.get('content-disposition').includes('attachment'));
  if(format==='html'){assert(r.text.includes('&lt;script&gt;'));assert(!r.text.includes('<script>alert'));}
 }
 const privateExport=await admin('/api/admin/export?format=participants');assert(privateExport.text.includes(consent.name));assert(privateExport.text.includes(consent.maskedContact));
 const own=(await request(pc,'/api/session',{cookie:main.cookie})).text;assert(!own.includes('notes'));assert(!own.includes('score'));assert(!own.includes('findings'));
});
test('reissue revokes browser; refusal/ineligible retained honestly; withdrawal deletes evidence and old raw',async()=>{
 const revoked=await admin('/api/admin/sessions/'+main.session.id+'/invitation',{revoke:true});assert.equal(revoked.status,200);
 assert.equal((await request(pc,'/api/session',{cookie:main.cookie})).status,401);
 const reissue=await admin('/api/admin/sessions/'+main.session.id+'/invitation',{revoke:false,expiresHours:1});main=await exchange(reissue.data);
 const next=await exchange(await invite('main','P02'));
 assert.equal((await step(next,'screening',{...screening,adult:false})).status,200);assert.equal(next.session.phase,'ineligible');
 assert.equal((await step(next,'consent',consent)).status,409);
 const decline=await exchange(await invite('main','P03'));
 assert.equal((await step(decline,'screening',screening)).status,200);
 assert.equal((await step(decline,'consent',{...consent,participate:false})).status,200);assert.equal(decline.session.phase,'declined');
 assert.equal((await step(decline,'prepare',prepare)).status,409);
 Object.assign(pilot,(await request(pc,'/api/session',{cookie:pilot.cookie})).data);
 const r=await step(pilot,'withdraw',{reason:'Synthetic withdrawal'});assert.equal(r.status,200,r.text);assert.equal(r.data.session.phase,'withdrawn');assert.deepEqual(r.data.session.answers,{});
 assert.equal((await request(pc,'/api/session',{cookie:pilot.cookie})).status,401);
 assert.equal((await admin('/api/admin/evidence/'+evidenceId)).status,404);
 assert.deepEqual(await readdir(path.join(dir,'videos')),[]);
 assert(!JSON.stringify((await admin('/api/admin/state')).data.sessions.find(s=>s.id===pilot.session.id)).includes(consent.name));
});
test('persistence restart and admin credential remains private; no seeded sessions',async()=>{
 await service.close();service=createStudyService({dataDir:dir,participantPort:p,adminPort:a});await service.start();
 const resumed=await request(pc,'/api/session',{cookie:main.cookie});assert.equal(resumed.status,200,resumed.text);assert.equal(resumed.data.session.phase,'done');
 assert.equal((await request(ac,'/api/admin/state',{cookie:adminCookie})).status,401);
 const r=await request(ac,'/api/admin/login',{method:'POST',body:{password:(await readFile(path.join(dir,'admin-password.txt'),'utf8')).trim()}});assert.equal(r.status,200);
 adminCookie=r.headers.get('set-cookie').split(';')[0];adminCSRF=r.data.csrf;
 const s=(await admin('/api/admin/state')).data;assert.equal(s.sessions.length,4);assert.equal(s.sessions.filter(s=>s.kind==='main').length,3);
});
