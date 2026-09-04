import { STANDARD_ACCELERATORS } from '@larose-ui/core';
import { useAccelerator } from '../../composables/useAccelerator';

export function useCommandPaletteShortcut(onOpen: () => void, enabled = true) {
  useAccelerator(STANDARD_ACCELERATORS.commandPalette, onOpen, {
    allowInEditable: true,
    enabled,
    id: 'larose-command-palette',
  });
}
