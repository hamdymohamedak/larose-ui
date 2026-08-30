import type { ThemeMode } from '@larose-ui/core';

/** Semantic motion presets — Apple-inspired, calm and restrained. */
export type MotionPresetName = 'snappy' | 'smooth' | 'gentle' | 'responsive' | 'bouncy';

export interface MotionTokens {
  /** Micro-interactions (button press, toggle). */
  durationInstant: string;
  /** Hover, focus, small state changes. */
  durationFast: string;
  /** Default component transitions. */
  durationNormal: string;
  /** Modals, drawers, major surfaces. */
  durationSlow: string;
  /** Toast enter, popover appear. */
  durationEnter: string;
  /** Toast exit, overlay dismiss. */
  durationExit: string;
  /** Stack reorder, layout shifts. */
  durationLayout: string;

  easingStandard: string;
  easingEnter: string;
  easingExit: string;
  easingEmphasized: string;

  springSnappy: string;
  springSmooth: string;
  springGentle: string;
  springResponsive: string;
  springBouncy: string;

  distanceXs: string;
  distanceSm: string;
  distanceMd: string;

  scaleEnter: string;
  scaleExit: string;
  scalePress: string;
  scaleModalEnter: string;
}

const motionBase: MotionTokens = {
  durationInstant: '50ms',
  durationFast: '120ms',
  durationNormal: '220ms',
  durationSlow: '320ms',
  durationEnter: '280ms',
  durationExit: '200ms',
  durationLayout: '250ms',

  easingStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingEnter: 'cubic-bezier(0, 0, 0.2, 1)',
  easingExit: 'cubic-bezier(0.4, 0, 1, 1)',
  easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',

  // Cubic-bezier approximations of spring curves (compositor-friendly).
  springSnappy: 'cubic-bezier(0.34, 1.15, 0.64, 1)',
  springSmooth: 'cubic-bezier(0.25, 0.9, 0.35, 1)',
  springGentle: 'cubic-bezier(0.22, 0.9, 0.36, 1)',
  springResponsive: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
  springBouncy: 'cubic-bezier(0.34, 1.45, 0.64, 1)',

  distanceXs: '4px',
  distanceSm: '8px',
  distanceMd: '16px',

  scaleEnter: '0.96',
  scaleExit: '0.96',
  scalePress: '0.97',
  scaleModalEnter: '0.98',
};

export function getMotionTokens(_mode: ThemeMode = 'light'): MotionTokens {
  return { ...motionBase };
}

export function motionTokensToCSSVariables(tokens: MotionTokens): Record<string, string> {
  return {
    '--lr-motion-duration-instant': tokens.durationInstant,
    '--lr-motion-duration-fast': tokens.durationFast,
    '--lr-motion-duration-normal': tokens.durationNormal,
    '--lr-motion-duration-slow': tokens.durationSlow,
    '--lr-motion-duration-enter': tokens.durationEnter,
    '--lr-motion-duration-exit': tokens.durationExit,
    '--lr-motion-duration-layout': tokens.durationLayout,

    '--lr-motion-easing-standard': tokens.easingStandard,
    '--lr-motion-easing-enter': tokens.easingEnter,
    '--lr-motion-easing-exit': tokens.easingExit,
    '--lr-motion-easing-emphasized': tokens.easingEmphasized,

    '--lr-motion-spring-snappy': tokens.springSnappy,
    '--lr-motion-spring-smooth': tokens.springSmooth,
    '--lr-motion-spring-gentle': tokens.springGentle,
    '--lr-motion-spring-responsive': tokens.springResponsive,
    '--lr-motion-spring-bouncy': tokens.springBouncy,

    '--lr-motion-distance-xs': tokens.distanceXs,
    '--lr-motion-distance-sm': tokens.distanceSm,
    '--lr-motion-distance-md': tokens.distanceMd,

    '--lr-motion-scale-enter': tokens.scaleEnter,
    '--lr-motion-scale-exit': tokens.scaleExit,
    '--lr-motion-scale-press': tokens.scalePress,
    '--lr-motion-scale-modal-enter': tokens.scaleModalEnter,
  };
}

export const MOTION_PRESET_EASING: Record<MotionPresetName, keyof MotionTokens> = {
  snappy: 'springSnappy',
  smooth: 'springSmooth',
  gentle: 'springGentle',
  responsive: 'springResponsive',
  bouncy: 'springBouncy',
};
