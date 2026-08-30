import { useCallback, useLayoutEffect, useRef, useState } from 'react';
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

function initialPhase(present: boolean, skipMotion: boolean): PresencePhase {
  if (!present) return 'exited';
  return skipMotion ? 'entered' : 'mounting';
}

/**
 * Manages mount/unmount lifecycle with enter and exit animation phases.
 * Uses a mounting frame so CSS keyframe animations can run from their `from` state.
 */
export function usePresence({
  present,
  onExitComplete,
}: UsePresenceOptions): UsePresenceResult {
  const skipMotion = useSkipMotion();
  const [phase, setPhase] = useState<PresencePhase>(() => initialPhase(present, skipMotion));
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;
  const enterFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (enterFrameRef.current !== null) {
      cancelAnimationFrame(enterFrameRef.current);
      enterFrameRef.current = null;
    }

    if (present) {
      if (skipMotion) {
        setPhase('entered');
        return;
      }

      setPhase((current) => {
        if (current === 'entered' || current === 'entering') return current;
        return 'mounting';
      });

      enterFrameRef.current = requestAnimationFrame(() => {
        enterFrameRef.current = requestAnimationFrame(() => {
          enterFrameRef.current = null;
          setPhase('entering');
        });
      });

      return () => {
        if (enterFrameRef.current !== null) {
          cancelAnimationFrame(enterFrameRef.current);
          enterFrameRef.current = null;
        }
      };
    }

    setPhase((current) => {
      if (current === 'exited') return 'exited';
      if (skipMotion) {
        queueMicrotask(() => onExitCompleteRef.current?.());
        return 'exited';
      }
      return 'exiting';
    });
  }, [present, skipMotion]);

  const onAnimationEnd = useCallback((event: React.AnimationEvent) => {
    if (event.target !== event.currentTarget) return;

    setPhase((current) => {
      if (current === 'entering') return 'entered';
      if (current === 'exiting') {
        queueMicrotask(() => onExitCompleteRef.current?.());
        return 'exited';
      }
      return current;
    });
  }, []);

  // Keep mounted while `present` is true even if phase is still `exited` from a prior close,
  // and stay mounted through exit until the exit animation finishes.
  const shouldRender = present || phase !== 'exited';

  return { phase, shouldRender, onAnimationEnd };
}
