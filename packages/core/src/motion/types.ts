/** Physics parameters for spring simulation (mass-normalized). */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

export type SpringPresetName =
  | 'snappy'
  | 'smooth'
  | 'gentle'
  | 'responsive'
  | 'bouncy';

export interface SpringState {
  value: number;
  velocity: number;
}

export type ReducedMotionPolicy = 'system' | 'always' | 'never';

export type MotionSemanticPreset = SpringPresetName | 'none';
