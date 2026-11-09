import test from 'node:test';
import assert from 'node:assert/strict';
import { createScreenRecorder } from '../portal/recorder-engine.mjs';

const tick = () => new Promise(resolve => queueMicrotask(resolve));
class Track extends EventTarget {
  constructor(kind) { super(); this.kind = kind; this.readyState = 'live'; this.stops = 0; }
  stop() { this.stops++; this.readyState = 'ended'; }
  end() { this.readyState = 'ended'; this.dispatchEvent(new Event('ended')); }
}
function fixture(options = {}, overrides = {}) {
  const video = new Track('video'), audio = new Track('audio');
  const tracks = [video, audio], calls = [], recorders = [], revoked = [], timers = new Set();
  const stream = {
    getTracks: () => [...tracks], getAudioTracks: () => tracks.filter(t => t.kind === 'audio'),
    getVideoTracks: () => tracks.filter(t => t.kind === 'video'),
    removeTrack: t => { tracks.splice(tracks.indexOf(t), 1); },
  };
  class Recorder {
    static isTypeSupported(type) { return type === 'video/webm'; }
    constructor(s, config) {
      assert.equal(s.getAudioTracks().length, 0);
      this.mimeType = config?.mimeType || 'video/webm';
      this.state = 'inactive'; this.stopCalls = 0; recorders.push(this);
    }
    start(slice) { assert.equal(slice, 1000); this.state = 'recording'; }
    chunk(value = 'data', type = this.mimeType) { this.ondataavailable?.({ data: new Blob([value], { type }) }); }
    stop() {
      this.stopCalls++; this.state = 'inactive';
      queueMicrotask(() => { this.chunk('final'); this.onstop?.(); });
    }
  }
  const env = {
    supported: () => true,
    getDisplayMedia: async constraints => { calls.push(constraints); return stream; },
    MediaRecorder: Recorder, File,
    createURL: file => { assert.ok(file instanceof File); return 'blob:test-' + recorders.length; },
    revokeURL: url => revoked.push(url),
    setTimer: fn => { timers.add(fn); return fn; }, clearTimer: fn => timers.delete(fn),
    ...overrides,
  };
  const engine = createScreenRecorder(options, env);
  return { engine, env, video, audio, stream, calls, recorders, revoked, timers };
}

test('explicit start only; screen constraints, unexpected audio stripped, final chunk retained, matching MIME and URL lifecycle', async () => {
  const f = fixture();
  assert.equal(f.calls.length, 0);
  await f.engine.start();
  assert.deepEqual(f.calls, [{ video: true, audio: false }]);
  assert.equal(f.audio.stops, 1);
  assert.equal(f.stream.getAudioTracks().length, 0);
  assert.equal(f.engine.getSnapshot().status, 'recording');
  f.recorders[0].chunk('first');
  const done = f.engine.stop();
  assert.equal(f.engine.getSnapshot().status, 'stopping');
  assert.equal(f.engine.stop(), done);
  const file = await done;
  assert.equal(await file.text(), 'firstfinal');
  assert.equal(file.type, 'video/webm');
  assert.match(file.name, /\.webm$/);
  assert.equal(f.engine.getSnapshot().status, 'ready');
  assert.equal(f.recorders[0].stopCalls, 1);
  assert.ok(f.video.stops >= 1);
  assert.equal(f.timers.size, 0);
  await f.engine.start(); // Unsaved file is never implicitly replaced.
  assert.equal(f.calls.length, 1);
  f.engine.discard();
  assert.deepEqual(f.revoked, ['blob:test-1']);
  assert.equal(f.engine.getSnapshot().status, 'idle');
  await f.engine.start(); // fresh stream normally supplied by browser
  f.engine.dispose();
  assert.equal(f.engine.getSnapshot().file, null);
});

test('double start does not open two pickers; cancel and dispose reject late streams', async () => {
  for (const operation of ['stop', 'dispose']) {
    let resolve;
    const f = fixture({}, { getDisplayMedia: () => new Promise(r => { resolve = r; }) });
    const pending = f.engine.start();
    await f.engine.start();
    assert.equal(f.engine.getSnapshot().status, 'requesting');
    f.engine[operation]();
    resolve(f.stream); await pending;
    assert.equal(f.recorders.length, 0);
    assert.equal(f.video.stops, 1);
    assert.equal(f.audio.stops, 1);
    if (operation === 'stop') assert.equal(f.engine.getSnapshot().status, 'idle');
  }
});

test('cancelled old permission response cannot supersede a new request', async () => {
  const pending = [];
  const f = fixture({}, { getDisplayMedia: () => new Promise((resolve, reject) => pending.push({ resolve, reject })) });
  const old = f.engine.start(); await f.engine.stop();
  const fresh = f.engine.start();
  pending[0].reject(new Error('old denial')); await old;
  assert.equal(f.engine.getSnapshot().status, 'requesting');
  pending[1].resolve(f.stream); await fresh;
  assert.equal(f.engine.getSnapshot().status, 'recording');
  f.engine.dispose();
});

test('permission denial and unsupported APIs fail gracefully without throwing', async () => {
  const denied = fixture({}, { getDisplayMedia: async () => { throw Object.assign(new Error('denied'), { name: 'NotAllowedError' }); } });
  await denied.engine.start();
  assert.equal(denied.engine.getSnapshot().status, 'error');
  assert.match(denied.engine.getSnapshot().error, /cancelled or denied/);
  const absent = fixture({}, { supported: () => false });
  await absent.engine.start();
  assert.equal(absent.calls.length, 0);
  assert.equal(absent.engine.getSnapshot().status, 'error');
});

