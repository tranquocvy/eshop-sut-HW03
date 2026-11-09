import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createRequire } from 'node:module';
import { createStudyService } from '../server/index.mjs';
import { ensureWork,repoRoot } from '../scripts/environment.mjs';
const base=ensureWork();
const dirs=(await fs.readdir(base,{withFileTypes:true})).filter(x=>x.isDirectory()&&(x.name.startsWith('e2e-')||x.name.startsWith('compact-e2e-'))).map(x=>x.name).sort((a,b)=>Number(b.split('-').at(-1))-Number(a.split('-').at(-1)));
const requested=process.env.STUDY_REPORT_RUN;if(requested){if(path.basename(requested)!==requested||!dirs.includes(requested))throw new Error('Only a known synthetic run folder may be selected.');dirs.splice(0,dirs.length,requested);}
let run;
for(const d of dirs){const v=JSON.parse(await fs.readFile(path.join(base,d,'verification.json'),'utf8').catch(()=>'{}'));if(v.result==='PASS'&&v.syntheticOnly===true){run=path.join(base,d);break;}}
if(!run)throw new Error('Run synthetic browser E2E successfully first.');
const dataDir=path.join(run,'private');const db=new DatabaseSync(path.join(dataDir,'study.sqlite'),{readOnly:true});const state=JSON.parse(db.prepare('SELECT value FROM state WHERE id=1').get().value);db.close();
assert(state.config.organizerContact.endsWith('@example.invalid'),'Only synthetic study contact fixtures may be rendered by this test');
const ac=state.config.adminOrigin;
const service=createStudyService({dataDir,portalDir:path.join(base,'portal-dist'),participantPort:Number(new URL(state.config.studyOrigin).port),adminPort:Number(new URL(ac).port),provenance:state.provenance});
const req=createRequire(path.resolve(repoRoot,'../_working/eshop-sut-HW03/t02-harness/package.json'));
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(repoRoot,'../_working/eshop-sut-HW03/t02-harness/.browsers');
let browser;
try{
 await service.start();browser=await req('playwright').chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
 await page.goto(ac+'/moderator');await page.getByLabel('Mật khẩu điều phối',{exact:true}).fill((await fs.readFile(path.join(dataDir,'admin-password.txt'),'utf8')).trim());await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.getByRole('heading',{name:'Tạo lời mời riêng',exact:true}).waitFor();
 const htmlResponse=await context.request.get(ac+'/api/admin/export?format=html');assert.equal(htmlResponse.status(),200);const html=await htmlResponse.text();assert(!html.includes('SYNTHETIC PERSON'));
 const mdResponse=await context.request.get(ac+'/api/admin/export?format=markdown');const markdown=await mdResponse.text();assert.equal(mdResponse.status(),200);assert(markdown.includes('## 10.'));assert(!markdown.includes('SYNTHETIC PERSON'));
 await fs.writeFile(path.join(run,'report-synthetic.html'),html);await fs.writeFile(path.join(run,'report-synthetic.md'),markdown);
 const reportPage=await context.newPage();await reportPage.setContent(html);assert.equal(await reportPage.locator('h1').count(),1);assert.equal(await reportPage.locator('h2').count(),10);const tables=await reportPage.locator('table').count();assert(tables>=10);assert.equal(await reportPage.locator('pre').count(),0);
 await reportPage.screenshot({path:path.join(run,'report-screen.png')});await reportPage.setViewportSize({width:794,height:1123});await reportPage.emulateMedia({media:'print'});
 const overflow=await reportPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,'Report print width overflow');
 await reportPage.screenshot({path:path.join(run,'report-print-first.png')});const pdf=await reportPage.pdf({path:path.join(run,'report-synthetic.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});assert(pdf.subarray(0,5).toString()==='%PDF-');assert(pdf.length>20000);
 const result={syntheticOnly:true,sourceRun:path.basename(run),headings:10,tables,printWidthOverflow:overflow,pdfBytes:pdf.length,allPagesManuallyInspected:false,result:'PASS'};await fs.writeFile(path.join(run,'report-render-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));console.log('Report evidence: '+run);
}finally{await browser?.close();await service.close();}
