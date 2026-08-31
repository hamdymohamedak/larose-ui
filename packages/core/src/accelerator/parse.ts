import type { Accelerator } from './types';
import { looksLikeShortcutLabel, normalizeKey } from './keys';
import { normalizeAccelerator } from './normalize';

type ModifierKey = 'mod' | 'ctrl' | 'meta' | 'alt' | 'shift';

const MACOS_SYMBOLS: Record<string, ModifierKey> = {
  '⌘': 'mod',
  '⇧': 'shift',
  '⌥': 'alt',
  '⌃': 'ctrl',
};

const TEXT_MODIFIERS: Record<string, ModifierKey> = {
  mod: 'mod',
  cmd: 'mod',
  command: 'mod',
  meta: 'meta',
  ctrl: 'mod',
  control: 'mod',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
};

/**
 * Parse a display shortcut string into a machine-readable accelerator.
 * Returns `null` when the string does not look like a shortcut label.
 */
export function parseAccelerator(input: string): Accelerator | null {
  const trimmed = input.trim();
  if (!trimmed || !looksLikeShortcutLabel(trimmed)) return null;

  // macOS symbol format: ⌥⌘H, ⇧⌘Z, ⌘,
  if (/[⌘⇧⌥⌃]/.test(trimmed)) {
    return parseMacSymbols(trimmed);
  }

  // Text format: Ctrl+Shift+S, Alt+Ctrl+K
  if (/\+/.test(trimmed) || /^(Ctrl|Control|Alt|Option|Shift|Meta|Cmd|Command|Mod)/i.test(trimmed)) {
    return parseTextFormat(trimmed);
  }

  return null;
}

function parseMacSymbols(input: string): Accelerator | null {
  const acc: Accelerator = { key: '' };
  let keyPart = '';

  for (const char of input) {
    const modKey = MACOS_SYMBOLS[char];
    if (modKey) {
      acc[modKey] = true;
    } else {
      keyPart += char;
    }
  }

  keyPart = keyPart.trim();
  if (!keyPart) return null;

  // Handle special macOS glyphs
  if (keyPart === '⎋') {
    acc.key = 'escape';
  } else if (keyPart === '⌫') {
    acc.key = 'delete';
  } else if (keyPart === '↩' || keyPart === '⏎') {
    acc.key = 'enter';
  } else if (keyPart === '?') {
    acc.shift = true;
    acc.key = '?';
  } else if (keyPart.length === 1 && keyPart >= 'A' && keyPart <= 'Z') {
    acc.key = keyPart.toLowerCase();
  } else {
    acc.key = normalizeKey(keyPart);
  }

  return normalizeAccelerator(acc);
}

function parseTextFormat(input: string): Accelerator | null {
  const parts = input.split('+').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const acc: Accelerator = { key: '' };
  const keyPart = parts[parts.length - 1]!;
  const modifierParts = parts.slice(0, -1);

  for (const part of modifierParts) {
    const modKey = TEXT_MODIFIERS[part.toLowerCase()];
    if (modKey) {
      acc[modKey] = true;
    }
  }

  if (keyPart.length === 1 && /[a-zA-Z]/.test(keyPart)) {
    acc.key = keyPart.toLowerCase();
  } else {
    acc.key = normalizeKey(keyPart);
  }

  if (!acc.key) return null;
  return normalizeAccelerator(acc);
}
