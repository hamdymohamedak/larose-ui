import type { PresenceControllerOptions, PresencePhase, PresenceSnapshot } from './types';

export interface PresenceController {
  getSnapshot(): PresenceSnapshot;
  setPresent(present: boolean, options?: PresenceControllerOptions): void;
  /** Call when the animated element's animationend fires (target === currentTarget). */
  handleAnimationEnd(): PresenceSnapshot;
  subscribe(listener: () => void): () => void;
  dispose(): void;
}

function initialPhase(present: boolean, skipMotion: boolean): PresencePhase {
  if (!present) return 'exited';
  return skipMotion ? 'entered' : 'mounting';
}

/**
 * Framework-neutral presence state machine for enter/exit CSS animations.
 * Adapters schedule RAF / microtasks according to their lifecycle; this owns phases only.
 *
 * `getSnapshot()` returns a cached object reference until phase/shouldRender change —
 * required for React `useSyncExternalStore`.
 */
export function createPresenceController(
  initialPresent = false,
  initialOptions: PresenceControllerOptions = {},
): PresenceController {
  let phase: PresencePhase = initialPhase(initialPresent, Boolean(initialOptions.skipMotion));
  let present = initialPresent;
  let skipMotion = Boolean(initialOptions.skipMotion);
  let onExitComplete = initialOptions.onExitComplete;
  let enterRaf1: number | null = null;
  let enterRaf2: number | null = null;
  const listeners = new Set<() => void>();

  let cachedSnapshot: PresenceSnapshot = {
    phase,
    shouldRender: present || phase !== 'exited',
  };

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const commitSnapshot = () => {
    const shouldRender = present || phase !== 'exited';
    if (cachedSnapshot.phase === phase && cachedSnapshot.shouldRender === shouldRender) {
      return false;
    }
    cachedSnapshot = { phase, shouldRender };
    notify();
    return true;
  };

  const cancelEnterFrames = () => {
    if (enterRaf1 !== null) {
      cancelAnimationFrame(enterRaf1);
      enterRaf1 = null;
    }
    if (enterRaf2 !== null) {
      cancelAnimationFrame(enterRaf2);
      enterRaf2 = null;
    }
  };

  const setPhase = (next: PresencePhase) => {
    if (phase === next) {
      commitSnapshot();
      return;
    }
    phase = next;
    commitSnapshot();
  };

  const scheduleEnter = () => {
    cancelEnterFrames();
    if (typeof requestAnimationFrame !== 'function') {
      setPhase('entering');
      return;
    }
    enterRaf1 = requestAnimationFrame(() => {
      enterRaf1 = null;
      enterRaf2 = requestAnimationFrame(() => {
        enterRaf2 = null;
        setPhase('entering');
      });
    });
  };

  return {
    getSnapshot: () => cachedSnapshot,
    setPresent(nextPresent, options = {}) {
      if (options.skipMotion !== undefined) skipMotion = options.skipMotion;
      if (options.onExitComplete !== undefined) onExitComplete = options.onExitComplete;
      present = nextPresent;
      cancelEnterFrames();

      if (nextPresent) {
        if (skipMotion) {
          setPhase('entered');
          return;
        }
        if (phase === 'entered' || phase === 'entering') {
          commitSnapshot();
          return;
        }
        setPhase('mounting');
        scheduleEnter();
        return;
      }

      if (phase === 'exited') {
        commitSnapshot();
        return;
      }
      if (skipMotion) {
        setPhase('exited');
        queueMicrotask(() => onExitComplete?.());
        return;
      }
      setPhase('exiting');
    },
    handleAnimationEnd() {
      if (phase === 'entering') {
        setPhase('entered');
      } else if (phase === 'exiting') {
        setPhase('exited');
        queueMicrotask(() => onExitComplete?.());
      }
      return cachedSnapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose() {
      cancelEnterFrames();
      listeners.clear();
    },
  };
}

/** CSS module key for shared motion.module.css presence classes. */
export function presenceMotionClassKey(
  kind: 'modal' | 'backdrop' | 'drawer-left' | 'drawer-right' | 'popover' | 'toast',
  phase: PresencePhase,
): string | undefined {
  if (phase === 'entering' || phase === 'exiting') {
    return `${kind}-${phase}`;
  }
  return undefined;
}

export function shouldRenderPresence(present: boolean, phase: PresencePhase): boolean {
  return present || phase !== 'exited';
}
