import type { Accelerator } from '@larose-ui/react';

/**
 * Browser-safe accelerators for Storybook demos.
 * Avoids chords commonly reserved by browsers (⌘N, ⌘T, ⌘W, ⌘O, ⌘F, ⌘P, etc.)
 * by using Shift/Alt variants.
 */
export const DEMO_ACCELERATORS = {
  newDocument: { mod: true, shift: true, key: 'n' },
  open: { mod: true, shift: true, key: 'o' },
  share: { mod: true, alt: true, key: 's' },
  save: { mod: true, alt: true, key: 's' },
  saveAs: { mod: true, shift: true, key: 's' },
  find: { mod: true, shift: true, key: 'f' },
  cut: { mod: true, shift: true, key: 'x' },
  copy: { mod: true, shift: true, key: 'c' },
  paste: { mod: true, shift: true, key: 'v' },
  exportPdf: { mod: true, shift: true, key: 'p' },
  plainText: { mod: true, alt: true, key: '\\' },
  back: { mod: true, alt: true, key: '[' },
  forward: { mod: true, alt: true, key: ']' },
  addBookmark: { mod: true, shift: true, key: 'd' },
  customPanel: { mod: true, alt: true, key: 'p' },
  undo: { mod: true, alt: true, key: 'z' },
} as const satisfies Record<string, Accelerator>;
