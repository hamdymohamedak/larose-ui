import { STANDARD_ACCELERATORS } from '@larose-ui/core';
import { registerAccelerator } from '../../accelerator/context';

/** Register ⌘K / Ctrl+K to open the command palette. */
export function useCommandPaletteShortcut(onOpen: () => void, enabled = true): () => void {
  return registerAccelerator(STANDARD_ACCELERATORS.commandPalette, onOpen, {
    allowInEditable: true,
    enabled,
    id: 'larose-command-palette',
  });
}
