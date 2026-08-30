export type {
  SpringConfig,
  SpringPresetName,
  SpringState,
  ReducedMotionPolicy,
  MotionSemanticPreset,
} from './types';

export {
  SPRING_PRESETS,
  getSpringPreset,
  stepSpring,
  isSpringSettled,
  animateSpringToTarget,
  springResponseTime,
} from './springs';

export { resolveReducedMotion, motionDuration } from './reduced';
