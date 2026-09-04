export { collectMenuAccelerators } from './collectMenuAccelerators';
export type { MenuAcceleratorBinding } from './collectMenuAccelerators';
export { collectGlobalMenuAccelerators } from './collectGlobalMenuAccelerators';
export { collectTypeAheadItems } from './collectTypeAheadItems';
export {
  collectMenuMnemonicBindings,
  collectMenuBarMnemonicBindings,
  stripMnemonicMarker,
} from './mnemonic';
export type { MenuMnemonicBinding, MenuBarMnemonicBinding } from './mnemonic';
export {
  createInitialTypeAheadState,
  stepTypeAhead,
  findTypeAheadMatches,
  TYPE_AHEAD_RESET_MS,
} from './typeAhead';
export type { TypeAheadState, TypeAheadStepResult } from './typeAhead';
export { resolveAcceleratorPlatform, resolveMenuShortcut } from './resolveMenuShortcut';
export type { ResolvedMenuShortcut, ResolveMenuShortcutOptions } from './resolveMenuShortcut';

export {
  useAccelerator,
  useAcceleratorContext,
  acceleratorKey,
  useMenuBarAccelerators,
  useMenuAcceleratorRegistration,
  useMenuKeyboardShortcuts,
  useCombinedMenuKeyboard,
} from '../composables/useAccelerator';
export type {
  AcceleratorContextValue,
  AcceleratorRegistrationOptions,
} from '../composables/useAccelerator';
