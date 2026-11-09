
import fs from 'node:fs';import path from 'node:path';import {sha,json,repo} from './scripts/env.mjs';
const lines=fs.readFileSync(path.join(repo,'hw03/gui/GUI_Checklist.md'),'utf8').split(/\r?\n/);
const rows=lines.filter(x=>/^\| GUI-\d{3} \|/.test(x)).slice(0,52).map(l=>{let a=l.split('|').slice(1,-1).map(x=>x.trim());return {id:a[0],content:a[1],condition:a[2],action:a[3],expected:a[4],source:a[5],line:lines.indexOf(l)+1};});
if(new Set(rows.map(x=>x.id)).size!==52)throw Error('52 unique rows required');
const cases=[];const dual=[3,4,6,7,8,9,10,11,12,14,15,31,32,33,36,44,47,48];
for(const row of rows){const n=Number(row.id.slice(4));let pages=dual.includes(n)?['H','D']:n>=23&&n<=27||[5,24,29,30,34,39,42,43,49].includes(n)?['D']:['H'];
let vps=[7,12,13,32].includes(n)?['VD','VM']:['VD'];if(n===12)vps=['VM'];
for(const page of pages)for(const vp of vps){let variants=['default'];
if(n===3)variants=['TD1','TD2'];if(n===6||n===7)variants=page==='H'?['all-seed']:['TD1','TD2','TD3','TD4','TD5'];
if(n===4&&page==='D')variants=['TD1','TD2','TD3','TD4','TD5'];
if(n===13)variants=['TD2','TD5'];if(n===17)variants=['edit-unicode','real-IME'];if(n===18)variants=['click','Enter'];
if(n===25)variants=['1','2'];if(n===26)variants=['0','-1','1.5','empty','abc'];if(n===27)variants=['0','-1','1.5','empty','abc'];
if(n===28)variants=['TD1','TD2'];if(n===31)variants=page==='H'?['logo-click','logo-Enter','detail-click','detail-Enter','search-click','search-Enter','search-Space','add-click','add-Enter','add-Space']:['logo-click','logo-Enter','add-click','add-Enter','add-Space'];
if(n===41)variants=['initial','search'];if(n===49)variants=['empty','1'];
for(const variant of variants){const key=[row.id,variant,page,'windows-google-chrome',vp].join('--');const classes=[...row.source.matchAll(/(?:^|;\s*)(R|L|H):/g)].map(m=>m[1]);const requires=[];
if(n===26||n===27)requires.push({instanceKey:['GUI-048','default','D','windows-google-chrome',vp].join('--'),assertionKey:'feedback',state:'detail-add-accepted',reason:'Root first-click must expose actionable validation path; raw input observations still collected',continuity:'equivalent-clean-context; no state injected'});
cases.push({instanceKey:key,checklistId:row.id,n,variant,page,platformKey:'windows-google-chrome',viewportKey:vp,viewport:vp==='VD'?{width:1440,height:900}:{width:390,height:844},contextGroup:key,required:true,lane:[2,7,9,10,11,12,13,14,15,16,23,32,33,36,47].includes(n)?'hybrid':'automated',requiresCapabilities:n===15?['realBrowserZoom']:variant==='real-IME'?['realIME']:['playwright'],requires,provides:n===48?[page.toLowerCase()+'-add-accepted']:[],actions:[{order:1,kind:'UI',target:row.content,value:variant,count:n===48?1:null,observation:row.action}],assertions:classes.filter(x=>x!=='L').map(c=>({key:n===48?'feedback':c,expected:row.expected,oracle:{class:c,refs:[{path:'hw03/gui/GUI_Checklist.md',line:row.line},row.source],rationale:'Checklist v0.5 immutable expected; mixed assertions split by class in execution'},reviewRequired:[2,7,9,10,11,12,13,14,15,16,23,32,33,36,47].includes(n)})),source:row});}}
}
const manifest={schemaVersion:'1.0',mode:'full',integrationStatus:'explicit local full adapter; not blanket full-contract certification',inputs:{checklist:{path:'hw03/gui/GUI_Checklist.md',sha256:sha(path.join(repo,'hw03/gui/GUI_Checklist.md'))},spec:['README.md','api_specification.md','hw03/PLAN.md'].map(p=>({path:p,sha256:sha(path.join(repo,p))})),rootsEnv:{sut:'SUT_REPO',harness:'external-adapter',runs:'GUI_RUN_DIR'}},permissions:{installDependencies:false,startRuntime:true,executeFull:true,publish:false,commit:false},platforms:[{key:'windows-google-chrome',os:'Windows',browser:'Google Chrome headed',verified:false}],capabilities:[{key:'realBrowserZoom',status:'unavailable',reason:'No verified genuine browser zoom control in headless CDP; CSS/DPR forbidden proxy'},{key:'realIME',status:'unavailable',reason:'No real OS IME composition available in isolated headless browser'},{key:'playwright',status:'pending',reason:'Proved during preflight and native tests'}],cases};
json(new URL('./manifest.json',import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),manifest);
console.log(JSON.stringify({IDs:52,instances:cases.length}));
