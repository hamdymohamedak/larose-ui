/** Named special keys used in accelerator definitions. */
export const SPECIAL_KEYS = new Set([
  'enter',
  'escape',
  'space',
  'tab',
  'backspace',
  'delete',
  'home',
  'end',
  'pageup',
  'pagedown',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
  'f12',
]);

const EVENT_KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  return: 'enter',
  ' ': 'space',
  spacebar: 'space',
  del: 'delete',
  ins: 'insert',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  page_up: 'pageup',
  page_down: 'pagedown',
};

/** Normalize a key identifier for comparison. */
export function normalizeKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (EVENT_KEY_ALIASES[lower]) return EVENT_KEY_ALIASES[lower]!;

  if (lower.startsWith('f') && /^f\d{1,2}$/.test(lower)) return lower;

  if (lower.length === 1) return lower;

  if (SPECIAL_KEYS.has(lower)) return lower;

  return lower;
}

/** Normalize a KeyboardEvent key for accelerator matching. */
export function normalizeEventKey(event: KeyboardEvent): string {
  if (event.key === ' ') return 'space';
  return normalizeKey(event.key);
}

/** Returns true when the string looks like a keyboard shortcut label, not plain text. */
export function looksLikeShortcutLabel(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (/^[⌘⇧⌥⌃⎋]/.test(trimmed)) return true;
  if (/^(Ctrl|Control|Alt|Option|Shift|Meta|Cmd|Command|Mod)\+/i.test(trimmed)) return true;
  if (/\+/.test(trimmed) && /^(Ctrl|Alt|Shift|Meta|Cmd|Mod)/i.test(trimmed)) return true;

  // Single modifier + key patterns like "⌘S"
  if (/^[⌘⇧⌥⌃]/.test(trimmed) && trimmed.length >= 2) return true;

  return false;
}
