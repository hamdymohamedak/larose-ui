import type { ReducedMotionPolicy } from './types';

export function resolveReducedMotion(
  policy: ReducedMotionPolicy,
  systemPrefersReduced: boolean,
): boolean {
  switch (policy) {
    case 'always':
      return true;
    case 'never':
      return false;
    case 'system':
    default:
      return systemPrefersReduced;
  }
}

/** Scale motion duration to zero when reduced motion is active. */
export function motionDuration(
  durationMs: number,
  reducedMotion: boolean,
): number {
  return reducedMotion ? 0 : durationMs;
}
