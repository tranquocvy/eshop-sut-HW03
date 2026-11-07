import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {test as base,expect} from '@playwright/test';
import {sha,json} from '../scripts/env.mjs';
import {assess} from './status.mjs';
export const run=path.resolve(process.env.GUI_RUN_DIR||'MISSING_RUN_DIR');
export const platform='windows-chromium';export const viewport='VD-1440x900';
const safe=s=>s.replace(/[^a-zA-Z0-9_.-]/g,'_');
export function redact(value){return String(value).replace(/(bearer\s+)[a-z0-9_.-]+/gi,'$1[REDACTED]').replace(/((?:password|token|secret|authorization)["'\s:=]+)[^\s,;"'}]+/gi,'$1[REDACTED]');}
export function publicURL(s){try{const u=new URL(s);if(!['127.0.0.1','localhost'].includes(u.hostname))return u.origin+u.pathname;for(const k of [...u.searchParams.keys()])if(!['search'].includes(k))u.searchParams.set(k,'[REDACTED]');return u.href;}catch{return redact(s);}}
export const test=base.extend({
 evidence:async({},use,info)=>{
  if(!process.env.GUI_RUN_DIR)throw Error('Run only through npm run pilot');
  const [id,variant]=info.title.split('::');if(!/^GUI-\d{3}$/.test(id)||!variant)throw Error('ID::variant title required');
  const folder=path.join(run,id,safe(variant),platform+'--'+viewport,'attempt-'+String(info.retry+1).padStart(3,'0'));fs.mkdirSync(folder,{recursive:true});
  const resultFile=path.join(folder,'result.json');if(fs.existsSync(resultFile))throw Error('Immutable attempt exists: '+resultFile);
  const startedAt=new Date().toISOString();let context,page,assessment=null,reason=null,actual=null,expected=null,rootEvidence=null,blockKind=null,oracleFailure=false,technicalFailure=false;
  const oracleAssertions=[];
  const links=[];const pending=new Set();
  function log(kind,data){const file=path.join(folder,'logs',kind+'.jsonl');fs.mkdirSync(path.dirname(file),{recursive:true});fs.appendFileSync(file,JSON.stringify({at:new Date().toISOString(),...data})+'\n');}
  for(const name of ['steps','console','network','errors']){fs.mkdirSync(path.join(folder,'logs'),{recursive:true});fs.writeFileSync(path.join(folder,'logs',name+'.jsonl'),'');}
  const ev={folder,id,variant,log,expected:v=>{expected=v;},actual:v=>{actual=v;},review:(v,r='human-review-required')=>{assessment='needs-review';actual=v;reason=r;},assert:(key,condition,observation,oracleExpected,source)=>{if(typeof condition!=='boolean'||observation==null)throw Error('Oracle assert needs explicit boolean and observation');actual=observation;const record={key,expected:oracleExpected,actual:observation,source,assessment:condition?'pass':'fail'};oracleAssertions.push(record);log('steps',{event:'oracle-assertion',...record});try{expect(condition,key).toBe(true);}catch(e){oracleFailure=true;throw e;}},blocked:(r,ref)=>{assessment='blocked';blockKind='dependency';reason=r;rootEvidence=ref;log('steps',{event:'dependency-blocked',reason:r,rootEvidence:ref});},
   async open(browser){context=await browser.newContext({viewport:{width:1440,height:900},locale:'vi-VN',deviceScaleFactor:1,serviceWorkers:'block',recordVideo:{dir:path.join(folder,'video'),size:{width:1440,height:900}}});
    await context.tracing.start({screenshots:true,snapshots:true,sources:false});page=await context.newPage();
    await context.route('http://localhost:3000/**',async route=>{const q=route.request();const u=new URL(q.url());if(q.method()!=='GET'||!/^\/api\/(products(?:\/\d+)?|categories)$/.test(u.pathname)){log('errors',{event:'out-of-scope-api-blocked',method:q.method(),url:publicURL(q.url())});await route.abort('blockedbyclient');}else await route.continue();});
    page.on('console',m=>log('console',{type:m.type(),text:redact(m.text())}));page.on('pageerror',e=>log('errors',{event:'pageerror',message:redact(e.message)}));
    page.on('request',q=>log('network',{event:'request',method:q.method(),url:publicURL(q.url())}));
    page.on('requestfailed',q=>log('network',{event:'failed',url:publicURL(q.url()),error:q.failure()?.errorText}));
    page.on('response',r=>{const p=(async()=>{const error=await r.finished();log('network',{event:'response-finished',url:publicURL(r.url()),status:r.status(),error:error?redact(error):null});})();pending.add(p);p.finally(()=>pending.delete(p));});
    log('steps',{event:'context-created',browserVersion:browser.version(),os:os.release(),viewport:{width:1440,height:900},dpr:1,locale:'vi-VN',storage:'fresh-context',runtime:'read-only GET paths'});return page;},
   async shot(name){if(!page)throw Error('No page for screenshot');try{await page.waitForFunction(()=>[...document.images].every(i=>i.complete),{},{timeout:5000});}catch{log('errors',{event:'image-load-incomplete',checkpoint:name});}const images=await page.locator('img').evaluateAll(xs=>xs.map(i=>({src:i.currentSrc||i.src,complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight})));log('steps',{event:'image-state',checkpoint:name,images:images.map(i=>({...i,src:publicURL(i.src)}))});const file=path.join(folder,'screenshots',safe(name)+'.png');fs.mkdirSync(path.dirname(file),{recursive:true});await page.screenshot({path:file,fullPage:true});links.push(path.relative(run,file));await info.attach(name,{path:file,contentType:'image/png'});log('steps',{event:'screenshot',path:path.relative(run,file),url:page.url(),capture:'web-content-fullPage; no browser chrome'});},
   step(event,data={}){log('steps',{event,...data});}
  };
  try{await use(ev);}finally{
   if(page&&!page.isClosed())try{await ev.shot('99-final');}catch(e){technicalFailure=true;log('errors',{event:'screenshot-error',message:redact(e.message)});}
   if(context){try{await context.tracing.stop({path:path.join(folder,'trace.zip')});links.push(path.relative(run,path.join(folder,'trace.zip')));await info.attach('trace',{path:path.join(folder,'trace.zip'),contentType:'application/zip'});}catch(e){technicalFailure=true;log('errors',{event:'trace-error',message:redact(e.message)});}await context.close();await Promise.allSettled([...pending]);if(page?.video()){const v=await page.video().path();links.push(path.relative(run,v));await info.attach('video',{path:v,contentType:'video/webm'});}}
   const status=info.status;
   const errors=info.errors.map(e=>({message:redact(e.message||''),stack:redact(e.stack||'')}));
   const verdict=assess({nativeStatus:status,requested:assessment,oracleFailure,technicalFailure});assessment=verdict.assessment;reason=verdict.reason||reason;if(assessment==='blocked'&&!blockKind)blockKind='technical';
   const result={schemaVersion:'pilot-0.2',id,variant,platform,viewport,attempt:info.retry+1,startedAt,endedAt:new Date().toISOString(),nativeStatus:status,assessment,reason:reason||(assessment==='fail'?'oracle-mismatch':null),expected,actual,rootEvidence,blockKind,oracleFailure,oracleAssertions,evidence:links,errors,humanReview:{required:assessment==='needs-review',status:assessment==='needs-review'?'pending':'not-required',reviewer:null},privacy:{metadataLogs:'filtered',rawTraceVideoAndNativeReport:'local-only; not guaranteed redacted; review before export',publish:false},browserChromeCaptured:false,source:'checklist v0.4; pilot partial variants; no cross-platform claim'};
   for(const e of errors)log('errors',{event:'assertion',...e});json(resultFile,result);
   if(id==='GUI-048'&&variant==='detail-first-click'){const f=path.join(run,'dependencies.json');const deps=fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):{};const fixture=JSON.parse(fs.readFileSync(path.join(run,'fixture/manifest.json'),'utf8')).runtimeDatabase;deps['detail-add-accepted']={scope:['detail',platform,viewport,fixture].join('|'),assessment:result.assessment,result:path.relative(run,resultFile)};json(f,deps);}
   const hashes={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name!=='checksums.json')hashes[path.relative(folder,p)]=sha(p);}}walk(folder);json(path.join(folder,'checksums.json'),hashes);await info.attach('result',{path:resultFile,contentType:'application/json'});
  }
 }
});export {expect};
export async function home(page){await page.goto('http://127.0.0.1:5173/');await expect(page.locator('main h2')).toHaveCount(5);}
export async function detail(page){await page.goto('http://127.0.0.1:5173/product/1');await expect(page.locator('main h1')).toHaveText('iPhone 15 Pro Max');}
