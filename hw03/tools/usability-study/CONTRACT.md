# Study web integration contract v1

Implementation contract; not human study data. Source SUT remains read-only. Ports by default participant 4310, SUT 4311, moderator 4312; bind loopback. No tunnel automatically.

## Files / ownership

- runtime/: SUT gate implementation, no writes to frontend/backend source.
- server/: study service, persistence, security, exports, upload handling.
- portal/: React participant/moderator UI with plain Vietnamese guided copy outside SUT only.
- tests/: integration/E2E maintained by integrator; server tests can be in server/.
- scripts/: setup/start/integrity helpers; storage, build and dependencies outside repo by default.

## Compact screen-only revision

New CLI studies select participantFlow=compact-screen-v1, probeVersion=v0.4 in a new private-compact-v04 data directory. Service/API defaults remain v0.3; omitted historical probeVersion is v0.3. Missing/legacy flow retains historical snapshots and consent semantics; do not rewrite old raw data. API state phases stay unchanged while the compact UI groups them into five stages.

- Eligibility is one explicit eligible boolean covering the five disclosed conditions; no preselection. A negative answer means not all conditions hold, not that every individual condition is false. Do not manufacture five separate negative answers. Legacy detailed screening wire fields remain supported separately, never mixed with eligible.
- Consent groups participate/research/verification under one explicit disclosed agreement; screen consent is separate. audio=false and publicEvidence=false are enforced policy, not hidden affirmative consent. No name/maskedContact collected in compact mode.
- Public participant config uses generic organizer/contact/access labels, not personal organizer details. Admin retains private configuration. Required participant verification roster is maintained separately, not fabricated from empty names.
- Compact prepare requires desktop and live-moderator readiness; recorderChecked/playbackChecked may remain false without inventing technical checks. No audio accommodation required. Screen refusal still needs moderator alternative.
- Screen recorder is invoked by an explicit user click; getDisplayMedia video only, audio=false, no getUserMedia. SUT remains unchanged in another origin/tab. Stop before questionnaires, retain File across phases, explicit upload at video phase; local RAM is not durable storage. Partial/error clips are salvage-only, not sent as complete evidence.
- recordingPolicy metadata distinguishes compact/legacy and external moderation. Recorder tests do not prove native picker UX or off-host delivery.

Probes v0.4 add clarityChoice/recoveryChoice/speedChoice/trustChoice (yes/no/unsure/skip) to the existing probes wire fields. All four choices must be explicit on final submission, with skip available per item; explanations are optional strings and missingReason may be empty. Hidden explanations must be empty. recoveryObserved in participant answers is a self-report compatibility mapping (yes=true, no=false, unsure/skip=null), not moderator observation. Old snapshots reject new choice fields and retain their own wording/validation. Instrument provenance is INSTRUMENTS-v0.4 for new v0.4 invitations. SUS wording/scoring unchanged.

The endpoint field list below describes legacy and shared wire fields; compact overrides above apply by frozen invitation snapshot.

## Participant endpoints

All participant routes on 4310 only. No admin paths on participant listener. GET /health. GET /api/session requires study_sid HttpOnly SameSite=Strict cookie (Secure over configured HTTPS); returns {session,config,csrf}. Reject requests with unexpected Host/origin, do not trust forwarded admin routing. No reflected CORS. Mutation requires exact study origin + X-CSRF-Token except invitation exchange, which still checks Origin. No secret query parameters; invite fragment is removed before app calls.

POST /api/exchange {token} → {session,config,csrf}; invite token hashed at rest, short expiry, one browser redemption with resume via cookie. New redemption invalid/expired/revoked fails clearly. No tokens in logs or public exports. No bearer study token goes to SUT.

POST /api/session/step {step,data,revision,operationId,draft?} → {session,config,csrf}. revision is integer optimistic concurrency; stale writes 409; repeat operationId idempotently returns current session. draft saves fields without advancing; final checks server phase/fields. GET returns own drafts/answers, no moderator notes, scores, findings or other participants.

Participant session shape: {id,code,kind,phase,revision,answers:{screening,consent,prepare,scenario,task,sus,probes},evidence:[{id,status,size,originalName}],taskReleased,submittedAt,withdrawnAt}. phase enum screening,consent,prepare,scenario,task,sus,probes,video,done,ineligible,declined,withdrawn. Pilot/main separate kind, synthetic only in automated tests, not fake human records. taskReleased must be granted from moderator; scenario → task denied until released. Task answer is self-report, not auto K1 pass. action time is coarse portal marker; verified timing/outcome stays moderator-owned.