test('capture track ending finalizes once and releases stream', async () => {
  const f = fixture(); await f.engine.start();
  f.video.end(); f.video.end();
  await tick();
  assert.equal(f.recorders[0].stopCalls, 1);
  assert.equal(f.engine.getSnapshot().status, 'ready');
  assert.equal(await f.engine.getSnapshot().file.text(), 'final');
  f.engine.dispose();
  assert.deepEqual(f.revoked, ['blob:test-1']);
});

test('MediaRecorder failures preserve an honestly marked partial file and clean resources', async () => {
  const f = fixture(); await f.engine.start();
  f.recorders[0].chunk('partial');
  f.recorders[0].onerror({ error: new Error('failed') });
  await tick();
  assert.equal(f.engine.getSnapshot().status, 'error');
  assert.match(f.engine.getSnapshot().error, /partial/);
  assert.equal(await f.engine.getSnapshot().file.text(), 'partialfinal');
  assert.ok(f.video.stops > 0);
  f.engine.discard();
  assert.equal(f.engine.getSnapshot().file, null);
});

test('size cap drops overflowing chunks, stops promptly, never labels capture complete', async () => {
  for (const bytes of [4, 5, 100]) {
    const f = fixture({ maxBytes: 5 }); await f.engine.start();
    f.recorders[0].chunk('x'.repeat(bytes));
    if (bytes === 4) f.recorders[0].chunk('overflow');
    await tick();
    const result = f.engine.getSnapshot();
    assert.equal(result.status, 'error');
    assert.match(result.error, /size limit.*partial/i);
    assert.ok((result.file?.size ?? 0) <= 5);
    assert.equal(f.recorders[0].stopCalls, 1);
    assert.ok(f.video.stops > 0);
    f.engine.dispose();
  }
});

test('dispose during recording detaches handlers and stops all tracks without late state updates', async () => {
  const f = fixture(); let updates = 0;
  f.engine.subscribe(() => updates++);
  await f.engine.start(); const previous = updates;
  const recorder = f.recorders[0];
  f.engine.dispose(); await tick();
  assert.equal(updates, previous);
  assert.equal(recorder.ondataavailable, null);
  assert.equal(recorder.onstop, null);
  assert.ok(f.video.stops > 0);
  assert.equal(f.timers.size, 0);
  await f.engine.start(); assert.equal(f.calls.length, 1);
});

test('missing final stop event times out with partial/error and clears timers', async () => {
  const f = fixture(); await f.engine.start();
  f.recorders[0].chunk('partial');
  f.recorders[0].stop = function () { this.state = 'inactive'; };
  const stopped = f.engine.stop();
  [...f.timers][0]();
  assert.equal(await (await stopped).text(), 'partial');
  assert.equal(f.engine.getSnapshot().status, 'error');
  assert.equal(f.timers.size, 0);
});

test('constructor/start failures and ended video release tracks', async () => {
  for (const failure of ['constructor', 'start', 'ended']) {
    class Broken {
      static isTypeSupported() { return true; }
      constructor() { if (failure === 'constructor') throw new Error('constructor failed'); this.state = 'inactive'; }
      start() { throw new Error('start failed'); }
    }
    const f = fixture({}, failure === 'ended' ? {} : { MediaRecorder: Broken });
    if (failure === 'ended') f.video.stop();
    await f.engine.start();
    assert.equal(f.engine.getSnapshot().status, 'error');
    assert.ok(f.video.stops > 0);
    assert.ok(f.audio.stops > 0);
  }
});

test('MP4 keeps actual container extension/type and empty recordings are errors', async () => {
  class Mp4Recorder {
    static isTypeSupported(type) { return type === 'video/mp4'; }
    constructor(stream, { mimeType }) { this.mimeType = mimeType; this.state = 'inactive'; }
    start() { this.state = 'recording'; }
    stop() { this.state = 'inactive'; queueMicrotask(() => { this.ondataavailable?.({ data: new Blob(['movie'], { type: 'video/mp4' }) }); this.onstop?.(); }); }
  }
  const f = fixture({}, { MediaRecorder: Mp4Recorder });
  await f.engine.start(); const file = await f.engine.stop();
  assert.equal(file.type, 'video/mp4'); assert.match(file.name, /\.mp4$/);
  f.engine.dispose();
  const empty = fixture(); await empty.engine.start();
  empty.recorders[0].stop = function () { this.state = 'inactive'; queueMicrotask(() => this.onstop?.()); };
  await empty.engine.stop();
  assert.equal(empty.engine.getSnapshot().status, 'error');
  assert.equal(empty.engine.getSnapshot().file, null);
});

test('default dependency path contains no microphone/camera capture calls', async () => {
  let calls = 0;
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaDevices: {
    getUserMedia() { throw new Error('Forbidden microphone/camera API'); },
    getDisplayMedia(constraints) { calls++; assert.deepEqual(constraints, { video: true, audio: false }); return Promise.reject(new Error('cancelled')); },
  } } });
  try {
    const f = fixture({}, { getDisplayMedia: undefined });
    // Use real default getDisplayMedia while injecting only recorder availability.
    const engine = createScreenRecorder({}, { supported: () => true, MediaRecorder: f.env.MediaRecorder });
    await engine.start(); assert.equal(calls, 1);
    assert.equal(engine.getSnapshot().status, 'error'); engine.dispose();
  } finally {
    if (previous) Object.defineProperty(globalThis, 'navigator', previous); else delete globalThis.navigator;
  }
});
