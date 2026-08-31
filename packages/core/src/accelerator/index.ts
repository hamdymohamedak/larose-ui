export type {
  Accelerator,
  AcceleratorConflict,
  AcceleratorFormatOptions,
  AcceleratorMatchOptions,
  AcceleratorPlatform,
  AcceleratorScope,
  RegisteredAccelerator,
} from './types';

export { SPECIAL_KEYS, looksLikeShortcutLabel, normalizeEventKey, normalizeKey } from './keys';
export { acceleratorToId, isValidAccelerator, normalizeAccelerator } from './normalize';
export { parseAccelerator } from './parse';
export {
  detectPlatform,
  isModPressed,
  matchKeyboardEvent,
  resolveModRequirement,
} from './match';
export { formatAccelerator, formatAriaKeyshortcuts } from './format';
export { isEditableTarget, shouldHandleShortcut } from './input';
export type { ShouldHandleShortcutOptions } from './input';
export {
  AcceleratorRegistry,
  acceleratorsEqual,
  createAcceleratorRegistry,
} from './registry';
export type { AcceleratorHandler, HandleAcceleratorEventOptions } from './registry';
export {
  parseMnemonicLabel,
  resolveMnemonicKey,
  stripMnemonicMarker,
  matchesMnemonicKey,
  isAltMnemonicEvent,
  matchTypeAheadPrefix,
} from './mnemonic';
export type { ParsedMnemonic } from './mnemonic';
export { STANDARD_ACCELERATORS, STANDARD_SHORTCUTS } from './standard';
export type { StandardAcceleratorId } from './standard';