step payloads (final save unless noted):
- screening: {adult:boolean,vietnamese:boolean,shopping:boolean,outsideClass:boolean,uninvolved:boolean,experience:string,itBackground:string}. first five true to advance; ineligible otherwise, no contact collection yet.
- consent: {participate:boolean,screen:boolean,audio:boolean,research:boolean,verification:boolean,publicEvidence:boolean,name:string,maskedContact:string}. all booleans explicit, no defaults. Mandatory participate/research/verification to run assignment session; refusal ends declined without coercion. screen/audio refusal records real choice, holds prepare until moderator decides valid accommodation; never silently marks full compliance. Only masked contact collected in UI; no full contact needed.
- prepare: {recorderChecked:boolean,playbackChecked:boolean,callReady:boolean,desktop:boolean}. require checks + moderator approved accommodations if needed.
- scenario: {understood:boolean}; final opens task only when taskReleased true; response config.sutOrigin for new tab opening, noopener/noreferrer.
- task: {finished:boolean,product:string,price:string,reason:string,stopReason:string}. unfinished accepted without product, finished requires self-report fields (not truth validation); phase sus.
- sus: {values:[number|null x10],missingReason:string}. only ints1..5 or null; no default/impute. incomplete permitted with reason. score never returned to participant.
- probes: {clarity:string,recovery:string,recoveryObserved:boolean|null,speed:string,trust:string,improvement:string,missingReason:string}. allow refusal/missing with reason; no invented observations. phase video.
- finish: {videoLater:boolean,videoReason:string}. allow finish with video pending, never imply evidence verified; phase done.
- withdraw: {reason?:string}. revoke access, delete personal data and actual evidence according to configured policy; keep only nonidentifying tombstone, not PII in audit.

POST /api/evidence raw video bytes with Content-Type video/mp4 or video/webm, X-File-Name URL encoded, X-Operation-Id, X-CSRF-Token. Stream to private temp with max size/quota, verify magic/header, server filename, atomic finalize/hash/dedupe. Only for consented session video/done phases; received != verified. No client paths. Missing/disconnected uploads don't lose surveys. GET participant sees metadata only; video stream admin only.

## Moderator endpoints (4312 only)

GET /api/admin/bootstrap → {needsLogin:true,configured:boolean}. POST /api/admin/login {password} → admin HttpOnly cookie and csrf, with origin check and rate limit. Initial random credential stored only private outside repo; don't return via public route or log. Admin UI login plain Vietnamese. POST logout. All protected mutations exact admin origin + CSRF; participant origin may not call admin even loopback reachable. No token in HTML/bootstrap.

GET /api/admin/state → {config,sessions,findings,summary,csrf}; includes consent and masked identity for authorized moderator, private observations/reviews; never full contact.
POST /api/admin/config {config} → config; fields {organizer,organizerContact,storageDescription,accessDescription,deleteBy,withdrawBy,studyOrigin,sutOrigin,adminOrigin,maxVideoMB,frozen,version,pilotReview}. All consent info required before real invitations. No external URLs except valid http(s) origins. Main invites only when frozen and reviewed pilot true.
POST /api/admin/invitations {kind:'pilot'|'main',code,expiresHours} → {session,inviteUrl}; URL displayed once. Codes PILOT-01 or P01..P07; no pre-seeded sessions. Reissue/revoke action POST /api/admin/sessions/:id/invitation {revoke:boolean}. Limit main to seven distinct codes.
POST /api/admin/sessions/:id/review {releaseTask?,accommodation?,notes?,observation?,outcome?,k1?,taskSeconds?,timingSource?,recoveryObserved?,evidenceReview?,reviewed?} → session. Notes/observation are strings with timestamps available. Outcome independent/assisted/unfinished/technical-interruption separate participant phase. EvidenceReview includes {id,status:'verified'|'needs-replacement'|'waived-with-reason',reason}; true verification requires actual existing received video, no fake waived evidence.
POST /api/admin/sessions/:id/evidence raw video (same protections), explicit source description header for manual import; no arbitrary server path import.
GET /api/admin/evidence/:id protected inline video, nosniff sandbox, range support if available.
POST /api/admin/findings {id?,title,kind,severity,reason,participantIds,evidenceRefs,expected,actual,reproduction,recommendation,issueUrl} → finding. Validate references; no PII guessed/generated; no Issue publication.
GET /api/admin/export?format=json|csv|markdown|html|participants → attachment. Default redacted excludes identity/contact/cookies/invites/private paths. participants explicit private table with name/maskedContact only. HTML printable report safe escaped and print-to-PDF supported; mark draft if evidence/session requirements unmet. Raw SUS, derived and summary retain provenance. Exclude pilot and incomplete/not-reviewed main from aggregate as documented with actual denominator; no success inferences.

## UI expectations

Compact participant UI has five groups: participation, task, evaluation (SUS + probes), video, finish. Recording starts only by an explicit getDisplayMedia({video:true,audio:false}) request; no microphone/camera or rrweb. Manual file upload remains a fallback. Legacy snapshots retain their seven-group preparation/manual-recording flow. Both flows use descriptive buttons and draft status without illegal phase skip, plain Vietnamese, no participant-facing scores, actionable errors and neutral recording instructions without EShop task hints. Mobile guidance does not pretend desktop was evaluated. Cancel/withdraw follows the submitted-data policy cutoff; no pre-ticked consent/radio.

Moderator UI has config, create/revoke/copy invitation, sessions detail and notes/release/outcome/video review/import, pilot review/freeze, findings, summary/export/print. No admin credentials embedded. Visible save/retry/loading errors, accessible labels/focus/keyboard. No data entered in study becomes HTML. SUT opens separate origin/tab unchanged, participant timing distinguished from portal marker.
