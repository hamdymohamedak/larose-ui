import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import {
  createPresenceController,
  type PresencePhase,
} from '@larose-ui/component-logic/overlay';
import { useSkipMotion } from './MotionContext';

/**
 * Shared presence wiring for overlays. Snapshot identity is stable until phase changes
 * (see createPresenceController) so useSyncExternalStore does not loop.
 */
export function useSharedPresence(present: boolean) {
  const skipMotion = useSkipMotion();
  const controllerRef = useRef<ReturnType<typeof createPresenceController> | null>(null);
  if (controllerRef.current === null) {
    controllerRef.current = createPresenceController(present, { skipMotion });
  }
  const controller = controllerRef.current;

  useLayoutEffect(() => {
    controller.setPresent(present, { skipMotion });
  }, [controller, present, skipMotion]);

  useEffect(() => () => controller.dispose(), [controller]);

  const snapshot = useSyncExternalStore(
    (onStoreChange) => controller.subscribe(onStoreChange),
    () => controller.getSnapshot(),
    () => controller.getSnapshot(),
  );

  const onAnimationEnd = useCallback(
    (event: React.AnimationEvent) => {
      if (event.target !== event.currentTarget) return;
      controller.handleAnimationEnd();
    },
    [controller],
  );

  return {
    phase: snapshot.phase as PresencePhase,
    shouldRender: snapshot.shouldRender,
    onAnimationEnd,
  };
}
