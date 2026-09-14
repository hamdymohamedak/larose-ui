import type { DialogConfirmVisibilityInput, ModalAriaIds } from './types';

/** Stable ARIA ids used across React / Vue / Svelte Modal implementations. */
export const MODAL_ARIA_IDS: ModalAriaIds = {
  titleId: 'lr-modal-title',
  descriptionId: 'lr-modal-desc',
};

export const DIALOG_ARIA_IDS = {
  titleId: 'lr-dialog-title',
  descriptionId: 'lr-dialog-desc',
} as const;

/**
 * Confirm button visibility — same observable rule across frameworks.
 * Default: show confirm. Hide only when `showConfirm` is explicitly false.
 * `hasConfirmHandler` is informational for adapters that gate callbacks.
 */
export function resolveDialogConfirmVisibility(input: DialogConfirmVisibilityInput = {}): boolean {
  if (input.showConfirm === false) return false;
  if (input.showConfirm === true) return true;
  // Default open: show confirm. React may still omit the handler; click is then a no-op until wired.
  if (input.hasConfirmHandler === false && input.showConfirm === undefined) {
    // Prefer showing when unspecified so Vue/Svelte/React match default UX.
    return true;
  }
  return true;
}

/** Whether overlay click should dismiss (target must be the overlay itself). */
export function shouldDismissOnOverlayClick(options: {
  closeOnOverlay?: boolean;
  eventTarget: EventTarget | null;
  currentTarget: EventTarget | null;
}): boolean {
  if (options.closeOnOverlay === false) return false;
  return options.eventTarget === options.currentTarget;
}
