import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import http from 'node:http';

const hash = b => createHash('sha256').update(b).digest('hex');
export async function sourceHashes(repoRoot) {
  const result = {};
  async function walk(relative) {
    for (const e of await fs.readdir(path.join(repoRoot, relative), { withFileTypes: true })) {
      if (['node_modules', '.git', 'dist'].includes(e.name)) continue;
      const p = path.join(relative, e.name);
      if (e.isSymbolicLink()) throw new Error('Source symlinks are not supported: ' + p);
      if (e.isDirectory()) await walk(p);
      else result[p.replaceAll('\\', '/')] = hash(await fs.readFile(path.join(repoRoot, p)));
    }
  }
  await walk('frontend-web'); await walk('backend');
  return result;
}
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
export async function dependencies(repoRoot, dependencyRoot) {
  const base = dependencyRoot || path.resolve(repoRoot, '../_working/eshop-sut-HW03');
  for (const name of ['t01-runtime', 't02-runtime']) {
    const root = path.join(base, name);
    const frontend = path.join(root, 'frontend-web/node_modules');
    const backend = path.join(root, 'backend/node_modules');
    if (await exists(path.join(frontend, 'vite/package.json')) && await exists(path.join(backend, 'sqlite3/package.json')))
      return { frontend, backend };
  }
  throw new Error('No installed t01-runtime/t02-runtime dependency cache at ' + base);
}
function outside(repoRoot, workDir) {
  const rel = path.relative(repoRoot, workDir);
  if (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel))
    throw new Error('workDir must be outside repoRoot');
}
export async function prepareSut({ repoRoot, workDir, dependencyRoot, transport = true }) {
  repoRoot = path.resolve(repoRoot); workDir = path.resolve(workDir); outside(repoRoot, workDir);
  const deps = await dependencies(repoRoot, dependencyRoot);
  const before = await sourceHashes(repoRoot);
  for (const suffix of ['-wal', '-journal']) {
    const p = path.join(repoRoot, 'backend/database.sqlite' + suffix);
    if (await exists(p) && (await fs.stat(p)).size) throw new Error('Active database sidecar; stop original DB writer before snapshot');
  }
  await fs.mkdir(workDir, { recursive: true });
  // Mỗi lượt dùng artifact riêng: không unlink/ghi đè bản cũ có thể read-only,
  // đang được tiến trình khác dùng hoặc được tạo bởi tài khoản Windows khác.
  workDir = await fs.mkdtemp(path.join(workDir, 'run-'));
  const frontendDir = path.join(workDir, 'frontend');
  await fs.mkdir(frontendDir, { recursive: true });
  for (const entry of ['src', 'public', 'index.html', 'package.json', 'postcss.config.js', 'tailwind.config.js']) {
    await fs.cp(path.join(repoRoot, 'frontend-web', entry), path.join(frontendDir, entry), { recursive: true, force: true });
  }
  const modules = path.join(frontendDir, 'node_modules');
  if (!await exists(modules)) await fs.symlink(deps.frontend, modules, 'junction');
  else if (await fs.realpath(modules) !== await fs.realpath(deps.frontend)) throw new Error('Unexpected external node_modules target');
  const staticDir = path.join(workDir, 'static');
  const adapter = path.join(workDir, 'axios-transport.mjs');
  // This wrapper changes URL transport only. No source JSX, DOM, CSS or response adaptation.
  await fs.writeFile(adapter, `import axios from ${JSON.stringify(path.join(deps.frontend, 'axios/index.js').replaceAll('\\', '/'))};
export * from ${JSON.stringify(path.join(deps.frontend, 'axios/index.js').replaceAll('\\', '/'))};
axios.interceptors.request.use(config => {
  if (typeof config.url === 'string' && config.url.startsWith('http://localhost:3000/api/'))
    config.url = config.url.slice('http://localhost:3000'.length);
  return config;
});
export default axios;
`);
  const { build } = await import(pathToFileURL(path.join(deps.frontend, 'vite/dist/node/index.js')));
  const react = (await import(pathToFileURL(path.join(deps.frontend, '@vitejs/plugin-react/dist/index.js')))).default;
  const requireFrontend = createRequire(path.join(deps.frontend, '../package.json'));
  const tailwind = requireFrontend('tailwindcss');
  const autoprefixer = requireFrontend('autoprefixer');
  await build({
    configFile: false, root: frontendDir, plugins: [react()], logLevel: 'warn',
    resolve: { alias: transport ? [{ find: /^axios$/, replacement: adapter }] : [] },
    css: { postcss: { plugins: [tailwind({ content: [path.join(frontendDir, 'index.html').replaceAll('\\','/'), path.join(frontendDir, 'src/**/*.{js,ts,jsx,tsx}').replaceAll('\\','/')] }), autoprefixer()] } },
    build: { outDir: staticDir, emptyOutDir: true, sourcemap: false },
  });
  const snapshotPath = path.join(workDir, 'database.snapshot.sqlite');
  await fs.copyFile(path.join(repoRoot, 'backend/database.sqlite'), snapshotPath);
  const serverPath = path.join(workDir, 'server.original.cjs');
  await fs.copyFile(path.join(repoRoot, 'backend/server.js'), serverPath);
  const after = await sourceHashes(repoRoot);
  if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Original source/DB changed during preparation');
  const provenance = {
    schema: 1, sourceHashes: before, sourceUnchanged: true, snapshotSha256: hash(await fs.readFile(snapshotPath)),
    serverSha256: hash(await fs.readFile(serverPath)), adapterSha256: hash(await fs.readFile(adapter)),
    transport: transport ? 'axios URL prefix http://localhost:3000/api/ -> /api/ only' : 'original baseline (test only)',
    deps, dependencyVersions: Object.fromEntries(await Promise.all([
      ...['vite', '@vitejs/plugin-react', 'react', 'react-dom', 'react-router-dom', 'axios', 'tailwindcss', 'autoprefixer'].map(name => [name, deps.frontend]),
      ...['express', 'sqlite3', 'cors', 'body-parser', 'jsonwebtoken'].map(name => [name, deps.backend]),
    ].map(async ([name, root]) => [name, JSON.parse(await fs.readFile(path.join(root, name, 'package.json'), 'utf8')).version]))),
    builtAt: new Date().toISOString(), bundleByteIdentical: false,
    limits: 'Loopback verification only; no remote HTTPS/tunnel delivery verified',
  };
  await fs.writeFile(path.join(workDir, 'provenance.json'), JSON.stringify(provenance, null, 2));
  return { repoRoot, workDir, staticDir, snapshotPath, serverPath, provenance, deps };
}

