// Screen-only, memory-only capture. All browser dependencies are injectable for tests.
export const DEFAULT_MAX_BYTES = 128 * 1024 * 1024;
export const initialRecorderState = () => ({ status: 'idle', file: null, url: null, error: null });
export function createScreenRecorder(options = {}, dependencies = {}) {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new TypeError('maxBytes must be a positive safe integer.');
  const env = {
    getDisplayMedia: constraints => globalThis.navigator?.mediaDevices?.getDisplayMedia?.(constraints),
    supported: () => !!globalThis.navigator?.mediaDevices?.getDisplayMedia && !!globalThis.MediaRecorder,
    MediaRecorder: globalThis.MediaRecorder, File: globalThis.File,
    createURL: file => URL.createObjectURL(file), revokeURL: url => URL.revokeObjectURL(url),
    setTimer: (fn, ms) => setTimeout(fn, ms), clearTimer: timer => clearTimeout(timer),
    ...dependencies,
  };
  let state = initialRecorderState(), disposed = false, generation = 0, active = null;
  const listeners = new Set();
  const emit = patch => {
    if (disposed) return;
    state = { ...state, ...patch };
    for (const listener of listeners) listener(state);
  };
  const revoke = () => { if (state.url) env.revokeURL(state.url); };
  const stopTracks = stream => { for (const track of stream?.getTracks?.() ?? []) { try { track.stop(); } catch {} } };
  const clearResources = session => {
    if (session.timer != null) env.clearTimer(session.timer);
    for (const [track, callback] of session.ends) track.removeEventListener('ended', callback);
    stopTracks(session.stream);
  };
  const finish = session => {
    if (session.finished) return;
    session.finished = true;
    clearResources(session);
    const recorder = session.recorder;
    recorder.ondataavailable = recorder.onerror = recorder.onstop = null;
    if (active !== session || disposed) { session.chunks.length = 0; session.resolve?.(null); return; }
    active = null;
    let file = null, url = null, error = session.error;
    try {
      if (session.bytes) {
        // Actual recorder/chunk MIME, not the requested codec, determines download type.
        const type = session.chunks.find(chunk => chunk.type)?.type || recorder.mimeType;
        if (!/^(video\/webm|video\/mp4)(;|$)/i.test(type || '')) throw new Error('Browser returned an unsupported recording format.');
        file = new env.File(session.chunks, 'screen-recording.' + (/^video\/mp4/i.test(type) ? 'mp4' : 'webm'), { type });
        url = env.createURL(file);
      } else if (!error) error = 'No video data was captured. Please try again.';
    } catch (err) { error = err.message || 'Could not prepare the recording.'; file = null; }
    session.chunks.length = 0;
    emit({ status: error ? 'error' : 'ready', file, url, error });
    session.resolve?.(file);
  };
  function stop() {
    if (disposed) return Promise.resolve(null);
    if (state.status === 'requesting') {
      generation++; emit({ status: 'idle', error: null });
      return Promise.resolve(null); // Browser picker cannot be closed by script; late streams are rejected.
    }
    const session = active;
    if (!session) return Promise.resolve(state.file);
    if (session.stopping) return session.done;
    session.stopping = true;
    emit({ status: 'stopping' });
    // Keep data handlers attached until onstop: the final dataavailable precedes it.
    session.timer = env.setTimer(() => {
      session.error ||= 'Recording did not finish normally. Any available file is partial; check playback.';
      finish(session);
    }, 10000);
    try { if (session.recorder.state !== 'inactive') session.recorder.stop(); }
    catch (err) { session.error ||= 'Recording could not stop normally. Any available file is partial; check playback.'; finish(session); }
    stopTracks(session.stream);
    return session.done;
  }
  async function start() {
    if (disposed || active || state.status === 'requesting') return;
    // Do not silently replace an unsent recording. Caller must explicitly discard first.
    if (state.file) return;
    if (!env.supported()) { emit({ status: 'error', error: 'Screen recording is unavailable. Use a supported browser in a secure context.' }); return; }
    const ticket = ++generation;
    emit({ status: 'requesting', error: null });
    let stream;
    try {
      // Never call getUserMedia, never request microphone, camera, or system audio.
      stream = await env.getDisplayMedia({ video: true, audio: false });
      if (disposed || generation !== ticket) { stopTracks(stream); return; }
      if (!stream) throw new Error('Screen sharing is unavailable.');
      // Defensive removal: even a nonconforming browser must never feed audio to MediaRecorder.
      for (const track of stream.getAudioTracks()) {
        track.stop(); stream.removeTrack(track);
      }
      if (!stream.getVideoTracks().some(track => track.readyState !== 'ended')) throw new Error('No live screen video track was selected.');
      const formats = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
      const mimeType = formats.find(type => env.MediaRecorder.isTypeSupported?.(type));
      const recorder = mimeType ? new env.MediaRecorder(stream, { mimeType }) : new env.MediaRecorder(stream);
      const session = { stream, recorder, chunks: [], bytes: 0, ends: [], stopping: false, finished: false, error: null };
      session.done = new Promise(resolve => { session.resolve = resolve; });
      active = session;
      recorder.ondataavailable = event => {
        if (disposed || session.finished || !event.data?.size) return;
        if (event.data.size > maxBytes - session.bytes) {
          session.error ||= 'Recording size limit reached. Any available file is partial and may not play; do not treat it as a complete recording.';
          void stop(); return;
        }
        session.chunks.push(event.data); session.bytes += event.data.size;
        if (session.bytes >= maxBytes) {
          session.error ||= 'Recording size limit reached. Any available file is partial; check playback.';
          void stop();
        }
      };
      recorder.onerror = () => {
        session.error ||= 'The browser could not continue recording. Any available file is partial; check playback.';
        void stop();
      };
      recorder.onstop = () => finish(session);
      for (const track of stream.getVideoTracks()) {
        const onEnd = () => { void stop(); };
        track.addEventListener('ended', onEnd); session.ends.push([track, onEnd]);
      }
      recorder.start(1000);
      emit({ status: 'recording' });
    } catch (err) {
      stopTracks(stream);
      if (active && active.stream === stream) {
        const failed = active; active = null;
        clearResources(failed);
        failed.recorder.ondataavailable = failed.recorder.onerror = failed.recorder.onstop = null;
        failed.resolve(null);
      }
      if (!disposed && generation === ticket) emit({ status: 'error', error: err?.name === 'NotAllowedError' ? 'Screen sharing was cancelled or denied. You can try again.' : (err?.message || 'Could not start screen recording.') });
    }
  }
  function discard() {
    if (disposed) return;
    if (active || state.status === 'requesting') return; // Stop and await finalization before deleting.
    generation++; revoke(); emit(initialRecorderState());
  }
  function dispose() {
    if (disposed) return;
    generation++; disposed = true; listeners.clear(); revoke();
    if (active) {
      const session = active; active = null;
      session.finished = true;
      session.recorder.ondataavailable = session.recorder.onerror = session.recorder.onstop = null;
      try { if (session.recorder.state !== 'inactive') session.recorder.stop(); } catch {}
      clearResources(session); session.chunks.length = 0; session.resolve(null);
    }
  }
  return { start, stop, discard, dispose, getSnapshot: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); } };
}
