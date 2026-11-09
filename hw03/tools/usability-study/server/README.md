# Private study service

Node 24.22+ standard library only: node:http, node:sqlite, crypto and streaming file IO.
No installs, SUT writes, real sessions, tunnel, network deployment or CLI side effects.

## Integrator API

```js
import { createStudyService } from './server/index.mjs';
const service = createStudyService({
  dataDir: 'D:/private/study', // required; outside repo AND portal webroot
  portalDir: 'D:/working/portal-dist', // optional, already-built static UI
  participantPort: 4310,
  adminPort: 4312,
  host: '127.0.0.1',
  config: {}, // initial config on first database creation only
  maxStorageMB: 8192,
  // Optional, supplied by trusted startup, never participant/config UI:
  provenance: {
    sutCommit: 'a'.repeat(40), // actual full Git commit hash, NOT this example
    sourceHashes: { 'frontend-web/src/main.jsx': 'b'.repeat(64) }, // actual SHA-256
    transport: 'External Axios URL prefix adapter; original source byte-identical'
  }
});
const { participantAddress, adminAddress, adminPasswordFile } = await service.start();
// Read adminPasswordFile privately; do not log its content.
await service.close();
```

Use fixed positive distinct ports matching configured origins. Admin ALWAYS binds
127.0.0.1, independently of participant host. No trust-proxy behavior.
Health is /health on participant listener only. The same portal build is served
on both listeners; /admin is a frontend route. Participant listener never routes
/api/admin, even if authenticated or supplied forwarded headers.

First startup writes a random password to dataDir/admin-password.txt (not stdout);
database stores only scrypt verifier+salt. Invitations and browser credentials
are SHA-256 hashed at rest. Admin login sessions are memory-only and expire after
8 hours; restart requires admin login again. Participant browser credentials survive
restart only within their persisted 24h credentialExpiresAt. Server checks expiry on every
request, independently of browser cookie max age. Revoke/reissue/withdrawal clears the
credential. Old databases with no expiry do not receive an invented renewal; reissue a link.
Cookies host-only, HttpOnly, SameSite=Strict, Secure when configured origin is HTTPS.
EShop must use a DIFFERENT HOSTNAME from both participant and admin; default SUT is
http://localhost:4311 while portal uses http://127.0.0.1:4310.

Exact Host checked on every request, exact Origin plus CSRF on all mutations
except exchange/login (Origin still required). HTTPS origins may describe a
TLS-terminating participant proxy; forwarded headers never determine trust.
Do not proxy the admin listener. No reflected CORS.

## Response envelopes and fields

All CONTRACT v1 routes are implemented. JSON errors: {error: VietnameseMessage}.
Successes:

- exchange/session/step: {session,config,csrf}
- evidence/import: {evidence:{id,status,size,originalName},duplicate?}
- bootstrap: {needsLogin:true,configured:true}; login: {csrf}; logout: {ok:true}
- admin state: {config,provenance,sessions,findings,summary,csrf}
- config: {config}; invitation: {session,inviteUrl}; revoke: {session}
- review: {session}; finding: {finding}
- exports: authenticated attachment in requested format

Participant session phase starts at screening, not a separate invited phase.
Finish step maps video -> done (survey receipt only, not study completion). When no
received/verified video exists, a nonempty videoReason is required regardless of
videoLater. Additive evidenceStatus is pending / pending-review / needs-replacement /
reviewed and is independent of phase. Consent drafts/refusals remove name/contact unless
participate, research and verification are all exactly true; declined records keep actual
consent booleans but not identity. Existing nonaffirmative drafts are scrubbed on restart.
Withdrawal is available from any phase before
snapshot withdrawBy. On withdrawal the last response clears cookie and csrf;
subsequent requests are unauthorized. Raw answers for prior final steps or
submitted sessions cannot be updated. Draft saves only the CURRENT step and must
send the full current draft object; not a partial patch. Drafts live only in session.drafts,
not finalized session.answers, and restore across refresh/restart. Final submission moves
the step to answers and clears its draft. JSON redacted exports preserve drafts separately;
SUS status is draft/missing/submitted, and only submitted SUS yields derived scores.
CSV adds susStatus; human reports explicitly label unsubmitted drafts, not raw final data.
On legacy restart a current-phase answer is migrated to drafts (final submission always
advances phase), preserving historical finalized steps. Missing answers are not
imputed. Repeating a step operationId returns current state, even with stale revision.
Moderator updates/upload receipts advance revision, so refresh after moderator action.
Review notes and observation accept strings and append timestamped records.
Accommodation is a nonempty reason string, not boolean; it never changes consent.
K1 is a moderator-owned object of criterion -> boolean/null/string, no inferred pass.
A taskSeconds value requires a nonempty timingSource.
Findings arrays participantIds/evidenceRefs refer to internal session/evidence IDs.
Required finding string keys are title/kind/severity/reason; optional-answer string
keys expected/actual/reproduction/recommendation/issueUrl must still be supplied
as strings (empty allowed).

