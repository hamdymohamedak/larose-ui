import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import {
  createPresenceController,
  type PresencePhase,
} from '@larose-ui/component-logic/overlay';
import { useSkipMotion } from '../Motion/MotionContext';

export function useSharedPresence(present: boolean) {
  const skipMotion = useSkipMotion();
  const controllerRef = useRef(createPresenceController(present, { skipMotion }));

  useLayoutEffect(() => {
    controllerRef.current.setPresent(present, { skipMotion });
  }, [present, skipMotion]);

  useEffect(() => () => controllerRef.current.dispose(), []);

  const snapshot = useSyncExternalStore(
    (onStoreChange) => controllerRef.current.subscribe(onStoreChange),
    () => controllerRef.current.getSnapshot(),
    () => controllerRef.current.getSnapshot(),
  );

  const onAnimationEnd = useCallback((event: React.AnimationEvent) => {
    if (event.target !== event.currentTarget) return;
    controllerRef.current.handleAnimationEnd();
  }, []);

  return {
    phase: snapshot.phase as PresencePhase,
    shouldRender: snapshot.shouldRender,
    onAnimationEnd,
  };
}
