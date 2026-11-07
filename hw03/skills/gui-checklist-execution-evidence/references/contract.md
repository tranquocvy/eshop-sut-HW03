# JSON contract v1 — manifest và evidence

Đây là contract tài liệu, **integration pending main review**, không phải JSON Schema executable hay tuyên bố runner đã hỗ trợ. Adapter harness phải map tường minh và được test trước pilot. Xem [mẫu](../assets/manifest-example.json) và [procedure](../SKILL.md). Không dùng placeholder làm evidence thật.

## 1. Quy ước và manifest

UTF-8 JSON, schemaVersion = "1.0", không comment. Mọi trường dưới đây bắt buộc trừ khi ghi optional. Path artifact tương đối RUNS_ROOT/runId, cấm absolute/../symlink thoát root; config input có thể dùng biến môi trường, resolve trước chạy và ghi config đã resolve đã lọc secrets. ID slug không chứa separator. Hash thật là SHA-256 hex 64 ký tự, không placeholder. Null chỉ khi chưa có observation và có lý do.

Manifest có: schemaVersion, mode (pilot/full/review/reuse), integrationStatus, inputs, permissions, platforms, capabilities, cases.
- inputs: checklist/spec/fixture/baseline refs có path hoặc URI, sha256; rootsEnv ánh xạ sut/harness/runs sang tên biến môi trường; baseUrlEnv. Fixture có fingerprint trước/sau, mode và source độc lập expected. Source hash chỉ truy vết, không biến source code thành oracle.
- permissions: installDependencies/startRuntime/executePilot/executeFull/export/publish/commit boolean; quyền manifest không thay quyền người dùng.
- platforms[]: key, os, browser, engine, versions, binaryKind, viewport {width,height}, dpr, locale, zoom, verified, proof[]. Platform key gồm browser/OS thật; viewportKey là chiều riêng. Chưa biết version ghi null + verified=false, không suy từ UA.
- capabilities[]: key, platformKey, status (verified/unavailable/pending), proof[], reason. Một capability chưa verify chỉ chặn case thật sự dùng nó.
- cases[]: instanceKey, checklistId, variant, page, platformKey, viewportKey, contextGroup, required, lane (automated/hybrid/human), requiresCapabilities[], requires[], provides[], actions[], assertions[]. instanceKey duy nhất bao gồm ID/variant/page/platform/viewport; attempt không nằm trong manifest key.
- actions[]: order, kind, target, value (optional), count, observation. Count là số hành động chính xác; click đầu count=1, không double-click. Không dùng script/API thay UI action được kiểm thử.
- assertions[]: key, expected, oracle {class:R/L/H, refs[], rationale}, reviewRequired. L cần tiêu chí vận hành cụ thể được review, không mặc nhiên là SRS. H fail là heuristic/design; assertion mixed tách nhiều phần.

## 2. Dependency graph

requires[] chứa {instanceKey, assertionKey, state, reason, continuity}. Dependency target/assertion tồn tại, graph không cycle. Chỉ tạo edge khi thiếu state đó thực sự ngăn downstream kết luận. Cùng platform/viewport/variant state liên quan; cross-page edge phải giải thích state continuity, không dùng ID-wide wildcard. provides[] là tên state có điều kiện: chỉ phát hành sau assertion tạo state đã được chứng minh, không vì native passed.

contextGroup thể hiện liên tục state trong cùng scenario. Root first-click gate có thể dùng context tương đương riêng để chặn chi phí downstream; không tái dùng cart bẩn cho validation context sạch. Nếu state buộc liên tục, giữ context và log; không dùng result cũ làm state mới. GUI-050 dùng Home first-click trong cùng contextGroup để tạo state rồi sang Detail; không phụ thuộc Detail first-click.

Khi root action thực thi đúng một lần nhưng thiếu feedback expected, root assessment=fail. Downstream chỉ blocked khi requires chưa thỏa, có blockedBy trỏ result root + assertion + reason. Không thực hiện downstream action để vượt root; không click thêm. Input/label/layout độc lập vẫn chạy. Ví dụ 1.5 nhập được nhưng cơ chế rejection bị root che: input observation riêng, phần rejection blocked, không pass từ validity hoặc click im lặng. Nếu riêng invalid event thật chứng minh chặn action thì đánh giá assertion đó theo evidence, không blanket block.

## 3. run.json và result.json

