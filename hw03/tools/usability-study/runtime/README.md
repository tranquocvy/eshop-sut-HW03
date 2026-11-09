# Isolated original EShop runtime (W01)

Node 24+, existing dependency caches; no install, original build command, DB init, seed, tunnel, Git operation or source edit.

```js
import { prepareSut, startSutGateway } from './runtime/index.mjs';
const prepared = await prepareSut({
  repoRoot: 'D:/Workspace/SoftwareTesting/HW03/eshop-sut-HW03',
  workDir: 'D:/Workspace/SoftwareTesting/HW03/_working/eshop-sut-HW03/online-study-runtime/app',
});
const sut = await startSutGateway({ prepared, port: 4311 });
// sut.origin, sut.staticDir, sut.provenance, sut.server
// When stopping your app:
await sut.close();
```

Alternatively `startSutGateway({repoRoot, workDir, host='127.0.0.1', port=4311, publicOrigin?, dependencyRoot?})` prepares then starts. `publicOrigin` is metadata only: it neither publishes nor configures a tunnel. Supply an origin without a trailing slash. Only loopback binds are accepted. Dependency root defaults to sibling `../_working/eshop-sut-HW03`, containing `t01-runtime` or `t02-runtime` with both backend/frontend-web node_modules. Explicit dependencyRoot means this cache parent, not a node_modules path. Each preparation now creates a unique run-* directory beneath workDir and returns that concrete directory as prepared.workDir. It never overwrites or unlinks earlier frontend/static/snapshot files, so repeated starts do not touch a read-only or another Windows account’s previous artifact. Old runs are retained; clean only known stopped artifacts after review, never the study private directory. A writable workDir and accessible dependency cache are still required. Do not mutate original source/database while preparing.

## Parent integration boundary

Serve study portal/admin from other servers/origins; NEVER mount this backend/static tree onto study origin. Open the SUT link with `target="_blank" rel="noopener noreferrer"`; never put study tokens, cookies or participant information in that URL. Parent must enforce distinct public origins before inviting anyone. This module has no invitation/session credentials. It intentionally serves public demo products on its isolated origin.

Static webroot is **only** the returned staticDir, never workDir or repoRoot. No Vite dev server, directory listing or source maps. Known original SPA routes reload; unknown/source/DB paths return 404. Original login/cart/etc markup remains present, but APIs outside exact GET /api/products and GET /api/products/[digits] are denied (403; non-GET always 405). Encoded paths/trailing slash/additional segments are denied. Out-of-scope link clicks are deployment boundaries, not corrected SUT bugs.

Gateway denies framing, sets COOP same-origin, no-referrer, nosniff and no-store; strips incoming Cookie/Authorization and outgoing cookies/CORS. It does not set script/style restrictions which would hide original deliberate DOM/XSS bugs. Per-peer 300 requests/minute, 64 concurrent connections, URL 2048 bytes, header/request limits are deployment boundaries. No forwarded-IP trust. Real proxy/tunnel load may require explicit review of these limits.

## Exact source/config delta and provenance

- Every original frontend/backend file (including database.sqlite and database.js) is SHA-256 hashed before/after preparation. Original source is never written.
- Frontend src/public/index/package/PostCSS/Tailwind inputs are copied byte-for-byte outside repo. External node_modules junction points to the existing cache. External programmatic Vite config loads React, identical Tailwind content patterns expanded against copied source and autoprefixer, disables source maps, and outputs external static/.
- External Axios alias imports the real installed Axios and adds a request interceptor which **only** maps the URL prefix http://localhost:3000/api/ to /api/. Method/path/query/body/status/response handling is unchanged. JSX/CSS/business logic is not transformed by the adapter. Bundle bytes are NOT claimed identical.
- Backend server.js is copied unchanged and hash checked before execution. A scoped CJS loader substitutes only ./database and Express listen. The latter captures the real app without binding original port 3000. All original routes/handlers load unchanged; gateway admits product-read routes only.
- database.js is NEVER required/evaluated. The complete existing demo database is copied, then SQLite opens the snapshot with OPEN_READONLY. Nonempty original WAL/journal files cause preparation to stop. Stop original writers while preparing; hash checks detect concurrent file changes, but are not a substitute for quiescing SQLite. Do not use a production/PII database: original SQL interpolation bugs remain and snapshot includes all original demo tables.
- The VM is a trusted-code dependency loader, NOT an OS/process sandbox. Keep this runtime on an isolated host/process with no study credentials in environment or filesystem scope. Product SQL/DOM defects are deliberately preserved, not advertised as hardened arbitrary-code containment.
- provenance.json records all hashes, adapter delta, dependency paths and timestamp outside webroot. Main study server should persist the returned provenance alongside study version.

## Verification

From repository root:

```
node --test hw03\tools\usability-study\runtime\runtime.test.mjs
```

Uses built-in node:test, installed sqlite3/Express and t02-harness Playwright with its existing Chromium cache. Evidence goes under external online-study-runtime/verification/: verification.json, provenance/build/snapshots and paired screenshots. Test builds an unchanged baseline (no adapter), routes its hardcoded localhost requests **in the test browser only** to an ephemeral backend running the same original server with the same DB snapshot, compares API status/body, exact root DOM and PNGs at 1366x900 for home/search/detail/reload/back. Screenshot tolerance is at most 32 differing pixels with maximum channel delta 32 (observed Chromium raster noise: 9 pixels, channel delta 1 in one reload); actual counts are recorded, never silently called byte-identical. Both browsers abort external placeholder images to remove third-party variability; this is an explicit visual comparison limitation, not full remote asset delivery proof.

No tunnel, HTTPS, outside-host browser, real invitation, portal participant flow or human study is verified by this test. Main server owns the portal stub/new-tab integration and two-origin checks. Do not mark remote W01/W04 delivery complete until observed off-host.
