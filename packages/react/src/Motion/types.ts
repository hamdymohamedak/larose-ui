import type { ReducedMotionPolicy, MotionSemanticPreset } from '@larose-ui/core';

export type PresencePhase = 'entering' | 'entered' | 'exiting' | 'exited';

export type MotionVariant =
  | 'fade'
  | 'fade-scale'
  | 'fade-slide-up'
  | 'fade-slide-down'
  | 'fade-slide-left'
  | 'fade-slide-right'
  | 'modal'
  | 'backdrop'
  | 'toast'
  | 'popover'
  | 'drawer-left'
  | 'drawer-right';

export interface MotionConfig {
  /** Global motion preset. `none` disables animations. */
  preset?: MotionSemanticPreset;
  /** How to respect system reduced-motion. */
  reducedMotion?: ReducedMotionPolicy;
}

export const defaultMotionConfig: MotionConfig = {
  preset: 'smooth',
  reducedMotion: 'system',
};
