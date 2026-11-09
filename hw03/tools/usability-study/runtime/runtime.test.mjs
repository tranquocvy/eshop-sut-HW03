import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { prepareSut, startSutGateway, sourceHashes, loadReadonlyBackend } from './index.mjs';

const repoRoot = path.resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
const workDir = path.resolve(repoRoot, '../_working/eshop-sut-HW03/online-study-runtime/verification');
const req = createRequire(path.resolve(repoRoot, '../_working/eshop-sut-HW03/t02-harness/package.json'));
test('W01 original-source runtime, strict gateway, network and visual parity', { timeout: 180000 }, async () => {
  const before = await sourceHashes(repoRoot);
  const prepared = await prepareSut({ repoRoot, workDir: path.join(workDir, 'sut') });
  assert.deepEqual(prepared.provenance.sourceHashes, before);
  const gateway = await startSutGateway({ prepared, port: 0 });
  let baselineServer, backend, browser;
  const report = { originalSourceUnchanged: false, checks: [], network: [], screenshots: [], remoteDelivery: 'UNVERIFIED: no tunnel or off-host test' };
  try {
    const get = p => fetch(gateway.origin + p);
    const listing = await (await get('/api/products')).json();
    assert.ok(listing.length > 0);
    const detail = await (await get('/api/products/2')).json();
    assert.equal(typeof detail.price, 'string'); // Original deliberate inconsistent API price type.
    assert.deepEqual(await (await get('/api/products/999999')).json(), {});
    const searched = await (await get('/api/products?search=iPhone')).json();
    assert.ok(searched.length > 0 && searched.every(p => p.name.includes('iPhone')));
    const broken = await get('/api/products?search=%27');
    assert.equal(broken.status, 500);
    assert.match(await broken.text(), /Database Error/); // Do not repair original SQL interpolation/error HTML.
    for (const p of ['/api/admin/users','/api/login','/api/categories','/api/cart','/api/users/me','/api/products/1/','/api/products/1/extra','/api/products%2f1','/backend/database.sqlite','/src/main.jsx','/package.json','/provenance.json','/assets/','/.git/config','/unknown']) {
      const r = await get(p); assert.ok([403,404].includes(r.status), p + ': ' + r.status);
    }
    for (const method of ['POST','PUT','PATCH','DELETE','HEAD','OPTIONS']) assert.equal((await fetch(gateway.origin + '/api/products/1', { method })).status,405);
    for (const p of ['/', '/product/2', '/product/2?reload=1']) {
      const r = await get(p); assert.equal(r.status,200); assert.match(await r.text(), /<div id="root">/);
      assert.equal(r.headers.get('x-frame-options'),'DENY');
      assert.equal(r.headers.get('referrer-policy'),'no-referrer');
      assert.equal(r.headers.get('set-cookie'),null);
    }
    const cross = await fetch(gateway.origin + '/api/products', { headers: { Origin: 'https://study.invalid', Cookie: 'study=secret', Authorization: 'Bearer secret' } });
    assert.equal(cross.headers.get('access-control-allow-origin'), null);
    assert.equal(cross.headers.get('set-cookie'), null);
    report.checks.push('real listing/detail/search; original price/missing/error behavior; strict denied paths/methods; SPA reload; no cookies/CORS; framing/referrer headers');
    // An unchanged baseline bundle; only test-browser routing redirects localhost to actual baseline backend.
    const baseline = await prepareSut({ repoRoot, workDir: path.join(workDir, 'baseline'), transport: false });
    backend = await loadReadonlyBackend(baseline);
    const dbWrite = await new Promise(resolve => backend.db.run('DELETE FROM products', err => resolve(err)));
    assert.equal(dbWrite.code, 'SQLITE_READONLY');
    baselineServer = http.createServer(async (request, response) => {
      if (request.url.startsWith('/api/')) return backend.app(request, response);
      const url = request.url.split('?')[0];
      const file = url.startsWith('/assets/') ? path.join(baseline.staticDir, url) : path.join(baseline.staticDir, 'index.html');
      response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
      response.end(await fs.readFile(file));
    });
    await new Promise(resolve => baselineServer.listen(0, '127.0.0.1', resolve));
    const baseOrigin = 'http://127.0.0.1:' + baselineServer.address().port;
    for (const p of ['/api/products','/api/products/2','/api/products/999999','/api/products?search=iPhone','/api/products?search=%27']) {
      const a = await fetch(gateway.origin+p), b = await fetch(baseOrigin+p);
      assert.equal(a.status,b.status); assert.equal(await a.text(),await b.text());
    }
    process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(repoRoot, '../_working/eshop-sut-HW03/t02-harness/.browsers');
    const { chromium } = req('playwright');
    browser = await chromium.launch({ headless: true });
    const actual = await browser.newPage({ viewport: { width: 1366, height: 900 }, locale: 'en-US' });
    const original = await browser.newPage({ viewport: { width: 1366, height: 900 }, locale: 'en-US' });
    // Both views abort remote placeholder images to remove third-party variability.
    for (const page of [actual, original]) await page.route('https://**/*', route => route.abort());
    await original.route('http://localhost:3000/**', async route => {
      const suffix = route.request().url().slice('http://localhost:3000'.length);
      const response = await route.fetch({ url: baseOrigin + suffix });
      await route.fulfill({ response });
    });
    actual.on('request', request => {
      if (request.resourceType() !== 'image') report.network.push({ method:request.method(), url:request.url().replace(gateway.origin, '<SUT>') });
      assert.ok(!request.url().startsWith('http://localhost:3000'), request.url());
    });
    async function parity(label) {
      await Promise.all([actual, original].map(page => page.locator('h1').first().waitFor()));
      await Promise.all([actual, original].map(page => page.waitForLoadState('networkidle')));
      const dom = page => page.locator('#root').evaluate(el => el.outerHTML);
      assert.equal(await dom(actual), await dom(original), label + ' DOM');
      const a = await actual.screenshot({ fullPage: true }), b = await original.screenshot({ fullPage: true });
      await fs.writeFile(path.join(workDir,label+'-sut.png'),a);
      await fs.writeFile(path.join(workDir,label+'-baseline.png'),b);
      const { PNG } = req(path.join(path.dirname(req.resolve('playwright-core/package.json')), 'lib/utilsBundle.js'));
      const pa = PNG.sync.read(a), pb = PNG.sync.read(b);
      assert.equal(pa.width, pb.width); assert.equal(pa.height, pb.height);
      let differentPixels = 0, maxChannelDelta = 0;
      for (let i = 0; i < pa.data.length; i += 4) {
        if (!pa.data.subarray(i, i + 4).equals(pb.data.subarray(i, i + 4))) differentPixels++;
        for (let channel = 0; channel < 4; channel++) maxChannelDelta = Math.max(maxChannelDelta, Math.abs(pa.data[i + channel] - pb.data[i + channel]));
      }
      assert.ok(differentPixels <= 32 && maxChannelDelta <= 32, label + ': pixels=' + differentPixels + ', channel delta=' + maxChannelDelta);
      report.screenshots.push({ view: label, exactDom: true, differentPixels, maxChannelDelta, viewport: '1366x900', limitation: 'remote images aborted in both; at most 32 pixels / channel delta 32 raster tolerance' });
    }
    await Promise.all([actual.goto(gateway.origin), original.goto(baseOrigin)]);
    await parity('home');
    for (const page of [actual,original]) { await page.getByPlaceholder('Tìm kiếm...').fill('iPhone'); await page.getByRole('button',{name:'Tìm',exact:true}).click(); }
    await parity('search');
    for (const page of [actual,original]) await page.getByRole('link',{name:'Xem chi tiết'}).first().click();
    await parity('detail');
    await Promise.all([actual.reload(), original.reload()]);
    await parity('reload');
    await Promise.all([actual.goBack(), original.goBack()]);
    await parity('back');
    report.checks.push('baseline actual backend status/body equal for five API cases; snapshot writes SQLITE_READONLY; no browser localhost:3000 requests; Home/search/Detail/reload/back');
    report.originalSourceUnchanged = true;
    assert.deepEqual(await sourceHashes(repoRoot), before);
    const crypto = await import('node:crypto');
    assert.equal(crypto.createHash('sha256').update(await fs.readFile(prepared.snapshotPath)).digest('hex'),prepared.provenance.snapshotSha256);
    await fs.writeFile(path.join(workDir, 'verification.json'), JSON.stringify(report,null,2));
    console.log('W01 evidence: ' + path.join(workDir,'verification.json'));
  } finally {
    if (browser) await browser.close();
    if (baselineServer) await new Promise(resolve => { baselineServer.close(resolve); baselineServer.closeIdleConnections(); });
    if (backend) await backend.close();
    await gateway.close();
    assert.deepEqual(await sourceHashes(repoRoot), before);
  }
});