/** Execute unchanged backend server with only database and listen dependency substitution.
 * VM is a dependency loader, NOT a security sandbox; never accept uploaded server code.
 */
export async function loadReadonlyBackend(prepared) {
  const req = createRequire(path.join(prepared.deps.backend, '../package.json'));
  const sqlite = req('sqlite3');
  if (hash(await fs.readFile(prepared.snapshotPath)) !== prepared.provenance.snapshotSha256)
    throw new Error('Database snapshot hash mismatch');
  const db = await new Promise((resolve, reject) => {
    const handle = new sqlite.Database(prepared.snapshotPath, sqlite.OPEN_READONLY, err => err ? reject(err) : resolve(handle));
  });
  const express = req('express');
  let app;
  const expressAdapter = Object.assign(() => {
    app = express();
    // Original source still calls listen(PORT); no backend socket is opened.
    app.listen = () => app;
    return app;
  }, express);
  try {
    const source = await fs.readFile(prepared.serverPath, 'utf8');
    if (hash(source) !== prepared.provenance.serverSha256) throw new Error('Backend artifact hash mismatch');
    const loaderRequire = name => {
      if (name === './database') return db; // Never resolve/execute original database.js.
      if (name === 'express') return expressAdapter;
      if (!['cors', 'body-parser', 'jsonwebtoken'].includes(name)) throw new Error('Unexpected backend dependency: ' + name);
      return req(name);
    };
    const wrapped = new vm.Script('(function(require,module,exports){\n' + source + '\n})', { filename: prepared.serverPath });
    wrapped.runInThisContext()(loaderRequire, { exports: {} }, {});
    if (!app) throw new Error('No original Express app captured');
    return { app, db, close: () => new Promise((resolve, reject) => db.close(e => e ? reject(e) : resolve())) };
  } catch (error) { db.close(); throw error; }
}
export async function startSutGateway({ repoRoot, workDir, host = '127.0.0.1', port = 4311, publicOrigin, dependencyRoot, prepared }) {
  if (!['127.0.0.1', '::1', 'localhost'].includes(host)) throw new Error('Gateway must bind loopback; use an explicitly managed HTTPS SUT tunnel');
  if (publicOrigin && new URL(publicOrigin).origin !== publicOrigin) throw new Error('publicOrigin must be an origin without trailing slash or path');
  prepared ||= await prepareSut({ repoRoot, workDir, dependencyRoot });
  if (prepared.provenance.transport.includes('baseline')) throw new Error('Baseline cannot run through production gateway');
  const backend = await loadReadonlyBackend(prepared);
  const files = new Map();
  async function walk(dir, prefix = '') {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.isSymbolicLink()) throw new Error('Static symlinks denied');
      const p = path.join(dir, e.name), url = prefix + '/' + e.name;
      if (e.isDirectory()) await walk(p, url);
      else if (!e.name.endsWith('.map')) files.set(url, p);
    }
  }
  try { await walk(prepared.staticDir); } catch (error) { await backend.close(); throw error; }
  const rates = new Map();
  const server = http.createServer(async (request, response) => {
    const originalSetHeader = response.setHeader.bind(response);
    response.setHeader = (key, value) => /^(access-control-|set-cookie$|x-powered-by$)/i.test(key) ? response : originalSetHeader(key, value);
    response.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');
    const fail = (status, msg) => { response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end(msg); };
    try {
      if (request.method !== 'GET') return fail(405, 'Read-only study boundary');
      if (request.url.length > 2048) return fail(414, 'URL too long');
      const now = Date.now(), ip = request.socket.remoteAddress;
      for (const [key, item] of rates) if (now - item.start > 60000) rates.delete(key);
      const rate = rates.get(ip) || { start: now, count: 0 };
      rates.set(ip, rate);
      if (++rate.count > 300) return fail(429, 'Rate limit');
      const [pathname] = request.url.split('?');
      // Match raw path, before decoding or normalizing; reject encoded separators/dot segments.
      if (!/^\/[A-Za-z0-9_./-]*$/.test(pathname) || pathname.split('/').some(s => s === '.' || s === '..' || s.startsWith('.')))
        return fail(404, 'Not found');
      if (/^\/api\/products(?:\/[0-9]+)?$/.test(pathname)) {
        delete request.headers.cookie; delete request.headers.authorization;
        return backend.app(request, response);
      }
      if (pathname.startsWith('/api')) return fail(403, 'Outside product-read study boundary');
      let file = files.get(pathname);
      if (pathname === '/' || /^\/product\/[0-9]+$/.test(pathname) || /^\/(login|register|forgot-password|profile|cart|checkout)$/.test(pathname))
        file = files.get('/index.html');
      if (!file) return fail(404, 'Not found');
      const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      response.end(await fs.readFile(file));
    } catch { if (!response.headersSent) fail(500, 'Runtime error'); else response.destroy(); }
  });
  server.maxConnections = 64;
  server.requestTimeout = 15000; server.headersTimeout = 10000; server.maxHeadersCount = 40;
  try { await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); }); }
  catch (error) { await backend.close(); throw error; }
  const address = server.address();
  return {
    server, prepared, staticDir: prepared.staticDir, provenance: prepared.provenance,
    origin: 'http://' + (host.includes(':') ? '[' + host + ']' : host) + ':' + address.port,
    publicOrigin,
    close: async () => { await new Promise((resolve, reject) => { server.close(e => e ? reject(e) : resolve()); server.closeIdleConnections(); }); await backend.close(); },
  };
}
