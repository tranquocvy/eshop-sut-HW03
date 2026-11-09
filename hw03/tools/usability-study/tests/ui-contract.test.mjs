import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { appRoot,repoRoot } from '../scripts/environment.mjs';
const src=fs.readFileSync(path.join(appRoot,'portal/src.jsx'),'utf8');
test('SUS Vietnamese wording matches reviewed instrument specification exactly',()=>{
 const spec=fs.readFileSync(path.join(repoRoot,'hw03/usability/INSTRUMENTS.md'),'utf8');
 const expected=spec.split(String.fromCharCode(10)).filter(l=>/^\| S\d\d \|/.test(l)).map(l=>l.split('|')[2].trim());
 const start=src.indexOf('const sus=')+'const sus='.length,end=src.indexOf('];',start)+1;
 const actual=Array.from(vm.runInNewContext(src.slice(start,end)));
 assert.equal(actual.length,10);assert.deepEqual(actual,expected);
});
test('study portal does not inject SUT tracking or persist credentials in browser storage',()=>{
 assert(!src.includes('dangerouslySetInnerHTML'));
 assert(!src.includes('getDisplayMedia('));
 assert(!src.includes('localStorage'));
 assert(src.includes('rel="noopener noreferrer"'));
 assert(src.includes('className="choice"'));
 assert(src.includes("phase!=='withdrawn'&&<details>"));
});
