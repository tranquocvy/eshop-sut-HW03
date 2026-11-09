# Screen-only recorder integration

Import `useScreenRecorder` from `./recorder.jsx`. Call it **unconditionally at Participant's top level**, above early returns, not inside changing phase components:

```jsx
const capture = useScreenRecorder({ maxBytes: 128 * 1024 * 1024 });
// Inside an explicit button click only:
<button onClick={() => capture.start()}>Start screen recording</button>
// To finalize: const file = await capture.stop();
// Local playback: <video src={capture.url} controls playsInline />
// Download: <a href={capture.url} download={capture.file.name}>Save video</a>
```

API: `{status, file, url, error, start, stop, discard}`.

- Status is `idle | requesting | recording | stopping | ready | error`.
- `file` is a browser File or null; `url` is its temporary local blob URL or null; `error` is a user-readable English string or null (UI may translate).
- `start()` returns a Promise<void>. It never auto-starts and does not throw permission errors. Call directly from a click, without prior awaited work, to preserve browser activation. Duplicate starts are ignored. Existing files are protected: explicitly discard before starting again.
- `stop()` returns Promise<File|null>. Repeated active stops share one promise. Await finalization; the final dataavailable chunk is included. A ready file remains in memory across phase changes. Calling stop during requesting cancels this logical attempt, but cannot close the browser picker; any late stream is immediately stopped.
- `discard()` is synchronous and only works while inactive. During requesting/recording/stopping, first stop and await finalization. Discard revokes the URL and clears the file/error.
- Cleanup on unmount (including React StrictMode effect replay) cancels pending capture, detaches recorder events, stops all tracks, clears timers, and revokes the URL. Changing maxBytes disposes the existing engine: keep maxBytes stable during a recording.

Only `getDisplayMedia({video:true,audio:false})` is used. No microphone/camera API, audio capture request, upload, network, storage, token handling, or automatic download exists. Unexpected audio tracks are stopped and removed before constructing MediaRecorder. Browser permission UI may still show browser-owned options; audio is not recorded. The participant must select the intended EShop window; code cannot guarantee which surface the browser picker selects.

UI owns consent gates, button disabling, start/stop timing, beforeunload warnings for requesting/recording/stopping or any unsent file, local playback/download controls, and explicit upload. Do not remount Participant or change its key while an unsent file exists. There is no durable recovery after refresh/tab close/crash. Do not discard/revoke the URL while it is being played/downloaded or before the user has retained the file.

Default cap is 128 MiB. maxBytes must be a positive safe integer, in bytes. Recorder requests one-second chunks; retained chunk data never exceeds the cap. Browser buffering and a single incoming chunk may transiently exceed it (timeslice is not a strict browser memory limit). On reaching/exceeding the cap, capture stops; an overflowing chunk is dropped whole. Status is **error**, never ready: any available file is explicitly partial, may not play, and must not be represented as complete. Error files can be offered for salvage/download but should not be submitted as complete evidence. Recorder errors or the 10-second missing-stop timeout also mark any salvaged file partial.

Formats are selected via MediaRecorder.isTypeSupported: VP9 WebM, VP8 WebM, WebM, then MP4; browser default is attempted if none is advertised. Actual emitted chunk MIME (falling back to recorder MIME) determines File.type and .webm/.mp4. Unknown formats and empty captures fail. Normal browser-produced ready files support local playback; actual browser/container playability still needs the parent-owned browser smoke check. No transcoding occurs.

Unit tests (no browser/device permissions):
```
node --test hw03/tools/usability-study/tests/recorder.test.mjs
```
The injectable pure engine is `createScreenRecorder(options, dependencies)` in `recorder-engine.mjs`; it additionally exposes subscribe, getSnapshot, and dispose for lifecycle tests.
