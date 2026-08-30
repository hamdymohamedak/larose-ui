import { useCallback, useEffect, useRef, useState } from 'react';
import type { PresencePhase } from './types';
import { useSkipMotion } from './MotionContext';

export interface UsePresenceOptions {
  present: boolean;
  onExitComplete?: () => void;
}

export interface UsePresenceResult {
  phase: PresencePhase;
  shouldRender: boolean;
  onAnimationEnd: (event: React.AnimationEvent) => void;
}

/**
 * Manages mount/unmount lifecycle with enter and exit animation phases.
 * When motion is disabled, transitions are instant but still sequenced correctly.
 */
export function usePresence({
  present,
  onExitComplete,
}: UsePresenceOptions): UsePresenceResult {
  const skipMotion = useSkipMotion();
  const [phase, setPhase] = useState<PresencePhase>(present ? 'entering' : 'exited');
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  useEffect(() => {
    if (present) {
      setPhase((current) => (current === 'exited' || current === 'exiting' ? 'entering' : current));
      if (skipMotion) {
        setPhase('entered');
      }
    } else {
      setPhase((current) =>
        current === 'exited' ? 'exited' : 'exiting',
      );
      if (skipMotion) {
        setPhase('exited');
        onExitCompleteRef.current?.();
      }
    }
  }, [present, skipMotion]);

  const onAnimationEnd = useCallback(
    (event: React.AnimationEvent) => {
      if (event.target !== event.currentTarget) return;

      setPhase((current) => {
        if (current === 'entering') return 'entered';
        if (current === 'exiting') {
          queueMicrotask(() => onExitCompleteRef.current?.());
          return 'exited';
        }
        return current;
      });
    },
    [],
  );

  const shouldRender = phase !== 'exited';

  return { phase, shouldRender, onAnimationEnd };
}
