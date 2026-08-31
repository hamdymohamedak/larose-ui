export interface ParsedMnemonic {
  /** Label with mnemonic marker removed. */
  displayLabel: string;
  /** Lowercase access key, if any. */
  mnemonicKey: string | undefined;
}

const MNEMONIC_MARKER = '&';

/**
 * Parse a label containing an `&` mnemonic marker (e.g. `"&File"`, `"Save &As…"`).
 */
export function parseMnemonicLabel(label: string): ParsedMnemonic {
  const markerIndex = label.indexOf(MNEMONIC_MARKER);
  if (markerIndex === -1) {
    return { displayLabel: label, mnemonicKey: undefined };
  }

  const before = label.slice(0, markerIndex);
  const after = label.slice(markerIndex + 1);
  if (!after) {
    return { displayLabel: label.replace(MNEMONIC_MARKER, ''), mnemonicKey: undefined };
  }

  const mnemonicChar = after.charAt(0);
  const displayLabel = before + after;
  return {
    displayLabel,
    mnemonicKey: mnemonicChar.toLowerCase(),
  };
}

/** Resolve mnemonic key from explicit override, `&` marker, or first alphanumeric character. */
export function resolveMnemonicKey(label: string, explicit?: string): string | undefined {
  if (explicit) return explicit.toLowerCase();

  const parsed = parseMnemonicLabel(label);
  if (parsed.mnemonicKey) return parsed.mnemonicKey;

  const match = parsed.displayLabel.match(/[a-z0-9]/i);
  return match ? match[0]!.toLowerCase() : undefined;
}

/** Returns display text with any `&` mnemonic markers stripped. */
export function stripMnemonicMarker(label: string): string {
  return parseMnemonicLabel(label).displayLabel;
}

/** Whether a keyboard event is a plain letter match for a mnemonic key. */
export function matchesMnemonicKey(event: KeyboardEvent, mnemonicKey: string): boolean {
  if (event.metaKey || event.ctrlKey) return false;
  return event.key.length === 1 && event.key.toLowerCase() === mnemonicKey.toLowerCase();
}

/** Whether the event is Alt + mnemonic (Windows/Linux menu access). */
export function isAltMnemonicEvent(event: KeyboardEvent): boolean {
  return event.altKey && !event.metaKey && !event.ctrlKey && event.key.length === 1;
}

/** Collect visible menu items matching a typed prefix for type-ahead. */
export function matchTypeAheadPrefix(label: string, prefix: string): boolean {
  const normalizedLabel = stripMnemonicMarker(label).trim().toLowerCase();
  return normalizedLabel.startsWith(prefix.toLowerCase());
}