test('repeated preparation preserves old runtime files and allocates independent artifacts', { timeout: 120000 }, async () => {
  const root = await fs.mkdtemp(path.join(workDir, 'restart-regression-'));
  const oldFile = path.join(root, 'frontend/src/App.css');
  await fs.mkdir(path.dirname(oldFile), { recursive: true });
  await fs.writeFile(oldFile, 'existing runtime: must not overwrite or unlink');
  const before = await sourceHashes(repoRoot);
  const first = await prepareSut({ repoRoot, workDir: root });
  const firstCss = path.join(first.workDir, 'frontend/src/App.css');
  const firstBytes = await fs.readFile(firstCss);
  const second = await prepareSut({ repoRoot, workDir: root });
  assert.notEqual(first.workDir, second.workDir);
  assert.equal(path.dirname(first.workDir), root);
  assert.equal(path.dirname(second.workDir), root);
  assert.equal(await fs.readFile(oldFile, 'utf8'), 'existing runtime: must not overwrite or unlink');
  assert.deepEqual(await fs.readFile(firstCss), firstBytes);
  assert.deepEqual(await fs.readFile(path.join(second.workDir, 'frontend/src/App.css')), await fs.readFile(path.join(repoRoot, 'frontend-web/src/App.css')));
  assert.deepEqual(await sourceHashes(repoRoot), before);
  assert.ok((await fs.stat(path.join(second.staticDir, 'index.html'))).isFile());
});
