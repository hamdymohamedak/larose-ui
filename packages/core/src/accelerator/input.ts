/** Returns true when the event target is an editable form control or contenteditable element. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;

  const element = target.closest(
    'input, textarea, select, [contenteditable=""], [contenteditable="true"]',
  );
  if (!element) return false;

  if (element instanceof HTMLInputElement) {
    const type = element.type.toLowerCase();
    // Allow shortcuts on button-like inputs
    if (type === 'button' || type === 'submit' || type === 'reset' || type === 'checkbox' || type === 'radio') {
      return false;
    }
    return !element.readOnly && !element.disabled;
  }

  if (element instanceof HTMLTextAreaElement) {
    return !element.readOnly && !element.disabled;
  }

  if (element instanceof HTMLSelectElement) {
    return !element.disabled;
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return true;
  }

  return false;
}

export interface ShouldHandleShortcutOptions {
  allowInEditable?: boolean;
  target?: EventTarget | null;
}

/**
 * Returns false when a shortcut should be suppressed because focus is in an editable element.
 * Global accelerators pass `allowInEditable: true` to override (e.g. ⌘K command palette).
 */
export function shouldHandleShortcut(options: ShouldHandleShortcutOptions = {}): boolean {
  if (options.allowInEditable) return true;
  return !isEditableTarget(options.target ?? null);
}
