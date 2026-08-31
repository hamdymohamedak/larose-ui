/**
 * Platform identifiers for accelerator formatting and matching.
 */
export type AcceleratorPlatform = 'macos' | 'windows' | 'linux';

/**
 * Machine-readable keyboard accelerator definition.
 *
 * Use `mod` for the primary platform modifier (⌘ on macOS, Ctrl on Windows/Linux).
 * Explicit `meta` / `ctrl` flags override or combine with `mod` when needed.
 */
export interface Accelerator {
  /** Primary platform modifier — Meta on macOS, Control on Windows/Linux. */
  mod?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
  /** Key identifier: lowercase letter, digit, or named special key. */
  key: string;
}

export interface AcceleratorFormatOptions {
  platform?: AcceleratorPlatform;
  /** macOS presentation style. Defaults to `'symbols'`. */
  style?: 'symbols' | 'text';
}

export interface AcceleratorMatchOptions {
  platform?: AcceleratorPlatform;
}

export interface AcceleratorConflict {
  accelerator: Accelerator;
  ids: string[];
}

export type AcceleratorScope = 'menu' | 'component' | 'global';

export interface RegisteredAccelerator {
  id: string;
  accelerator: Accelerator;
  scope: AcceleratorScope;
  priority: number;
  /** When true, fires even when focus is inside editable elements. */
  allowInEditable?: boolean;
  enabled?: () => boolean;
}
