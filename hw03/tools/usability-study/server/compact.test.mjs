import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,readdir,writeFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {createStudyService} from './index.mjs';
import {validateStep} from './domain.mjs';
import {webm,mp4,browserWebm} from './media-fixtures.mjs';

const screening={adult:true,vietnamese:true,shopping:true,outsideClass:true,uninvolved:true,experience:'synthetic',itBackground:'synthetic'};
const consent={participate:true,screen:true,audio:false,research:true,verification:true,publicEvidence:false};
const prepare={desktop:true,callReady:true,recorderChecked:false,playbackChecked:false};
const privateConfig={organizer:'SYNTHETIC ORGANIZER PRIVATE',organizerContact:'0900000000',accessDescription:'SYNTHETIC ORGANIZER PRIVATE 0900000000 only',storageDescription:'Private synthetic temporary directory',withdrawBy:'2099-12-30',deleteBy:'2099-12-31'};
async function freePort(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}

test('compact explicit consent and preparation domain gates; legacy remains audio allowed',()=>{
 const compact={snapshot:{participantFlow:'compact-screen-v1'},phase:'consent',review:{},answers:{consent}};
 assert.equal(validateStep(compact,'consent',consent),'prepare');
 for(const data of [{...consent,audio:true},{...consent,publicEvidence:true},{...consent,name:'SYNTHETIC NAME'},{...consent,maskedContact:'sy***'},{...consent,audio:undefined},{...consent,research:undefined}]) assert.throws(()=>validateStep(compact,'consent',data));
 assert.throws(()=>validateStep(compact,'consent',{audio:true},true));
 assert.equal(validateStep(compact,'consent',{...consent,participate:false}),'declined');
 assert.equal(validateStep(compact,'prepare',prepare),'scenario');
 for(const k of ['desktop','callReady']) assert.throws(()=>validateStep(compact,'prepare',{...prepare,[k]:false}));
 compact.answers.consent={...consent,screen:false};
 assert.throws(()=>validateStep(compact,'prepare',prepare),/điều phối viên/);
 compact.review.accommodation='Synthetic explicit no-screen alternative';
 assert.equal(validateStep(compact,'prepare',prepare),'scenario');
 const legacy={snapshot:{},phase:'prepare',review:{},answers:{consent:{...consent,audio:true}}};
 assert.throws(()=>validateStep(legacy,'prepare',prepare));
 assert.equal(validateStep(legacy,'prepare',{...prepare,recorderChecked:true,playbackChecked:true}),'scenario');
 legacy.answers.consent.audio=false;
 assert.throws(()=>validateStep(legacy,'prepare',{...prepare,recorderChecked:true,playbackChecked:true}));
});

