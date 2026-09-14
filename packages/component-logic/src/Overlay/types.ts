/** Presence lifecycle phases shared by overlay enter/exit animations. */
export type PresencePhase = 'mounting' | 'entering' | 'entered' | 'exiting' | 'exited';

export type OverlayMotionKind = 'modal' | 'backdrop' | 'drawer-left' | 'drawer-right' | 'popover' | 'toast';

export interface PresenceSnapshot {
  phase: PresencePhase;
  /** Keep the overlay mounted while present or while exit animation runs. */
  shouldRender: boolean;
}

export interface PresenceControllerOptions {
  /** When true, skip enter/exit animation phases. */
  skipMotion?: boolean;
  onExitComplete?: () => void;
}

export interface ModalAriaIds {
  titleId: string;
  descriptionId: string;
}

export interface DialogConfirmVisibilityInput {
  /** Explicit override (framework-idiomatic boolean). Default true. */
  showConfirm?: boolean;
  /** Whether a confirm handler is wired (React-style optional callback). */
  hasConfirmHandler?: boolean;
}
