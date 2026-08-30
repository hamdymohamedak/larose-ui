export { MotionProvider, useMotion, useMotionEnabled, useSkipMotion } from './MotionContext';
export type { MotionProviderProps, MotionConfig } from './MotionContext';

export { Presence } from './Presence';
export type { PresenceProps } from './Presence';

export { usePresence } from './usePresence';
export type { UsePresenceOptions, UsePresenceResult } from './usePresence';

export { Collapse, useSpringAnimation } from './Collapse';
export type { CollapseProps, UseSpringAnimationOptions } from './Collapse';

export {
  OverlayBackdrop,
  AnimatedOverlaySurface,
  OverlayPortal,
  ContextualMenuPortal,
} from './OverlayPortal';
export type {
  OverlayBackdropProps,
  AnimatedOverlaySurfaceProps,
  OverlayPortalProps,
  ContextualMenuPortalProps,
  OverlayPlacement,
} from './OverlayPortal';

export type {
  PresencePhase,
  MotionVariant,
  MotionConfig as MotionSettings,
} from './types';
