import type { Accelerator, AcceleratorFormatOptions, AcceleratorPlatform } from './types';
import { normalizeAccelerator } from './normalize';
import { detectPlatform } from './match';

const MACOS_KEY_SYMBOLS: Record<string, string> = {
  escape: '⎋',
  delete: '⌫',
  enter: '↩',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
};

function formatKey(key: string, platform: AcceleratorPlatform, style: 'symbols' | 'text'): string {
  const normalized = key.toLowerCase();

  if (platform === 'macos' && style === 'symbols' && MACOS_KEY_SYMBOLS[normalized]) {
    return MACOS_KEY_SYMBOLS[normalized]!;
  }

  if (normalized.length === 1 && /[a-z0-9]/.test(normalized)) {
    return normalized.toUpperCase();
  }

  if (normalized.startsWith('f') && /^f\d{1,2}$/.test(normalized)) {
    return normalized.toUpperCase();
  }

  const specialLabels: Record<string, string> = {
    escape: 'Esc',
    enter: 'Enter',
    space: 'Space',
    tab: 'Tab',
    backspace: 'Backspace',
    delete: 'Delete',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
  };

  return specialLabels[normalized] ?? key;
}

/**
 * Format an accelerator for on-screen display.
 * macOS defaults to symbol modifiers (⌘⇧⌥⌃); Windows/Linux use text labels.
 */
export function formatAccelerator(
  accelerator: Accelerator,
  options: AcceleratorFormatOptions = {},
): string {
  const platform = options.platform ?? detectPlatform();
  const style = options.style ?? (platform === 'macos' ? 'symbols' : 'text');
  const normalized = normalizeAccelerator(accelerator);

  if (platform === 'macos' && style === 'symbols') {
    return formatMacSymbols(normalized);
  }

  return formatTextModifiers(normalized, platform);
}

function formatMacSymbols(accelerator: Accelerator): string {
  let result = '';
  if (accelerator.ctrl) result += '⌃';
  if (accelerator.alt) result += '⌥';
  if (accelerator.shift) result += '⇧';
  if (accelerator.mod || accelerator.meta) result += '⌘';
  result += formatKey(accelerator.key, 'macos', 'symbols');
  return result;
}

function formatTextModifiers(accelerator: Accelerator, platform: AcceleratorPlatform): string {
  const parts: string[] = [];

  const modLabel = platform === 'macos' ? 'Cmd' : 'Ctrl';
  if (accelerator.mod) {
    parts.push(modLabel);
  } else {
    if (accelerator.ctrl) parts.push('Ctrl');
    if (accelerator.meta) parts.push(platform === 'macos' ? 'Cmd' : 'Meta');
  }

  if (accelerator.alt) parts.push(platform === 'macos' ? 'Option' : 'Alt');
  if (accelerator.shift) parts.push('Shift');

  parts.push(formatKey(accelerator.key, platform, 'text'));
  return parts.join('+');
}

/**
 * Format an accelerator for the `aria-keyshortcuts` attribute (W3C syntax).
 * @see https://w3c.github.io/aria/#aria-keyshortcuts
 */
export function formatAriaKeyshortcuts(accelerator: Accelerator): string {
  const normalized = normalizeAccelerator(accelerator);
  const parts: string[] = [];

  if (normalized.ctrl) parts.push('Control');
  if (normalized.meta || normalized.mod) parts.push('Meta');
  if (normalized.alt) parts.push('Alt');
  if (normalized.shift) parts.push('Shift');

  const key = normalized.key;
  if (key.length === 1) {
    parts.push(key.toUpperCase());
  } else if (key.startsWith('arrow')) {
    parts.push(key.replace('arrow', 'Arrow'));
  } else if (key.startsWith('f') && /^f\d{1,2}$/.test(key)) {
    parts.push(key.toUpperCase());
  } else {
    parts.push(key.charAt(0).toUpperCase() + key.slice(1));
  }

  const deduped = [...new Set(parts)];
  return deduped.join('+');
}