run.json: schemaVersion, runId, startedAt/finishedAt ISO-8601, mode, inputs hashes, environment (OS/browser/engine/runner/package versions, binary proof, viewport/DPR/locale/browserZoom/baseUrl), fixtureBefore/fixtureAfter, launcher {mode,noSeedProof}, isolation, serviceWorkerMode, networkMode, capabilityMap, privacyPolicy, identity (đã xác nhận hoặc missing), sharedServerLogs[], manifestRef. Không chứa credential.

result.json mỗi attempt:
- schemaVersion, runId, instanceKey, checklistId, variant, page, platformKey, viewportKey, attempt (integer >=1), attemptKey, retryOf (null hoặc ref attempt cũ), contextGroup;
- startedAt, finishedAt, sutHash, harnessHash, checklistHash, fixtureFingerprint;
- expected (snapshot assertions+oracle), actual (observation cụ thể, không chép expected), actionsPerformed[], assertionResults[];
- prerequisites[] (target, state, met, proof), blockedBy[] (resultRef, assertionKey, reason);
- nativeStatus (passed/failed/timedOut/skipped/interrupted hoặc null nếu không gọi runner), assessment (pass/fail/blocked/needs-review/not-applicable/not-run), reasonCode, reason, errors[];
- humanReview {required, status:not-required/pending/approved/rejected, reviewer, reviewedAt, evidenceRefs, notes}; reviewer/reviewedAt null khi chưa review; không ghi reviewer giả;
- evidence[] {kind, path, sha256, capturedAt, originalRef, redacted}; missingArtifacts[]; cleanup {status, notes}.

assertionResults[] chứa assertionKey, observation, assessment, evidenceRefs, findingType (requirement-bug/heuristic-design/technical-observation/none). Native failed có thể là lỗi harness, không tự là SUT fail. Native passed chỉ chứng minh test code hoàn tất; hybrid pending => assessment needs-review. Blocked không là N/A hoặc skipped. N/A cần applicability rationale/reviewer, không do thiếu platform. Not-run là chưa lên lịch/chưa thực hiện, không giả có actual. Missing capability => blocked; evidence hỏng/thiếu => needs-review hoặc blocked có lý do. Pass đòi mọi assertion cần thiết có proof và human review hoàn tất.

## 4. Artifacts và tính bất biến

Cây chuẩn: runId/checklistId/variant--page/platformKey--viewportKey/attempt-NNN/{result.json,screenshots/,logs/,trace.zip,video.webm,checksums.json}. Nếu native runner dùng cây khác, index map bijective, không đoán tên folder. screenshots có before/after-first-action khi liên quan và ảnh kết quả cho cả pass/fail. Logs JSONL có timestamp, instanceKey, attemptKey, event và metadata đã lọc; network chỉ metadata cần thiết. Trace/video optional theo capability/policy; không tạo file giả để đủ count. Native HTML report đính kèm artifacts. Shared server logs trong runId/server, liên hệ bằng timestamp/request ID.

Finalize attempt rồi không sửa/ghi đè; retry/repro tạo attempt mới với retryOf. Human review muộn lưu event/record mới append-only, index trỏ effective review mà giữ result gốc. Redacted/annotated export là derivative có originalRef; không sửa ảnh gốc. Giữ first fail; fail→pass đánh dấu flaky ở index, không đổi fail cũ thành pass. Checksums manifest tự hash không cần đưa hash chính nó; index có thể hash checksums.json.

Ảnh browser chrome phải chụp window/desktop thật ở host đúng, không vẽ URL/frame; page/full-page không thay thế. Email sinh viên+họ tên/MSSV phải được xác nhận, không suy từ Git. Overlay là derivative, không sửa nội dung UI. Original có PII lưu local giới hạn truy cập; export lọc secrets/PII ngoài scope, không tự publish.

## 5. Verify và acceptance

Kiểm parse JSON/frontmatter, keys/refs duy nhất, DAG acyclic, target assertion/provides hợp lệ, scope/page/platform/continuity, không wildcard block; không mark pass khi dependency/capability thiếu. Kiểm file/path/checksum, artifact required theo assertion, ảnh pass/fail, first-click action count, event ordering, cleanup và trạng thái review. Tổng hợp riêng ID/instances/attempts; mỗi platform/viewport/variant bắt buộc có hàng riêng, thiếu lane không được giấu trong aggregate pass.

Mẫu chỉ gồm lát cắt dependency: không là manifest 50 ID, không proof browser hay kết quả GUI. Unit contract/adapter, pilot pipeline, verify artifacts là ba lớp khác nhau. Scripts dự kiến npm run unit/pilot/verify phải được main kiểm package.json và triển khai thực tế; skill không cung cấp CLI. Full execution, platform thật, reuse khác và usability người thật vẫn cần evidence riêng.
