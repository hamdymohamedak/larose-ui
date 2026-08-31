import type { Accelerator } from '@larose-ui/core';
import type { HostOS } from '@larose-ui/runtime-core';

function formatNativeKey(key: string): string {
  const normalized = key.toLowerCase();
  const special: Record<string, string> = {
    escape: 'Esc',
    enter: 'Enter',
    space: 'Space',
    tab: 'Tab',
    backspace: 'Backspace',
    delete: 'Delete',
    arrowup: 'Up',
    arrowdown: 'Down',
    arrowleft: 'Left',
    arrowright: 'Right',
  };

  if (special[normalized]) return special[normalized]!;
  if (normalized.length === 1 && /[a-z0-9]/.test(normalized)) {
    return normalized.toUpperCase();
  }
  if (/^f\d{1,2}$/.test(normalized)) return normalized.toUpperCase();
  return key;
}

function primaryModifier(os: HostOS): 'Command' | 'CmdOrCtrl' {
  return os === 'macos' ? 'Command' : 'CmdOrCtrl';
}

/**
 * Convert a laRose accelerator to an Electron accelerator string.
 * @see https://www.electronjs.org/docs/latest/api/accelerator
 */
export function acceleratorToElectron(
  accelerator: Accelerator,
  os: HostOS = 'unknown',
): string {
  const parts: string[] = [];

  if (accelerator.ctrl) parts.push('Control');
  if (accelerator.alt) parts.push('Alt');
  if (accelerator.shift) parts.push('Shift');

  if (accelerator.mod) {
    parts.push(primaryModifier(os));
  } else if (accelerator.meta) {
    parts.push('Command');
  }

  parts.push(formatNativeKey(accelerator.key));
  return parts.join('+');
}

/**
 * Convert a laRose accelerator to a Tauri global shortcut string.
 * @see https://v2.tauri.app/reference/javascript/global-shortcut/
 */
export function acceleratorToTauri(
  accelerator: Accelerator,
  os: HostOS = 'unknown',
): string {
  const parts: string[] = [];

  if (accelerator.ctrl) parts.push('Control');
  if (accelerator.alt) parts.push('Alt');
  if (accelerator.shift) parts.push('Shift');

  if (accelerator.mod) {
    parts.push(os === 'macos' ? 'Command' : 'CommandOrControl');
  } else if (accelerator.meta) {
    parts.push('Command');
  }

  parts.push(formatNativeKey(accelerator.key));
  return parts.join('+');
}
