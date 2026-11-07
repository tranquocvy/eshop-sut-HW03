# Adapter pilot v0.1 — phạm vi đã triển khai

Đây là adapter hẹp chạy thực tế, không phải full JSON contract v1. Dùng cùng [procedure](../SKILL.md) và [contract mục tiêu](contract.md). Không báo full-contract conformance hoặc full-checklist coverage.

## Cấu hình triển khai hiện tại

Source runner ở [hw03/tools/gui-harness](../../../tools/gui-harness/README.md), tách khỏi skill hướng dẫn. Harness thực thi đã dùng nằm ngoài repo tại _working/eshop-sut-HW03/t02-harness trong bố trí HW03. Materializer copy source runner ra thư mục làm việc mới; không copy dependency/browser/run evidence. Đọc package.json và README.md harness trước thực thi. Có npm run unit, npm run pilot, npm run verify -- <run-directory>; node scripts/validate-skill.mjs là focused validator Node, không thay tuyên bố đã chạy bundled Python validator.

Biến thực tế: SUT_REPO, SUT_RUNTIME, SUT_DEPENDENCY_SOURCE, GUI_RUNS_ROOT. GUI_RUN_DIR do orchestrator sinh mới mỗi run; GUI_STAGE=root/main là hai stage native report. URL pilot cố định frontend http://127.0.0.1:5173 và API http://localhost:3000 vì source SUT; workflow reuse khác phải cấu hình adapter mới, không giả generic URL đã hỗ trợ.

## Mapping artifact thực tế

- pilot-manifest.json: instances[{id,variant}] (13 instance/7 ID), dependency root/downstream/independent, scope/notCovered. Đây là registry pilot xác định bằng code, chưa compiler tổng quát cho 50 ID.
- run.json: runID, head/checklistHash, platform thật (OS/release/browser/version/runner/node/viewport/DPR/locale), fixture, runtimeMode, capability flags. fixture/manifest.json chứa source/AI/database fingerprints và dữ liệu products/categories đối chiếu.
- dependencies.json: detail-add-accepted có scope page|platform|viewport|fixture, assessment và result path. Chỉ phát hành sau root observation; GUI-026 action variants dùng gate, GUI-025 input độc lập. Graph tổng quát/continuity xuyên trang chưa implemented; không sử dụng gate này thay state thực của GUI-050.
- result.json: id/variant/platform/viewport/attempt, timestamps, nativeStatus, assessment/reason, expected/actual, rootEvidence, evidence paths, errors và source marker. Human/hybrid được giữ needs-review; chưa có human reviewer signature hoặc automatic approval. Native skipped của downstream vẫn assessment blocked.
- logs/steps.jsonl, console.jsonl, network.jsonl, errors.jsonl; logs/validation.jsonl chỉ khi nhánh đó thực sự chạy. Không tạo validation log giả khi root chặn.
- screenshot PNG/full-page web content (không browser chrome), trace.zip và video cho actionable cases; checksums.json giữ SHA-256. Blocked dependent không mở context/navigate/action/screenshot/video; evidence link tới root. Native attachments có thể có bản copy phục vụ report.
- index.json/summary.md tổng hợp riêng counts/links; report/root và report/main là report native. integrity.json kiểm repo/runtime DB/source/checklist/AI/HEAD không đổi. render-preflight.json kiểm utility CSS đã nạp.

## Trường/nhánh chưa được hỗ trợ đầy đủ

Full contract v1 có assertion-level R/L/H results, generic DAG/capability compiler, per-assertion review events, retries/retryOf, human review approval, cross-platform/VM/real zoom/IME/window capture/identity overlays. Adapter này chưa triển khai trọn các phần đó. Không lấy example manifest làm execution manifest hoặc tiếp nhận full input rồi lặng lẽ bỏ qua trường. Full/reuse branches phải blocked/not-run tới khi adapter được bổ sung và kiểm chứng.

Với workflow hiện tại, sử dụng pilot để chứng minh pipeline và lưu nguyên trạng kết quả Fail/Blocked/needs-review; không sửa SUT để xanh. Lỗi launcher/render/harness phải ghi run-review riêng và loại khỏi GUI acceptance; reproduction là run mới. Mỗi lần chạy pilot giữ toàn bộ run cũ; không automatic retry/action click lại.

## Pilot schema 0.2

Adapter v0.1 triển khai result schema pilot-0.2 sau hardening. result có blockKind, oracleFailure và oracleAssertions với expected/actual/source R/L/H; chỉ ev.assert explicit trong oracle phase tạo mismatch SUT. Setup/render/timeout/technical error không được suy từ message chứa expect. Dependency blocked và technical blocked là hai nhánh khác; technical blocked được giữ browser evidence nếu đã mở context.

Gate root yêu cầu feedback success nhìn thấy, đúng hành động (button/toast/badge1); trạng thái busy-only hoặc feedback chưa rõ là needs-review và không cung cấp prerequisite. Parser badge không coi số tiền trong link là quantity. Validator bắt schema/enums, actual presence, regular/nonempty artifact và header PNG/ZIP/WebM; không coi hash/header là chứng nhận screenshot thực. harness-manifest.json và integrity.harnessSourcesUnchanged chứng minh source harness không đổi trong run.
