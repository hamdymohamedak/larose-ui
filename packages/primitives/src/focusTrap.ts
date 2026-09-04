/** CSS selector for elements that can receive keyboard focus. */
export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

export function focusFirst(container: ParentNode | null | undefined): HTMLElement | null {
  if (!container) return null;
  const first = getFocusableElements(container)[0];
  first?.focus();
  return first ?? null;
}

export function restoreFocus(element: HTMLElement | null | undefined): void {
  element?.focus?.();
}

export function lockBodyScroll(doc: Document = document): () => void {
  const previous = doc.body.style.overflow;
  doc.body.style.overflow = 'hidden';
  return () => {
    doc.body.style.overflow = previous;
  };
}

export function getActiveElement(doc: Document = document): HTMLElement | null {
  return doc.activeElement as HTMLElement | null;
}

/** Handle Escape to dismiss overlays. Returns true when Escape was handled. */
export function handleEscapeKey(
  event: Pick<KeyboardEvent, 'key'> & { preventDefault?: () => void },
  onEscape: () => void,
): boolean {
  if (event.key !== 'Escape') return false;
  event.preventDefault?.();
  onEscape();
  return true;
}

/**
 * Cycle Tab / Shift+Tab within a container (focus trap).
 * Returns true when the event was handled.
 */
export function handleTabKeyTrap(
  event: KeyboardEvent,
  container: ParentNode | null | undefined,
): boolean {
  if (event.key !== 'Tab' || !container) return false;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return false;

  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
      return true;
    }
  } else if (active === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}

export interface ActivateOverlayFocusOptions {
  container: ParentNode | null | undefined;
  onEscape: () => void;
  /** Trap Tab cycling inside the container. @default true */
  trapTab?: boolean;
  /** Lock document body scroll. @default true */
  lockScroll?: boolean;
  /** Focus the first focusable element on activate. @default true */
  autoFocus?: boolean;
  /** Restore previously focused element on cleanup. @default true */
  restore?: boolean;
  doc?: Document;
}

/**
 * Activate overlay focus management. Call the returned cleanup when the overlay closes.
 */
export function activateOverlayFocus({
  container,
  onEscape,
  trapTab = true,
  lockScroll = true,
  autoFocus = true,
  restore = true,
  doc = document,
}: ActivateOverlayFocusOptions): () => void {
  const previous = getActiveElement(doc);
  if (autoFocus) focusFirst(container);
  const unlock = lockScroll ? lockBodyScroll(doc) : () => undefined;

  const onKeyDown = (event: KeyboardEvent) => {
    handleEscapeKey(event, onEscape);
    if (trapTab) handleTabKeyTrap(event, container);
  };

  doc.addEventListener('keydown', onKeyDown);

  return () => {
    doc.removeEventListener('keydown', onKeyDown);
    unlock();
    if (restore) restoreFocus(previous);
  };
}
