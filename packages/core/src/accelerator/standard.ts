import type { Accelerator } from './types';
import { formatAccelerator } from './format';

/** Machine-readable standard HIG shortcuts. */
export const STANDARD_ACCELERATORS = {
  new: { mod: true, key: 'n' },
  open: { mod: true, key: 'o' },
  close: { mod: true, key: 'w' },
  save: { mod: true, key: 's' },
  saveAll: { mod: true, shift: true, key: 's' },
  undo: { mod: true, key: 'z' },
  redo: { mod: true, shift: true, key: 'z' },
  cut: { mod: true, key: 'x' },
  copy: { mod: true, key: 'c' },
  paste: { mod: true, key: 'v' },
  selectAll: { mod: true, key: 'a' },
  find: { mod: true, key: 'f' },
  settings: { mod: true, key: ',' },
  quit: { mod: true, key: 'q' },
  minimize: { mod: true, key: 'm' },
  help: { mod: true, shift: true, key: '?' },
  commandPalette: { mod: true, key: 'k' },
} as const satisfies Record<string, Accelerator>;

export type StandardAcceleratorId = keyof typeof STANDARD_ACCELERATORS;

/**
 * Legacy display-only shortcut strings derived from {@link STANDARD_ACCELERATORS}.
 * Preserved for backward compatibility with existing consumers.
 */
export const STANDARD_SHORTCUTS: Record<StandardAcceleratorId, string> = Object.fromEntries(
  Object.entries(STANDARD_ACCELERATORS).map(([id, acc]) => [
    id,
    formatAccelerator(acc, { platform: 'macos', style: 'symbols' }),
  ]),
) as Record<StandardAcceleratorId, string>;