Manual import uses the same raw upload protocol and requires
X-Source-Description. No server-path import.
Waived-with-reason is a review status on an EXISTING evidence record only; no
fabricated evidence ID is created for missing video. To document missing video
use notes/accommodation and finish videoReason (videoLater does not bypass the reason). Verification requires
the stored file to exist at recorded size; moderator must actually view it.
Compact-screen-v1 additionally inspects container track metadata in the shared
participant/moderator upload path before dedupe/finalization. Rejects audio,
missing/ambiguous/unsupported track metadata with HTTP 415; staging files are
removed by the existing upload finally block. No historical evidence is rewritten.
The standard-library random-access reader skips media payloads. WebM inspects
TrackType + CodecID (VP8/VP9/AV1 only), unique TrackNumber/UID, and supports
MediaRecorder unknown-size Segment/Cluster boundaries. MP4 inspects each
trak/mdia/hdlr (video-only), including 64-bit box lengths, skipping mdat.
Limits: 32 tracks, 50,000 parsed element/box headers, 2 MiB total header/field reads,
1 MiB Tracks/moov metadata. Unsupported layouts/limits require a replacement
recording, not a silent override. Fixed schema traversal avoids recursive descent.
This is not codec/bitstream validation, proof of screen content, or an antivirus scan.
Moderator playback/privacy review remains necessary. Legacy uploads retain their
existing magic-only validation. CSP permits blob: only in media-src for local preview.
New compact fallback provenance references PROTOCOL.md v0.3; legacy remains v0.2,
and stored snapshot instrumentProvenance takes precedence without rewriting.

MP4 ftyp / WebM EBML magic validation rejects renamed arbitrary files; it is not a
full codec/decoding/malware check and does not prove a playable complete video.
Playback supports a single bytes=start-end range (not suffix or multipart ranges).

Configuration is merged before validation. Main invitations require complete
consent information, real nonexpired calendar deadlines (UTC end-of-day),
withdrawBy <= deleteBy, a submitted moderator-reviewed pilot, pilotReview=true and
frozen=true. Frozen configuration cannot change thereafter; create a new dataDir
for a genuinely new study. Every invitation snapshots config, and exported/public
config includes fixed instrument/scenario references, honest config.version and optional
sutProvenance. The startup provenance option is {sutCommit, sourceHashes, transport};
sourceHashes maps safe relative source paths to SHA-256 hex, no absolute/traversal or
node_modules/.git paths. Only full 40/64-hex commit hashes accepted. No paths/secrets
should be embedded in transport text. It is normalized, copied into each invitation
snapshot and exported/reported. Config UI cannot mutate it. Restart with different or
omitted provenance refuses to mix builds, including legacy DBs without provenance when
new startup provenance is supplied: use a new dataDir. Omission on synthetic studies is
allowed and reports unavailable, not checked. Startup-supplied provenance is a declaration,
not remote acceptance proof. Config changes record time/version/fields/pilot refs, while
pilot notes contain moderator-authored change rationale. No main sessions seeded;
only PILOT-01/P01..P07 supported, unique code, reissue existing slot when needed.
Code tombstones remain reserved after withdrawal.

## Storage, privacy, exports, limitations

SQLite contains a private durable state document. FULL synchronous transactions,
secure_delete and WAL truncation on each save reduce recoverable deleted raw data.
Video streams sequentially to private tmp, bounded by per-file frozen quota and
global quota (including active uploads), then magic/hash/atomic rename -> receipt.
Dedupe is per session/hash, not cross-participant. Tmp removed after failure and
stale staging files removed at startup. Upload is whole-file retry, not resumable.
Existing surveys survive failed uploads. Evidence is never available to participant
listener, even through static paths; static extensions and canonical paths restricted.

Withdrawal removes raw answers, identity, invitation/browser credentials, private
reviews, video bytes and findings ever referencing that session. Keeps only
nonidentifying code/kind/id/withdrawn timestamp tombstone. No original withdrawal
reason retained. Active upload must settle before withdrawal. Physical disk
forensic erasure, preexisting backups, filesystem snapshots and copies already
exported are not guaranteed; operator must apply agreed retention policy to those.
SQLite/files are not encrypted. File modes 0700/0600 are requested; Windows ACLs
and disk encryption remain environment controls and are NOT modified here.

Redacted exports omit identity fields, cookies,
invites, filesystem paths and original filenames. Known names/masked contacts
are also stripped if copied into free text. Arbitrary self-disclosed PII in free
text cannot be reliably detected: human privacy review required before sharing.
Moderator notes/observations are included for reproducibility, with known identity
strings redacted; these free-text fields require the same human privacy review.
participants export is explicit private name/maskedContact table.
JSON contains full redacted raw answers, review/events, per-session snapshots, raw SUS,
derived scores, provenance, evidence, findings, config history and summary. Markdown/HTML
are structured Vietnamese reports (objectives, method, scenario/protocol/source references,
actual session denominators, raw/derived SUS, performance/time source, pilot/freeze,
findings/repro/severity/recommendation/Issue refs, evidence manifest and limitations).
They do not wrap a giant JSON document. Missing sources/exposure/observations are explicit,
not fabricated; DRAFT and human privacy-review warnings remain. CSV is a score/session analysis table (not a
complete relational export); use JSON for complete reproducible dataset.
HTML is escaped, script-free and printable. CSV formula prefixes escaped.
Exports always say DRAFT, conservatively; no software claim of actual assignment
completion or human-session validity. Aggregate includes only done+reviewed main
sessions; SUS denominator additionally requires all 10 valid values. Pilot and
incomplete sessions remain raw in export but never enter aggregates.
No identity/contact verification or actual evidence quality is automated.

## Verification

```sh
node --test hw03/tools/usability-study/server/server.test.mjs hw03/tools/usability-study/server/edge.test.mjs
```

All test datasets and credentials created under OS temp, outside repo/webroot,
and cleaned. Header fixtures are synthetic bytes, not human study recordings.
Local API tests do not establish W01 remote/runtime acceptance.
