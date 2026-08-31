import type { Accelerator, AcceleratorFormatOptions, AcceleratorPlatform } from '@larose-ui/core';
import {
  formatAccelerator,
  formatAriaKeyshortcuts,
  looksLikeShortcutLabel,
  parseAccelerator,
} from '@larose-ui/core';
import type { MenuItemConfig } from '../Menu/types';

export interface ResolvedMenuShortcut {
  /** Text shown in the menu row. */
  display: string | undefined;
  /** Machine-readable accelerator used for matching, if any. */
  accelerator: Accelerator | undefined;
  /** W3C aria-keyshortcuts value, if an accelerator exists. */
  ariaKeyshortcuts: string | undefined;
}

export interface ResolveMenuShortcutOptions extends AcceleratorFormatOptions {
  optionKey?: boolean;
}

/**
 * Resolve display label and behavioral accelerator for a menu item.
 *
 * - `accelerator` controls keyboard behavior.
 * - `shortcut` controls presentation when explicitly provided.
 * - When only `shortcut` contains a parseable chord, it is used for both display and behavior.
 */
export function resolveMenuShortcut(
  item: Pick<
    MenuItemConfig,
    'accelerator' | 'alternateAccelerator' | 'shortcut' | 'alternateShortcut'
  >,
  options: ResolveMenuShortcutOptions = {},
): ResolvedMenuShortcut {
  const { optionKey = false, platform, style } = options;
  const formatOpts: AcceleratorFormatOptions = { platform, style };

  const behavioral = resolveBehavioralAccelerator(item, optionKey);
  const display = resolveDisplayShortcut(item, behavioral, formatOpts, optionKey);
  const ariaKeyshortcuts = behavioral ? formatAriaKeyshortcuts(behavioral) : undefined;

  return { display, accelerator: behavioral, ariaKeyshortcuts };
}

function resolveBehavioralAccelerator(
  item: Pick<
    MenuItemConfig,
    'accelerator' | 'alternateAccelerator' | 'shortcut' | 'alternateShortcut'
  >,
  optionKey: boolean,
): Accelerator | undefined {
  if (optionKey && item.alternateAccelerator) return item.alternateAccelerator;
  if (item.accelerator) return item.accelerator;
  if (optionKey && item.alternateShortcut) {
    return parseAccelerator(item.alternateShortcut) ?? undefined;
  }
  if (item.shortcut && looksLikeShortcutLabel(item.shortcut)) {
    return parseAccelerator(item.shortcut) ?? undefined;
  }
  return undefined;
}

function resolveDisplayShortcut(
  item: Pick<MenuItemConfig, 'shortcut' | 'alternateShortcut'>,
  behavioral: Accelerator | undefined,
  formatOpts: AcceleratorFormatOptions,
  optionKey: boolean,
): string | undefined {
  if (optionKey && item.alternateShortcut) return item.alternateShortcut;
  if (item.shortcut) return item.shortcut;
  if (behavioral) return formatAccelerator(behavioral, formatOpts);
  return undefined;
}

/** Resolve platform from LaRose config or auto-detect. */
export function resolveAcceleratorPlatform(platform?: AcceleratorPlatform): AcceleratorPlatform {
  if (platform) return platform;
  if (typeof navigator === 'undefined') return 'macos';
  const p = navigator.platform?.toLowerCase() ?? '';
  if (p.includes('mac')) return 'macos';
  if (p.includes('win')) return 'windows';
  return 'linux';
}
