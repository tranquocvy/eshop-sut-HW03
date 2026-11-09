import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { appRoot, repoRoot, workRoot, outsideRepo, dependencyRoot } from '../scripts/environment.mjs';
import { sourceFingerprints, verifyFingerprints } from '../scripts/integrity.mjs';
test('runtime data stays outside source repository',()=>{
 assert.ok(fs.existsSync(path.join(repoRoot,'frontend-web/src/pages/Home.jsx')));
 assert.throws(()=>outsideRepo(repoRoot));
 assert.throws(()=>outsideRepo(path.join(appRoot,'state')));
 assert.equal(outsideRepo(workRoot),workRoot);
});
test('source fingerprint comparison rejects mutations',()=>{
 const source=sourceFingerprints(); assert.ok(Object.keys(source).length>10);
 assert.equal(verifyFingerprints(source),Object.keys(source).length);
 assert.throws(()=>verifyFingerprints(source,{...source,changed:'invalid'}));
});
test('cached dependencies are discovered without install',()=>{
 assert.ok(dependencyRoot());
});
