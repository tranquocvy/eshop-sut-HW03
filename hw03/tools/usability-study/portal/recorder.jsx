import { useCallback, useEffect, useRef, useState } from 'react';
import { createScreenRecorder, initialRecorderState } from './recorder-engine.mjs';

// Mount once at Participant's top level, outside phase conditionals.
// start() must be called directly from an explicit user click.
export function useScreenRecorder({ maxBytes } = {}) {
  const engine = useRef(null);
  const [snapshot, setSnapshot] = useState(initialRecorderState);
  useEffect(() => {
    const current = createScreenRecorder({ maxBytes });
    engine.current = current;
    setSnapshot(current.getSnapshot());
    const unsubscribe = current.subscribe(setSnapshot);
    return () => {
      engine.current = null;
      unsubscribe();
      current.dispose();
    };
  }, [maxBytes]);
  const start = useCallback(() => engine.current?.start() ?? Promise.resolve(), []);
  const stop = useCallback(() => engine.current?.stop() ?? Promise.resolve(null), []);
  const discard = useCallback(() => engine.current?.discard(), []);
  return { ...snapshot, start, stop, discard };
}
