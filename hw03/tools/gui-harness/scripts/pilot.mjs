import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn,execFileSync} from 'node:child_process';
import {harness,repo,runtime,runs,fingerprint,harnessFingerprint,sha,json} from './env.mjs';
import {prepare,assertPortFree} from './preflight.mjs';
import {verify} from './verify-run.mjs';
fs.mkdirSync(runs,{recursive:true});
const id=new Date().toISOString().replace(/[:.]/g,'-');const dir=path.join(runs,id);fs.mkdirSync(dir,{recursive:false});
process.env.GUI_RUN_DIR=dir;process.env.SUT_RUNTIME=runtime;process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(harness,'.browsers');
const children=[],streams=[],serviceErrors=[];const env={...process.env};json(path.join(runs,'latest.json'),{runDir:dir});
function service(script,name){
 const out=fs.createWriteStream(path.join(dir,'server',name+'.log'));streams.push(out);
 const child=spawn(process.execPath,[path.join(harness,'scripts',script)],{cwd:harness,env,stdio:['ignore','pipe','pipe'],windowsHide:true});
 child.stdout.pipe(out,{end:false});child.stderr.pipe(out,{end:false});child.on('error',e=>serviceErrors.push({name,message:e.message}));children.push(child);return child;
}
async function waitURL(url){const deadline=Date.now()+20000;let last;while(Date.now()<deadline){if(serviceErrors.length)throw Error('Service spawn failed: '+JSON.stringify(serviceErrors));try{const r=await fetch(url,{signal:AbortSignal.timeout(1500)});if(r.ok)return;}catch(e){last=e;}await new Promise(r=>setTimeout(r,200));}throw Error('Runtime unavailable '+url+' '+last);}
function stage(name){return new Promise((resolve,reject)=>{
 const out=fs.createWriteStream(path.join(dir,'server','runner-'+name+'.log'));streams.push(out);
 const c=spawn(process.execPath,[path.join(harness,'node_modules/playwright/cli.js'),'test','--config',path.join(harness,'playwright.config.mjs')],{cwd:harness,env:{...env,GUI_STAGE:name},stdio:['ignore','pipe','pipe'],windowsHide:true});children.push(c);
 c.stdout.on('data',d=>{process.stdout.write(d);out.write(d);});c.stderr.on('data',d=>{process.stderr.write(d);out.write(d);});c.on('error',reject);c.on('exit',code=>resolve(code));
});}
const variants=[['GUI-048','detail-first-click'],['GUI-019','full-name--home'],...['1','2'].map(q=>['GUI-025','quantity-'+q+'--detail']),...['zero','minus-one','fraction','empty','text'].map(q=>['GUI-026','quantity-'+q+'--detail']),...['home','detail'].map(p=>['GUI-032','tab-order--'+p]),['GUI-040','no-match--home'],['GUI-045','iphone-held-macbook-first--home']];
json(path.join(dir,'pilot-manifest.json'),{scope:'7 IDs, partial variants, Chromium VD only',instances:variants.map(([id,variant])=>({id,variant})),dependency:{root:'GUI-048::detail-first-click',downstream:'GUI-026::*--detail',independent:'GUI-025::*--detail'},notCovered:['all 50 ID','VM viewport','cross-platform','real zoom','IME','browser chrome','student identity overlay']});
let before,harnessBefore,rootExit=null,mainExit=null,executed=false;
try{
 harnessBefore=harnessFingerprint();json(path.join(dir,'harness-manifest.json'),{schemaVersion:'pilot-0.2',files:harnessBefore});before=await prepare(dir);fs.mkdirSync(path.join(dir,'server'),{recursive:true});
 const {chromium}=await import('@playwright/test');let browser=await chromium.launch({headless:true});const browserVersion=browser.version();await browser.close();
 json(path.join(dir,'run.json'),{schemaVersion:'pilot-0.2',runID:id,startedAt:new Date().toISOString(),repo,head:before.head,checklistHash:before.checklist,platform:{os:os.type(),release:os.release(),arch:os.arch(),browser:'Playwright Chromium/headless',browserVersion,runner:'@playwright/test 1.65.0',node:process.version,viewport:{width:1440,height:900},dpr:1,locale:'vi-VN'},fixture:before.runtimeDatabase,runtimeMode:before.runtimeMode,capabilities:{browserChrome:false,realZoom:false,IME:false,identityOverlay:false},privacy:{rawArtifacts:'local-only, not guaranteed redacted; review export separately',externalUpload:false},publication:false});
 service('backend.cjs','backend');service('frontend.mjs','frontend');await waitURL('http://localhost:3000/api/products');await waitURL('http://127.0.0.1:5173/');
 browser=await chromium.launch({headless:true});
 try{const p=await browser.newPage();await p.goto('http://127.0.0.1:5173/');await p.locator('main h2').first().waitFor();const rendered=await p.locator('header').evaluate(e=>({display:getComputedStyle(e).display,padding:getComputedStyle(e).padding,background:getComputedStyle(e).backgroundColor}));json(path.join(dir,'render-preflight.json'),rendered);if(rendered.display!=='flex'||rendered.padding==='0px')throw Error('runtime-css-not-rendered; not a SUT finding');await p.screenshot({path:path.join(dir,'render-preflight.png'),fullPage:true});}finally{await browser.close();}
 rootExit=await stage('root');mainExit=await stage('main');executed=true;
}catch(e){json(path.join(dir,'harness-error.json'),{message:e.message,stack:e.stack});console.error(e);process.exitCode=2;}
finally{
 const cleanup=[];
 for(const child of children){
  if(child.exitCode===null&&child.signalCode===null&&child.pid){
   try{if(process.platform==='win32')execFileSync('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore'});else child.kill('SIGTERM');}catch(e){cleanup.push({pid:child.pid,killError:e.message});}
   await Promise.race([new Promise(resolve=>child.once('exit',resolve)),new Promise(resolve=>setTimeout(resolve,2000))]);
  }
  let alive=false;if(child.pid)try{process.kill(child.pid,0);alive=true;}catch{}
  cleanup.push({pid:child.pid,exitCode:child.exitCode,signal:child.signalCode,terminated:!alive});
 }
 await Promise.all(streams.map(s=>new Promise(resolve=>s.end(resolve))));
 const portStatus=[];for(const port of [3000,5173])try{await assertPortFree(port);portStatus.push({port,free:true});}catch(e){portStatus.push({port,free:false,error:e.message});}
 const cleaned=cleanup.every(c=>c.terminated===true||c.killError)&&portStatus.every(p=>p.free)&&!cleanup.some(c=>c.killError);json(path.join(dir,'cleanup.json'),{verified:cleaned,processes:cleanup,ports:portStatus,serviceErrors});if(!cleaned)process.exitCode=2;
 if(before){
  const after=fingerprint();const runtimeSources=Object.fromEntries(Object.keys(before.files).map(p=>[p,sha(path.join(runtime,p))]));const dbAfter=sha(path.join(runtime,'backend/database.sqlite'));
  const fields={harnessSourcesUnchanged:JSON.stringify(harnessBefore)===JSON.stringify(harnessFingerprint()),repoSourcesUnchanged:JSON.stringify(before.files)===JSON.stringify(after.files),runtimeSourcesUnchanged:JSON.stringify(before.files)===JSON.stringify(runtimeSources),repoDBUnchanged:before.repoDatabase===after.repoDatabase,runtimeDBUnchanged:before.runtimeDatabase===dbAfter,protectedAIUnchanged:JSON.stringify(before.protectedAI)===JSON.stringify(after.protectedAI),headUnchanged:before.head===after.head,checklistUnchanged:before.checklist===after.checklist};
  const verified=Object.values(fields).every(Boolean);json(path.join(dir,'integrity.json'),{verified,...fields,repoDBBefore:before.repoDatabase,repoDBAfter:after.repoDatabase,runtimeDBBefore:before.runtimeDatabase,runtimeDBAfter:dbAfter});if(!verified)process.exitCode=2;
 }
}
if(executed){try{const report=verify(dir);json(path.join(dir,'execution.json'),{rootExit,mainExit,pipelineVerified:report.verified,finalIntegrityAndCleanup:true});console.log('RUN_DIR='+dir);console.log(JSON.stringify({counts:report.counts,instances:report.instances,pipelineVerified:report.verified}));if(rootExit||mainExit)process.exitCode=process.exitCode||1;}catch(e){json(path.join(dir,'verification-error.json'),{message:e.message});console.error(e);process.exitCode=2;}}
