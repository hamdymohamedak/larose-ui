import { MAX_ORNAMENTS } from '@larose-ui/tokens';
import type { OrnamentConfig, OrnamentEdge, OrnamentVisibility } from './types';

export { MAX_ORNAMENTS };

export function resolveOrnamentVisibility(
  visibility: OrnamentVisibility,
  immersive: boolean,
): boolean {
  if (visibility === 'hidden') return false;
  if (visibility === 'visible') return true;
  return !immersive;
}

export function clampOrnamentWidth(windowWidth: number, ornamentWidth: number): number {
  return Math.min(ornamentWidth, windowWidth);
}

export function warnIfTooManyOrnaments(ornaments: OrnamentConfig[]): void {
  if (ornaments.length > MAX_ORNAMENTS) {
    console.warn(
      `Ornaments work best with about ${MAX_ORNAMENTS} per window; found ${ornaments.length}. Consider relocating controls into the window.`,
    );
  }
}

export function ornamentsForEdge(
  ornaments: OrnamentConfig[],
  edge: OrnamentEdge,
): OrnamentConfig[] {
  return ornaments.filter((ornament) => (ornament.edge ?? 'bottom') === edge);
}

export function alignmentToFlex(
  alignment: OrnamentConfig['alignment'],
): 'flex-start' | 'center' | 'flex-end' {
  switch (alignment) {
    case 'leading':
      return 'flex-start';
    case 'trailing':
      return 'flex-end';
    default:
      return 'center';
  }
}
