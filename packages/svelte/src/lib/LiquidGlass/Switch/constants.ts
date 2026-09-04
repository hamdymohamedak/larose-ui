export const LIQUID_GLASS_SWITCH_ACTIVE_GREEN = 'rgba(52, 199, 89, 0.45)';
export const LIQUID_GLASS_SWITCH_TRACK_GLASS = 'glass' as const;
export type LiquidGlassSwitchActiveTrackTint =
  | string
  | typeof LIQUID_GLASS_SWITCH_TRACK_GLASS;