test('compact synthetic complete flow: no identity/audio/accommodation; public privacy; legacy raw snapshot restart',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'study-compact-synthetic-'));
 const portal=await mkdtemp(path.join(os.tmpdir(),'study-compact-portal-'));await writeFile(path.join(portal,'index.html'),'<html>synthetic</html>');
 const p=await freePort(),a=await freePort(),pc='http://127.0.0.1:'+p,ac='http://127.0.0.1:'+a;
 let service=createStudyService({dataDir:dir,portalDir:portal,participantPort:p,adminPort:a,config:{...privateConfig,participantFlow:'compact-screen-v1'}});
 let adminCookie,adminCSRF;
 async function req(base,route,{body,cookie,csrf}={}){
  const r=await fetch(base+route,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{Origin:base,'Content-Type':'application/json'}),...(cookie?{Cookie:cookie}:{}),...(csrf?{'X-CSRF-Token':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};
 }
 const admin=(route,body)=>req(ac,route,{body,cookie:adminCookie,csrf:adminCSRF});
 try{
  await service.start();
  const page=await fetch(pc+'/');assert.equal(page.status,200);assert.match(page.headers.get('content-security-policy'),/media-src 'self' blob:;/);await page.text();
  const login=await req(ac,'/api/admin/login',{body:{password:(await readFile(path.join(dir,'admin-password.txt'),'utf8')).trim()}});
  adminCookie=login.cookie;adminCSRF=login.data.csrf;
  assert.equal((await admin('/api/admin/config',{config:{participantFlow:'invalid'}})).status,400);
  const invite=await admin('/api/admin/invitations',{kind:'pilot',code:'PILOT-01'});
  assert.equal(invite.status,201);
  const ex=await req(pc,'/api/exchange',{body:{token:new URL(invite.data.inviteUrl).hash.slice(8)}});
  assert.equal(ex.status,200);
  let client=ex.data;const cookie=ex.cookie;
  const assertSafe=config=>{
   const raw=JSON.stringify(config);
   for(const value of [privateConfig.organizer,privateConfig.organizerContact,privateConfig.accessDescription])assert(!raw.includes(value));
   assert.equal(config.storageDescription,privateConfig.storageDescription);
   assert.equal(config.deleteBy,privateConfig.deleteBy);
  };
  assertSafe(client.config);
  assert.equal(client.config.participantFlow,'compact-screen-v1');
  assert.equal(client.config.provenance.protocol,'PROTOCOL.md v0.3');
  assert.equal(client.config.recordingPolicy.audioAllowed,false);
  const step=async(step,data,draft=false)=>{
   const r=await req(pc,'/api/session/step',{cookie,csrf:client.csrf,body:{step,data,draft,revision:client.session.revision,operationId:crypto.randomUUID()}});
   if(r.status===200)client=r.data;return r;
  };
  assert.equal((await step('screening',screening)).status,200);
  for(const data of [{...consent,audio:true},{...consent,publicEvidence:true},{...consent,name:'SYNTHETIC PII'}])assert.equal((await step('consent',data)).status,400);
  assert.equal((await step('consent',{...consent,name:'',maskedContact:''},true)).status,200);
  assert(!('name' in client.session.drafts.consent));assert(!('maskedContact' in client.session.drafts.consent));
  assert.equal((await step('consent',consent)).status,200);
  assert.equal((await step('prepare',prepare)).status,200);
  assert.deepEqual(client.session.answers.prepare,prepare);
  assert.equal((await admin('/api/admin/sessions/'+client.session.id+'/review',{releaseTask:true})).status,200);
  client=(await req(pc,'/api/session',{cookie})).data;
  for(const [key,data] of [
   ['scenario',{understood:true}],
   ['task',{finished:false,product:'',price:'',reason:'',stopReason:'Synthetic stop'}],
   ['sus',{values:Array(10).fill(3),missingReason:''}],
   ['probes',{clarity:'synthetic',recovery:'not observed',recoveryObserved:null,speed:'synthetic',trust:'synthetic',improvement:'',missingReason:'Synthetic no observation'}],
   ['finish',{videoLater:true,videoReason:'Synthetic fixture has no recording'}]
  ])assert.equal((await step(key,data)).status,200,key);
  assert.equal(client.session.phase,'done');
  // Both routes use the same fail-closed inspection before durable evidence.
  for(const moderator of [false,true]){
   const base=moderator?ac:pc,route=moderator?'/api/admin/sessions/'+client.session.id+'/evidence':'/api/evidence';
   const upload=async(bytes,type)=>{const r=await fetch(base+route,{method:'POST',headers:{Origin:base,Cookie:moderator?adminCookie:cookie,'X-CSRF-Token':moderator?adminCSRF:client.csrf,'Content-Type':type,'X-Operation-Id':crypto.randomUUID(),'X-File-Name':'synthetic','X-Source-Description':'Synthetic moderator fixture'},body:bytes});return {status:r.status,data:await r.json()};};
   for(const [bytes,type] of [[webm([1,2]),'video/webm'],[mp4(['vide','soun'],true),'video/mp4'],[webm().subarray(0,12),'video/webm']]){
    const before=await readdir(path.join(dir,'videos'));
    assert.equal((await upload(bytes,type)).status,415);
    assert.deepEqual(await readdir(path.join(dir,'tmp')),[]);
    assert.deepEqual(await readdir(path.join(dir,'videos')),before);
   }
   for(const [bytes,type] of [[browserWebm,'video/webm'],[webm([1],{unknownCluster:true}),'video/webm'],[mp4(['vide'],true),'video/mp4']]){
    assert.equal((await upload(bytes,type)).status,moderator?200:201);
    assert.deepEqual(await readdir(path.join(dir,'tmp')),[]);
   }
  }
  const state=(await admin('/api/admin/state')).data;
  for(const k of ['organizer','organizerContact','accessDescription'])assert.equal(state.config[k],privateConfig[k]);
  assert.equal(state.sessions[0].review.accommodation,undefined);
  assert.deepEqual(state.sessions[0].answers.consent,consent);
  const report=(await admin('/api/admin/export')).data;
  assertSafe(report.config);assertSafe(report.snapshots[0]);
  assert.equal(report.policy.recording,'screen-only');
  assert.equal(report.sessions[0].answers.consent.audio,false);
  // Synthetic historical completed legacy snapshot: simulate pre-field persisted config.
  await service.close();service=null;
  const db=new DatabaseSync(path.join(dir,'study.sqlite'));
  const stored=JSON.parse(db.prepare('SELECT value FROM state WHERE id=1').get().value);
  delete stored.config.participantFlow;delete stored.sessions[0].snapshot.participantFlow;
  stored.sessions[0].answers.consent={...consent,audio:true,publicEvidence:true,name:'HISTORICAL SYNTHETIC',maskedContact:'hi***'};
  const oldSnapshot=structuredClone(stored.sessions[0].snapshot),oldAnswers=structuredClone(stored.sessions[0].answers);
  db.prepare('UPDATE state SET value=? WHERE id=1').run(JSON.stringify(stored));db.close();
  service=createStudyService({dataDir:dir,participantPort:p,adminPort:a,config:{participantFlow:'compact-screen-v1'}});
  await service.start();
  const renewed=await req(pc,'/api/session',{cookie});
  assert.equal(renewed.status,200);assert.equal(renewed.data.config.participantFlow,'legacy');
  assert.equal(renewed.data.config.recordingPolicy.audioAllowed,true);assertSafe(renewed.data.config);
  assert.deepEqual(renewed.data.session.answers,oldAnswers);
  await service.close();service=null;
  const check=new DatabaseSync(path.join(dir,'study.sqlite'));
  const after=JSON.parse(check.prepare('SELECT value FROM state WHERE id=1').get().value);check.close();
  assert.deepEqual(after.sessions[0].snapshot,oldSnapshot);assert.deepEqual(after.sessions[0].answers,oldAnswers);
 }finally{await service?.close();await rm(dir,{recursive:true,force:true});await rm(portal,{recursive:true,force:true});}
});
