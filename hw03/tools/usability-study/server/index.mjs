import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdir,realpath,readFile,writeFile,unlink,rename,stat,chmod,open } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { randomUUID,createHash,scryptSync } from 'node:crypto';
import {token,hash,equal,fail,str,bool,origin,validateStep,participant,redacted,summary,csvCell,participantFlow,recordingPolicy} from './domain.mjs';
import { renderStudyReport } from './report.mjs';
import { inspectScreenOnly } from './media-tracks.mjs';
const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const within=(base,p)=>{if(process.platform==='win32'){base=base.toLowerCase();p=p.toLowerCase();}return p===base||p.startsWith(base+path.sep);};
const now=()=>new Date().toISOString();
const defaults=(p,a)=>({organizer:'',organizerContact:'',storageDescription:'',accessDescription:'',deleteBy:'',withdrawBy:'',studyOrigin:'http://127.0.0.1:'+p,sutOrigin:'http://localhost:4311',adminOrigin:'http://127.0.0.1:'+a,maxVideoMB:512,participantFlow:'legacy',probeVersion:'v0.3',frozen:false,version:1,pilotReview:false});
function publicConfig(c,sutProvenance=c.sutProvenance??null) {const {storageDescription,deleteBy,withdrawBy,studyOrigin,sutOrigin,maxVideoMB,version}=c;return {organizer:'Người phụ trách nghiên cứu HW03',organizerContact:'Liên hệ người đã gửi link mời',accessDescription:'Người phụ trách nghiên cứu HW03 và giảng viên/trợ giảng phục vụ kiểm tra bài học.',storageDescription,deleteBy,withdrawBy,studyOrigin,sutOrigin,maxVideoMB,version,probeVersion:c.probeVersion??'v0.3',participantFlow:participantFlow(c),recordingPolicy:recordingPolicy(c),sutProvenance,provenance:c.instrumentProvenance??{scenario:'D2-A',successCriteria:'K1',instruments:participantFlow(c)==='compact-screen-v1'?(c.probeVersion==='v0.4'?'INSTRUMENTS-v0.4':'INSTRUMENTS-v0.3'):'INSTRUMENTS-v0.2',protocol:participantFlow(c)==='compact-screen-v1'?'PROTOCOL.md v0.3':'PROTOCOL.md v0.2',consent:'CONTRACT-v1'}};}
function validateConfig(c) {
 if(!['v0.3','v0.4'].includes(c.probeVersion??'v0.3'))fail('probeVersion phải là v0.3 hoặc v0.4.');
 if(c.probeVersion==='v0.4'&&participantFlow(c)!=='compact-screen-v1')fail('Probes v0.4 chỉ dành cho compact.');
 if(!['legacy','compact-screen-v1'].includes(participantFlow(c))) fail('participantFlow phải là legacy hoặc compact-screen-v1.');
 for(const k of ['studyOrigin','sutOrigin','adminOrigin']) origin(c[k]);
 const au=new URL(c.adminOrigin);if(!['127.0.0.1','localhost','[::1]'].includes(au.hostname)) fail('Địa chỉ điều phối chỉ được dùng máy cục bộ.');
 if(new URL(c.studyOrigin).hostname===new URL(c.sutOrigin).hostname||new URL(c.adminOrigin).hostname===new URL(c.sutOrigin).hostname) fail('EShop phải dùng hostname khác portal và điều phối để không nhận cookie nghiên cứu.');
 for(const k of ['organizer','organizerContact','storageDescription','accessDescription','deleteBy','withdrawBy']) str(c[k],k);
 if(!Number.isFinite(c.maxVideoMB)||c.maxVideoMB<=0||c.maxVideoMB>4096) fail('Dung lượng video phải lớn hơn 0 và không quá 4096 MB.');
 bool(c.frozen,'frozen');bool(c.pilotReview,'pilotReview');
 if(!Number.isInteger(c.version)||c.version<1) fail('Version phải là số nguyên dương.');
}
function normalizeProvenance(p) {
 if(p===null||p===undefined)return null;
 if(!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).some(k=>!['sutCommit','sourceHashes','transport'].includes(k)))fail('Provenance SUT không hợp lệ.');
 if(typeof p.sutCommit!=='string'||! /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(p.sutCommit))fail('Provenance cần commit hash đầy đủ.');
 str(p.transport,'mô tả transport',true,2000);
 if(!p.sourceHashes||typeof p.sourceHashes!=='object'||Array.isArray(p.sourceHashes)||!Object.keys(p.sourceHashes).length)fail('Provenance cần sourceHashes theo đường dẫn tương đối.');
 const entries=Object.entries(p.sourceHashes).sort(([a],[b])=>a.localeCompare(b));
 if(entries.some(([k,v])=>!k||k.length>300||k.startsWith('/')||/[\\\\:\x00-\x1f]/.test(k)||k.split('/').some(x=>!x||x==='.'||x==='..'||x==='node_modules'||x==='.git')||typeof v!=='string'||!/^[a-f0-9]{64}$/i.test(v)))fail('Source hash cần đường dẫn tương đối an toàn và SHA-256.');
 return {sutCommit:p.sutCommit.toLowerCase(),sourceHashes:Object.fromEntries(entries.map(([k,v])=>[k,v.toLowerCase()])),transport:p.transport};
}
const json=async req=>{let n=0,parts=[];for await(const b of req){n+=b.length;if(n>65536)fail('Biểu mẫu quá lớn.',413);parts.push(b);}try{const value=JSON.parse(Buffer.concat(parts).toString());if(!value||typeof value!=='object'||Array.isArray(value))throw 0;return value;}catch{fail('Dữ liệu JSON không hợp lệ. Hãy tải lại và thử lưu.');}};
const cookies=req=>Object.fromEntries((req.headers.cookie||'').split(';').map(p=>p.trim().split('=')));
export function createStudyService({dataDir,participantPort=4310,adminPort=4312,host='127.0.0.1',portalDir,config:initialConfig={},provenance=null,maxStorageMB=8192}={}) {
 if(!dataDir) throw new Error('Cần dataDir riêng bên ngoài repository.');
 const studyProvenance=normalizeProvenance(provenance);
 let db,state,root,portal,participantServer,adminServer,started=false;
 const admins=new Map(),loginAttempts=new Map(),activeUploads=new Set();
 let pendingBytes=0;
 const save=()=>{db.prepare('INSERT INTO state(id,value) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').run(JSON.stringify(state));db.exec('PRAGMA wal_checkpoint(TRUNCATE)');};
 const getSession=id=>{const s=state.sessions.find(s=>s.id===id);if(!s||s.phase==='withdrawn')fail('Không tìm thấy phiên còn hiệu lực.',404);return s;};
 const envelope=s=>({session:participant(s),config:publicConfig(s.snapshot),csrf:s.csrf});
 function send(res,status,body,headers={}) {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body));}
 const cookie=(name,value,originValue,age=86400)=>name+'='+value+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+age+(new URL(originValue).protocol==='https:'?'; Secure':'');
 function checkBoundary(req,admin,mutation=false) {
  const expected=admin?state.config.adminOrigin:state.config.studyOrigin;
  // Forwarded headers are deliberately ignored, including on the separate admin listener.
  if(req.headers.host!==new URL(expected).host) fail('Địa chỉ máy chủ không hợp lệ.',403);
  if(req.headers.origin&&req.headers.origin!==expected) fail('Nguồn truy cập không được phép.',403);
  if(mutation&&req.headers.origin!==expected) fail('Hãy mở đúng trang nghiên cứu rồi thử lại.',403);
  if(req.headers['sec-fetch-site']==='cross-site')fail('Không chấp nhận yêu cầu từ trang khác.',403);
 }
 function auth(req,admin,mutation=false) {
  const c=cookies(req);
  if(admin) {const a=admins.get(hash(c.study_admin||''));if(!a||a.expires<Date.now())fail('Vui lòng đăng nhập điều phối.',401);if(mutation&&!equal(req.headers['x-csrf-token'],a.csrf))fail('Phiên bảo vệ hết hiệu lực. Hãy tải lại.',403);return a;}
  const digest=hash(c.study_sid||'');const s=state.sessions.find(x=>x.cookieHash===digest&&x.phase!=='withdrawn');
  if(!s||!Number.isFinite(s.credentialExpiresAt)||s.credentialExpiresAt<=Date.now())fail('Link hoặc phiên đã hết hiệu lực. Hãy liên hệ điều phối viên.',401);
  if(mutation&&!equal(req.headers['x-csrf-token'],s.csrf))fail('Phiên bảo vệ hết hiệu lực. Hãy tải lại.',403);return s;
 }
 async function upload(req,res,s,admin) {
  if(!['video','done'].includes(s.phase)||!s.answers.consent?.participate||!s.answers.consent?.research)fail('Chỉ nhận video sau khảo sát và khi đã đồng ý.',409);
  if(!s.answers.consent.screen&&!s.review.accommodation)fail('Cần xác nhận phương án ghi hình phù hợp consent.',409);
  const op=str(req.headers['x-operation-id'],'mã lần gửi',true,160);
  if(s.evidence.some(e=>e.operationId===op)){req.resume();const {id,status,size,originalName}=s.evidence.find(e=>e.operationId===op);return send(res,200,{evidence:{id,status,size,originalName}});}
  const key=s.id+':'+op;if(activeUploads.has(key))fail('Video đang được gửi. Hãy đợi rồi tải lại.',409);
  const type=(req.headers['content-type']||'').split(';')[0];
  if(!['video/mp4','video/webm'].includes(type))fail('Chỉ nhận video MP4 hoặc WebM.',415);
  let originalName;try{originalName=decodeURIComponent(req.headers['x-file-name']||'video');}catch{fail('Tên tệp không hợp lệ.');}
  str(originalName,'tên tệp',true,200);if(/[\\/\x00-\x1f]/.test(originalName))fail('Tên tệp không được chứa đường dẫn.');
  const source=admin?str(req.headers['x-source-description'],'nguồn video nhập',true,1000):'participant';
  const limit=s.snapshot.maxVideoMB*1024*1024;
  if(Number(req.headers['content-length'])>limit)fail('Video vượt giới hạn. Hãy liên hệ điều phối viên.',413);
  activeUploads.add(key);
  const tmp=path.join(root,'tmp',randomUUID()+'.part');let size=0,header=Buffer.alloc(0);const digest=createHash('sha256');
  try{
   const fh=await open(tmp,'wx',0o600);try{for await(const chunk of req.iterator({destroyOnReturn:false})){size+=chunk.length;pendingBytes+=chunk.length;
    const used=state.sessions.reduce((a,s)=>a+s.evidence.reduce((a,e)=>a+e.size,0),0);
    if(size>limit||used+pendingBytes>maxStorageMB*1024*1024){req.resume();fail('Video vượt giới hạn hoặc nơi lưu đã đầy.',413);}
    if(header.length<32)header=Buffer.concat([header,chunk.subarray(0,32-header.length)]);digest.update(chunk);await fh.writeFile(chunk);
   }await fh.sync();}finally{await fh.close();}
   if(size<12||(type==='video/mp4'?!header.subarray(4,8).equals(Buffer.from('ftyp')):!header.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]))))fail('Tệp không có định dạng video đã chọn. Hãy chọn lại tệp.',415);
   // Shared participant/moderator gate, before deduplication or finalization. Legacy evidence is unchanged.
   if(participantFlow(s.snapshot)==='compact-screen-v1')await inspectScreenOnly(tmp,type);
   if(s.phase==='withdrawn')fail('Phiên đã rút dữ liệu.',410);
   const sha256=digest.digest('hex'),duplicate=s.evidence.find(e=>e.sha256===sha256);
   if(duplicate){await unlink(tmp);return send(res,200,{evidence:{id:duplicate.id,status:duplicate.status,size:duplicate.size,originalName:duplicate.originalName},duplicate:true});}
   const id=randomUUID(),filename=id+(type==='video/mp4'?'.mp4':'.webm');await rename(tmp,path.join(root,'videos',filename));
   const evidence={id,status:'received',size,originalName,sha256,filename,type,source,operationId:op,receivedAt:now()};
   s.evidence.push(evidence);s.revision++;save();send(res,201,{evidence:{id,status:'received',size,originalName}});
  }finally{activeUploads.delete(key);pendingBytes-=size;await unlink(tmp).catch(()=>{});}
 }
 async function participantRoute(req,res,url) {
  if(url.pathname.startsWith('/api/admin'))fail('Không tìm thấy trang.',404);
  if(req.method==='GET'&&url.pathname==='/health')return send(res,200,{ok:true});
  if(req.method==='POST'&&url.pathname==='/api/exchange') {
   const b=await json(req),digest=hash(str(b.token,'link mời',true,200)),s=state.sessions.find(x=>x.invitation?.hash===digest);
   if(!s||s.invitation.revoked||s.invitation.used||s.invitation.expires<Date.now()||s.phase==='withdrawn')fail('Link mời không còn hiệu lực. Hãy xin link mới.',401);
   requiredConsent(s.snapshot);
   const secret=token();s.cookieHash=hash(secret);s.credentialExpiresAt=Date.now()+86400000;s.invitation.used=true;s.csrf=token();save();
   return send(res,200,envelope(s),{'Set-Cookie':cookie('study_sid',secret,state.config.studyOrigin)});
  }
  if(req.method==='GET'&&url.pathname==='/api/session')return send(res,200,envelope(auth(req,false)));
  if(req.method==='POST'&&url.pathname==='/api/session/step') {
   const s=auth(req,false,true),b=await json(req),op=str(b.operationId,'mã thao tác',true,160);
   if(s.operations.includes(op))return send(res,200,envelope(s));
   if(!Number.isInteger(b.revision)||b.revision!==s.revision)fail('Dữ liệu đã thay đổi. Hãy tải lại trước khi lưu.',409);
   if(b.draft!==undefined)bool(b.draft,'draft');
   if(b.step!=='withdraw'&&(s.phase==='done'||(b.step==='finish'?'video':b.step)!==s.phase))fail('Không thể bỏ qua bước hoặc sửa câu đã nộp.',409);
   const next=validateStep(s,b.step,b.data,!!b.draft);
   if(b.step==='withdraw') {
    if(s.snapshot.withdrawBy&&Date.now()>Date.parse(s.snapshot.withdrawBy+'T23:59:59Z'))fail('Đã qua hạn rút trực tuyến. Hãy liên hệ người phụ trách.',409);
    if(activeUploads.size&&[...activeUploads].some(k=>k.startsWith(s.id+':')))fail('Hãy đợi gửi video kết thúc rồi rút dữ liệu.',409);
    for(const e of s.evidence)await unlink(path.join(root,'videos',e.filename)).catch(e=>{if(e.code!=='ENOENT')throw e;});
    for(const f of state.findings){f.participantIds=f.participantIds.filter(id=>id!==s.id);f.evidenceRefs=f.evidenceRefs.filter(id=>!s.evidence.some(e=>e.id===id));}
    // Delete potentially identifying analyst free text, which cannot be safely attributed after withdrawal.
    state.findings=state.findings.filter(f=>!f._contributors?.includes(s.id));
    const tomb={id:s.id,kind:s.kind,code:s.code,phase:'withdrawn',revision:s.revision+1,answers:{},evidence:[],taskReleased:false,submittedAt:null,withdrawnAt:now()};
    state.sessions[state.sessions.indexOf(s)]=tomb;save();return send(res,200,{session:tomb,config:publicConfig(s.snapshot),csrf:null},{'Set-Cookie':cookie('study_sid','',state.config.studyOrigin,0)});
   }
   const answer=structuredClone(b.data);
   // Identity is never durable before all required consent choices are affirmative.
   if(b.step==='consent'&&(participantFlow(s.snapshot)==='compact-screen-v1'||!(answer.participate===true&&answer.research===true&&answer.verification===true))){delete answer.name;delete answer.maskedContact;}
   s.drafts??={};
   if(b.draft)s.drafts[b.step]=answer;
   else {s.answers[b.step]=answer;delete s.drafts[b.step];}
   s.phase=next;s.revision++;s.operations.push(op);
   if(!b.draft)s.events.push({step:b.step,at:now(),kind:'portal-marker-not-verified-task-timing'});
   if(next==='done')s.submittedAt=now();save();return send(res,200,envelope(s));
  }
  if(req.method==='POST'&&url.pathname==='/api/evidence')return upload(req,res,auth(req,false,true),false);
  if(url.pathname.startsWith('/api/'))fail('Không tìm thấy API.',404);
  return servePortal(req,res,url);
 }
 async function servePortal(req,res,url) {
  if(req.method!=='GET'||!portal)fail('Không tìm thấy trang.',404);
  let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{fail('Đường dẫn không hợp lệ.');}
  if(decoded.includes('\\')||decoded.split('/').some(p=>p.startsWith('.')))fail('Không tìm thấy trang.',404);
  let filename=path.resolve(portal,'.'+decoded);if(!within(portal,filename))fail('Không tìm thấy trang.',404);
  if(!path.extname(filename))filename=path.join(portal,'index.html');
  const actual=await realpath(filename).catch(()=>null);
  if(!actual||!within(portal,actual)||!(await stat(actual)).isFile())fail('Không tìm thấy trang.',404);
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'};
  if(!types[path.extname(actual)])fail('Không tìm thấy trang.',404);
  res.writeHead(200,{'Content-Type':types[path.extname(actual)],'Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});await pipeline(createReadStream(actual),res);
 }
 async function adminRoute(req,res,url) {
  if(url.pathname==='/api/admin/bootstrap'&&req.method==='GET')return send(res,200,{needsLogin:true,configured:true});
  if(url.pathname==='/api/admin/login'&&req.method==='POST') {
   const key=req.socket.remoteAddress,attempt=loginAttempts.get(key)||{count:0,until:Date.now()+60000};
   if(attempt.until<Date.now()){attempt.count=0;attempt.until=Date.now()+60000;}
   if(++attempt.count>8)fail('Bạn đã thử nhiều lần. Hãy đợi một phút.',429);loginAttempts.set(key,attempt);
   const b=await json(req);str(b.password,'mật khẩu',true,200);
   const calculated=scryptSync(b.password,state.adminSalt,32).toString('hex');
   if(!equal(calculated,state.adminHash))fail('Mật khẩu chưa đúng. Hãy kiểm tra tệp riêng của người phụ trách.',401);
   const secret=token(),a={csrf:token(),expires:Date.now()+8*3600000};admins.set(hash(secret),a);
   return send(res,200,{csrf:a.csrf},{'Set-Cookie':cookie('study_admin',secret,state.config.adminOrigin,8*3600)});
  }
  if(!url.pathname.startsWith('/api/'))return servePortal(req,res,url);
  const a=auth(req,true,req.method!=='GET');
  if(req.method==='POST'&&url.pathname==='/api/admin/logout'){admins.delete(hash(cookies(req).study_admin||''));return send(res,200,{ok:true},{'Set-Cookie':cookie('study_admin','',state.config.adminOrigin,0)});}
  if(req.method==='GET'&&url.pathname==='/api/admin/state')return send(res,200,{config:state.config,provenance:state.provenance??null,sessions:state.sessions.map(adminSession),findings:state.findings.map(({_contributors,...f})=>f),summary:summary(state.sessions),csrf:a.csrf});
  if(req.method==='POST'&&url.pathname==='/api/admin/config') {
   const b=await json(req),c=b.config;
   if(!c||typeof c!=='object'||Array.isArray(c))fail('Cấu hình không hợp lệ.');
   if(Object.keys(c).some(k=>!Object.keys(defaults(1,2)).includes(k)))fail('Có trường cấu hình không hỗ trợ.');
   const next={...state.config,...c};validateConfig(next);
   if(state.config.frozen&&JSON.stringify(next)!==JSON.stringify(state.config))fail('Cấu hình đã đóng băng. Không sửa giữa các phiên chính.',409);
   if(next.frozen&&!next.pilotReview)fail('Hãy review pilot trước khi đóng băng.',409);
   if(next.pilotReview&&!state.sessions.some(s=>s.kind==='pilot'&&s.phase==='done'&&s.review.reviewed))fail('Cần một pilot đã nộp và được điều phối viên review.',409);
   if(next.frozen)requiredConsent(next);
   if(JSON.stringify(next)!==JSON.stringify(state.config))(state.configHistory??=[]).push({at:now(),fromVersion:state.config.version,toVersion:next.version,frozen:next.frozen,pilotReview:next.pilotReview,changedFields:Object.keys(next).filter(k=>JSON.stringify(next[k])!==JSON.stringify(state.config[k])),pilotRefs:state.sessions.filter(s=>s.kind==='pilot'&&s.phase==='done'&&s.review.reviewed).map(s=>s.id)});
   state.config=next;save();return send(res,200,{config:next});
  }
  if(req.method==='POST'&&url.pathname==='/api/admin/invitations') {
   const b=await json(req);requiredConsent(state.config);
   if(!['pilot','main'].includes(b.kind))fail('Loại phiên phải là pilot hoặc main.');
   if(b.kind==='main'&&(!state.config.frozen||!state.config.pilotReview||!state.sessions.some(s=>s.kind==='pilot'&&s.phase==='done'&&s.review.reviewed)))fail('Chỉ tạo link chính sau pilot được review và cấu hình đóng băng.',409);
   if((b.kind==='pilot'&&b.code!=='PILOT-01')||(b.kind==='main'&&!/^P0[1-7]$/.test(b.code)))fail('Mã phiên phải là PILOT-01 hoặc P01–P07 đúng loại.');
   if(state.sessions.some(s=>s.code===b.code))fail('Mã này đã tồn tại; dùng cấp lại link.',409);
   const s={id:randomUUID(),code:b.code,kind:b.kind,phase:'screening',revision:0,answers:{},evidence:[],review:{notes:[],observation:[]},taskReleased:false,submittedAt:null,withdrawnAt:null,operations:[],events:[],snapshot:{...structuredClone(state.config),instrumentProvenance:structuredClone(publicConfig(state.config).provenance),sutProvenance:structuredClone(state.provenance??null)},createdAt:now()};
   const inviteUrl=issue(s,b.expiresHours);state.sessions.push(s);save();return send(res,201,{session:adminSession(s),inviteUrl});
  }
  const match=url.pathname.match(/^\/api\/admin\/sessions\/([^/]+)\/(invitation|review|evidence)$/);
  if(req.method==='POST'&&match) {
   const s=getSession(match[1]);
   if(match[2]==='evidence')return upload(req,res,s,true);
   const b=await json(req);
   if(match[2]==='invitation') {
    bool(b.revoke,'revoke');
    if(!b.revoke){requiredConsent(state.config);requiredConsent(s.snapshot);}
    s.cookieHash=null;s.csrf=null;s.credentialExpiresAt=null;
    if(b.revoke){s.invitation.revoked=true;save();return send(res,200,{session:adminSession(s)});}
    const inviteUrl=issue(s,b.expiresHours);save();return send(res,200,{session:adminSession(s),inviteUrl});
   }
   const allowed=['releaseTask','accommodation','notes','observation','outcome','k1','taskSeconds','timingSource','recoveryObserved','evidenceReview','reviewed'];
   if(Object.keys(b).some(k=>!allowed.includes(k)))fail('Có trường review không hỗ trợ.');
   const review=structuredClone(s.review);let release=s.taskReleased;let evidence=structuredClone(s.evidence);
   for(const [k,v] of Object.entries(b)){
    if(k==='releaseTask'){bool(v,k);if(v&&(!s.answers.consent?.participate||!['prepare','scenario'].includes(s.phase)))fail('Chỉ cho bắt đầu sau consent và kiểm tra chuẩn bị.',409);release=v;}
    else if(k==='accommodation'){str(v,k);review.accommodation=v;review.accommodationAt=now();}
    else if(['notes','observation'].includes(k)){str(v,k,true);(review[k]??=[]).push({text:v,at:now()});}
    else if(k==='outcome'){if(!['independent','assisted','unfinished','technical-interruption'].includes(v))fail('Kết quả task không hợp lệ.');review[k]=v;}
    else if(k==='taskSeconds'){if(!Number.isFinite(v)||v<0||v>86400)fail('Thời lượng task không hợp lệ.');review[k]=v;}
    else if(k==='timingSource'){str(v,k,true);review[k]=v;}
    else if(k==='recoveryObserved'){if(v!==null&&typeof v!=='boolean')fail('Quan sát phục hồi không hợp lệ.');review[k]=v;}
    else if(k==='reviewed'){bool(v,k);if(v&&s.phase!=='done')fail('Chỉ review sau khi nộp; review không tự hoàn thành nghiên cứu.',409);review[k]=v;review.reviewedAt=now();}
    else if(k==='k1'){
     if(!v||typeof v!=='object'||Array.isArray(v)||Object.values(v).some(x=>x!==null&&typeof x!=='boolean'&&typeof x!=='string'))fail('K1 phải là bản ghi tiêu chí rõ ràng, không suy từ tự báo cáo.');
     if(JSON.stringify(v).length>12000)fail('K1 quá dài.');review.k1=v;review.k1At=now();
    }else if(k==='evidenceReview'){
     if(!v||!['verified','needs-replacement','waived-with-reason'].includes(v.status))fail('Trạng thái kiểm video không hợp lệ.');
     str(v.reason,'lý do review video',true);
     const e=evidence.find(e=>e.id===v.id);if(!e)fail('Không tìm thấy video đã nhận. Không tạo evidence giả.',404);
     if(v.status==='verified'){const st=await stat(path.join(root,'videos',e.filename)).catch(()=>null);if(!st||st.size!==e.size)fail('Tệp video không còn đầy đủ; cần nhận lại.',409);}
     e.status=v.status;e.reviewReason=v.reason;e.reviewedAt=now();
    }
   }
   if(review.taskSeconds!==undefined&&!review.timingSource)fail('Cần ghi nguồn đo thời gian, không dùng thời gian portal làm task thực.');
   s.review=review;s.taskReleased=release;s.evidence=evidence;s.revision++;save();return send(res,200,{session:adminSession(s)});
  }
  const playback=url.pathname.match(/^\/api\/admin\/evidence\/([^/]+)$/);
  if(req.method==='GET'&&playback){
   const e=state.sessions.flatMap(s=>s.evidence).find(e=>e.id===playback[1]);if(!e)fail('Không tìm thấy video.',404);
   const filename=path.join(root,'videos',e.filename),st=await stat(filename).catch(()=>null);if(!st)fail('Video không còn trong nơi lưu.',404);
   let start=0,end=st.size-1,status=200;
   if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m)fail('Khoảng video không hợp lệ.',416);start=Number(m[1]);end=m[2]?Number(m[2]):end;if(start>end||end>=st.size)fail('Khoảng video không hợp lệ.',416);status=206;}
   res.writeHead(status,{'Content-Type':e.type,'Content-Length':end-start+1,'Accept-Ranges':'bytes','Content-Disposition':'inline; filename="evidence'+(e.type==='video/mp4'?'.mp4':'.webm')+'"','Content-Security-Policy':"sandbox; default-src 'none'",...(status===206?{'Content-Range':'bytes '+start+'-'+end+'/'+st.size}:{})});return pipeline(createReadStream(filename,{start,end}),res);
  }
  if(req.method==='POST'&&url.pathname==='/api/admin/findings'){
   const b=await json(req);
   const allowed=['id','title','kind','severity','reason','participantIds','evidenceRefs','expected','actual','reproduction','recommendation','issueUrl'];
   if(Object.keys(b).some(k=>!allowed.includes(k)))fail('Có trường finding không hỗ trợ.');
   for(const k of ['title','kind','severity','reason','expected','actual','reproduction','recommendation','issueUrl'])str(b[k],k,['title','kind','severity','reason'].includes(k));
   if(b.issueUrl){try{const u=new URL(b.issueUrl);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw 0;}catch{fail('Issue URL phải là HTTP(S) hợp lệ.');}}
   for(const k of ['participantIds','evidenceRefs'])if(!Array.isArray(b[k])||b[k].some(v=>typeof v!=='string'))fail('Danh sách tham chiếu không hợp lệ.');
   const referenced=b.participantIds.map(getSession);
   if(b.evidenceRefs.some(id=>!referenced.some(s=>s.evidence.some(e=>e.id===id))))fail('Evidence phải thuộc các phiên được tham chiếu.');
   let existing=b.id&&state.findings.find(f=>f.id===b.id);if(b.id&&!existing)fail('Không tìm thấy finding.',404);
   const finding={...b,id:existing?.id||randomUUID(),updatedAt:now(),_contributors:[...new Set([...(existing?._contributors||[]),...b.participantIds])]};
   if(existing)state.findings[state.findings.indexOf(existing)]=finding;else state.findings.push(finding);save();
   const {_contributors,...safe}=finding;return send(res,200,{finding:safe});
  }
  if(req.method==='GET'&&url.pathname==='/api/admin/export')return exportReport(res,url.searchParams.get('format')||'json');
  fail('Không tìm thấy API điều phối.',404);
 }
 function requiredConsent(c){for(const k of ['organizer','organizerContact','storageDescription','accessDescription','deleteBy','withdrawBy'])str(c[k],k,true);
  for(const k of ['deleteBy','withdrawBy']){
   const ms=Date.parse(c[k]+'T00:00:00Z');
   if(!/^\d{4}-\d{2}-\d{2}$/.test(c[k])||!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==c[k])fail('Hạn xóa/rút phải là ngày có thật theo YYYY-MM-DD.');
   if(Date.now()>ms+86400000-1)fail('Hạn xóa/rút đã qua. Hãy cập nhật chính sách trước khi phát hoặc dùng link mời.');
  }
  if(c.withdrawBy>c.deleteBy)fail('Hạn rút phải trước hoặc bằng hạn xóa.');
 }
 function issue(s,hours=24){
  if(!Number.isFinite(hours)||hours<=0||hours>168)fail('Link mời có hạn trên 0 và tối đa 168 giờ.');
  const secret=token();s.invitation={hash:hash(secret),expires:Date.now()+hours*3600000,revoked:false,used:false};s.cookieHash=null;s.csrf=null;s.credentialExpiresAt=null;
  return state.config.studyOrigin+'/#invite='+secret;
 }
 function adminSession(s) {
  if(s.phase==='withdrawn')return s;
  return {...participant(s),review:s.review,events:s.events,configVersion:s.snapshot.version,invitation:{expires:s.invitation.expires,revoked:s.invitation.revoked,used:s.invitation.used},evidence:s.evidence.map(({filename,operationId,...e})=>e)};
 }
 function exportReport(res,format){
  if(!['json','csv','markdown','html','participants'].includes(format))fail('Định dạng export không hỗ trợ.');
  const sessions=state.sessions.filter(s=>s.phase!=='withdrawn'),sum=summary(state.sessions);
  const report={status:'DRAFT — human validation required; not proof of assignment completion',privacy:'Redacted identifiers; free text requires human privacy review before sharing.',generatedAt:now(),config:publicConfig(state.config,state.provenance),configHistory:state.configHistory??[],policy:{frozen:state.config.frozen,pilotReview:state.config.pilotReview,...recordingPolicy(state.config)},snapshots:[...new Map(sessions.map(s=>[JSON.stringify(publicConfig(s.snapshot)),publicConfig(s.snapshot)])).values()],sessions:sessions.map(s=>({...redacted(s),snapshot:publicConfig(s.snapshot)})),findings:state.findings.map(({_contributors,...f})=>f),summary:sum};
  // Remove known identity strings even if copied into other free text.
  let serialized=JSON.stringify(report,null,2);
  const identities=[state.config,...sessions.map(s=>s.snapshot)].flatMap(c=>[c.organizer,c.organizerContact,c.accessDescription]).concat(sessions.flatMap(s=>[s.answers.consent?.name,s.answers.consent?.maskedContact,s.drafts?.consent?.name,s.drafts?.consent?.maskedContact])).filter(v=>typeof v==='string'&&v.length>1);
  for(const value of identities)serialized=serialized.split(JSON.stringify(value).slice(1,-1)).join('[redacted]');
  let body=serialized,type='application/json',ext='json';
  if(format==='participants'){body=JSON.stringify({private:true,participants:sessions.map(s=>({code:s.code,kind:s.kind,name:s.answers.consent?.name||'',maskedContact:s.answers.consent?.maskedContact||''}))},null,2);}
  if(format==='csv'){
   const clean=JSON.parse(serialized);body=[['code','kind','phase','rawSUS','contributions','SUS','susStatus','reviewed','outcome','taskSeconds','timingSource'],...clean.sessions.map(s=>[s.code,s.kind,s.phase,JSON.stringify(s.answers.sus?.values??null),JSON.stringify(s.sus.contributions),s.sus.score,s.sus.status,s.review.reviewed,s.review.outcome,s.review.taskSeconds,s.review.timingSource])].map(row=>row.map(csvCell).join(',')).join('\r\n');type='text/csv; charset=utf-8';ext='csv';
  }
  if(format==='markdown'){body=renderStudyReport(JSON.parse(serialized),'markdown');type='text/markdown; charset=utf-8';ext='md';}
  if(format==='html'){body=renderStudyReport(JSON.parse(serialized),'html');type='text/html; charset=utf-8';ext='html';}
  res.writeHead(200,{'Content-Type':type,'Content-Disposition':'attachment; filename="study-'+format+'.'+ext+'"','Content-Security-Policy':"sandbox; default-src 'none'; style-src 'unsafe-inline'"});res.end(body);
 }
 function handler(admin){return async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','DENY');
  try{checkBoundary(req,admin,!['GET','HEAD'].includes(req.method));const url=new URL(req.url,'http://local.invalid');
   if([...url.searchParams.keys()].some(k=>/token|password|secret|invite/i.test(k)))fail('Không gửi mã bí mật qua query.',400);
   await (admin?adminRoute:participantRoute)(req,res,url);
  }catch(e){if(res.headersSent){res.destroy();return;}if(!req.complete){res.setHeader('Connection','close');req.resume();}send(res,e.status||500,{error:e.status?e.message:'Không lưu được dữ liệu. Hãy thử lại hoặc liên hệ điều phối viên.'});}
 };}
 return {
  async start(){
   if(started)throw new Error('Service already started');
   const candidate=path.resolve(dataDir);if(within(repoRoot,candidate)||within(candidate,repoRoot))throw new Error('Storage must be outside repository.');
   // Resolve the nearest existing parent before creating anything (including symlinked ancestors).
   let ancestor=candidate,tail=[];while(true){const actual=await realpath(ancestor).catch(()=>null);if(actual){const prospective=path.resolve(actual,...tail);if(within(repoRoot,prospective)||within(prospective,repoRoot))throw new Error('Storage symlink enters repository.');break;}const parent=path.dirname(ancestor);if(parent===ancestor)throw new Error('Cannot resolve storage parent');tail.unshift(path.basename(ancestor));ancestor=parent;}
   await mkdir(dataDir,{recursive:true,mode:0o700});root=await realpath(dataDir);portal=portalDir?await realpath(portalDir):null;
   const repository=await realpath(repoRoot);
   if(within(repository,root)||within(root,repository)||(portal&&(within(portal,root)||within(root,portal))))throw new Error('Storage must be outside repository and webroot, without ancestor overlap.');
   await chmod(root,0o700);await mkdir(path.join(root,'tmp'),{recursive:true,mode:0o700});await mkdir(path.join(root,'videos'),{recursive:true,mode:0o700});
   for(const sub of ['tmp','videos'])if(!within(root,await realpath(path.join(root,sub))))throw new Error('Storage subdirectories must not escape dataDir.');
   // Clear only interrupted staging files, never finalized evidence.
   const {readdir}=await import('node:fs/promises');for(const f of await readdir(path.join(root,'tmp')))if(/^[a-f0-9-]+\.part$/.test(f))await unlink(path.join(root,'tmp',f));
   db=new DatabaseSync(path.join(root,'study.sqlite'));db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA secure_delete=ON; CREATE TABLE IF NOT EXISTS state(id INTEGER PRIMARY KEY CHECK(id=1),value TEXT NOT NULL)');
   const row=db.prepare('SELECT value FROM state WHERE id=1').get();
   if(row){state=JSON.parse(row.value);
    if(JSON.stringify(normalizeProvenance(state.provenance??null))!==JSON.stringify(studyProvenance)){db.close();db=null;throw new Error('Provenance SUT khác study đã lưu. Dùng dataDir mới để không trộn build.');}
    // Clean pre-safeguard drafts/refusals on restart; never invent a credential expiry for legacy cookies.
    let cleaned=false;
    for(const s of state.sessions){
     if(s.phase==='withdrawn')continue;
     // In legacy storage the current phase's answer can only be an unsubmitted draft:
     // successful final submission advances phase; leave all historical final steps untouched.
     const step=s.phase==='video'?'finish':s.phase;
     if(s.answers?.[step]){s.drafts??={};s.drafts[step]??=s.answers[step];delete s.answers[step];cleaned=true;}
     for(const c of [s.answers?.consent,s.drafts?.consent])if(c&&!(c.participate===true&&c.research===true&&c.verification===true)){for(const k of ['name','maskedContact'])if(k in c){delete c[k];cleaned=true;}}
    }
    if(cleaned)save();
   }
   else{
    const config={...defaults(participantPort,adminPort),...initialConfig};validateConfig(config);const password=token(),adminSalt=token();
    state={config,provenance:studyProvenance,sessions:[],findings:[],adminSalt,adminHash:scryptSync(password,adminSalt,32).toString('hex')};
    await writeFile(path.join(root,'admin-password.txt'),password+'\n',{mode:0o600,flag:'wx'});save();
   }
   validateConfig(state.config);await chmod(path.join(root,'study.sqlite'),0o600);
   participantServer=http.createServer(handler(false));adminServer=http.createServer(handler(true));
   for(const server of [participantServer,adminServer]){server.requestTimeout=300000;server.headersTimeout=15000;server.maxHeadersCount=80;}
   const listen=(server,port,bind)=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,bind,resolve);});
   try{await listen(participantServer,participantPort,host);await listen(adminServer,adminPort,'127.0.0.1');started=true;}
   catch(e){await this.close();throw e;}
   return {participantAddress:participantServer.address(),adminAddress:adminServer.address(),adminPasswordFile:path.join(root,'admin-password.txt')};
  },
  async close(){for(const server of [participantServer,adminServer])if(server?.listening)await new Promise(resolve=>{server.close(resolve);server.closeIdleConnections();});db?.close();db=null;admins.clear();started=false;}
 };
}
export default createStudyService;
