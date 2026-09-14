import { describe, expect, it, vi } from 'vitest';
import {
  createPresenceController,
  presenceMotionClassKey,
  resolveDialogConfirmVisibility,
  shouldDismissOnOverlayClick,
  MODAL_ARIA_IDS,
} from './index';

describe('createPresenceController', () => {
  it('keeps exited when closed', () => {
    const c = createPresenceController(false);
    expect(c.getSnapshot()).toEqual({ phase: 'exited', shouldRender: false });
  });

  it('enters through mounting when opened with motion', () => {
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      },
    );
    const c = createPresenceController(false);
    c.setPresent(true);
    expect(c.getSnapshot().phase).toBe('entering');
    expect(c.getSnapshot().shouldRender).toBe(true);
    c.handleAnimationEnd();
    expect(c.getSnapshot().phase).toBe('entered');
    vi.unstubAllGlobals();
  });

  it('skips motion when requested', () => {
    const onExit = vi.fn();
    const c = createPresenceController(true, { skipMotion: true });
    expect(c.getSnapshot().phase).toBe('entered');
    c.setPresent(false, { skipMotion: true, onExitComplete: onExit });
    expect(c.getSnapshot().phase).toBe('exited');
  });

  it('stays mounted while exiting', () => {
    const c = createPresenceController(true, { skipMotion: true });
    c.setPresent(false, { skipMotion: false });
    expect(c.getSnapshot()).toEqual({ phase: 'exiting', shouldRender: true });
    c.handleAnimationEnd();
    expect(c.getSnapshot().shouldRender).toBe(false);
  });
});

describe('overlay helpers', () => {
  it('resolves confirm visibility defaults', () => {
    expect(resolveDialogConfirmVisibility()).toBe(true);
    expect(resolveDialogConfirmVisibility({ showConfirm: false })).toBe(false);
    expect(resolveDialogConfirmVisibility({ showConfirm: true })).toBe(true);
  });

  it('maps motion class keys', () => {
    expect(presenceMotionClassKey('modal', 'entering')).toBe('modal-entering');
    expect(presenceMotionClassKey('backdrop', 'exited')).toBeUndefined();
  });

  it('dismisses only on direct overlay click', () => {
    const el = {} as EventTarget;
    expect(
      shouldDismissOnOverlayClick({ closeOnOverlay: true, eventTarget: el, currentTarget: el }),
    ).toBe(true);
    expect(
      shouldDismissOnOverlayClick({
        closeOnOverlay: true,
        eventTarget: {} as EventTarget,
        currentTarget: el,
      }),
    ).toBe(false);
  });

  it('exposes stable modal aria ids', () => {
    expect(MODAL_ARIA_IDS.titleId).toBe('lr-modal-title');
  });
});
