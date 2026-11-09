# Môi trường thực thi

## chrome

- browser: Installed Google Chrome
- versions: ['157.0.8103.38']
- os: Windows_NT 10.0.26300
- runner: Playwright Test 1.65.0
- viewports: VD 1440x900; VM 390x844 CSS px; same Windows platform
- runs: ['task3-chrome-20261110/runs/2026-11-09T18-12-09-870Z']
- capture: native window screenshot + email overlay
- runtimeMode: Copied tracked SUT source; existing SQLite OPEN_READONLY; no initializer/seed; GET products/categories only

## edge

- browser: Installed Microsoft Edge
- versions: ['157.0.4341.42']
- os: Windows_NT 10.0.26300
- runner: Playwright Test 1.65.0
- viewports: VD 1440x900; VM 390x844 CSS px; same Windows platform
- runs: ['task3-edge-20261110/runs/2026-11-09T18-27-08-246Z']
- capture: native window screenshot + email overlay
- runtimeMode: Copied tracked SUT source; existing SQLite OPEN_READONLY; no initializer/seed; GET products/categories only

## firefox

- browser: Playwright Firefox (patched Gecko)
- versions: ['159.0']
- os: Windows_NT 10.0.26300
- runner: Playwright Test 1.65.0
- viewports: VD 1440x900; VM 390x844 CSS px; same Windows platform
- runs: ['task3-firefox-content-full-20261110/runs/2026-11-09T18-55-41-740Z', 'task3-firefox-content-full-20261110/runs/2026-11-09T18-59-52-389Z']
- capture: content + transparent URL label (not native address bar)
- runtimeMode: Copied tracked SUT source; existing SQLite OPEN_READONLY; no initializer/seed; GET products/categories only