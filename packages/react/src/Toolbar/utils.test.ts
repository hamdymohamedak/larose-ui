import { describe, expect, it, vi } from 'vitest';
import {
  computeVisibleToolbarItemCount,
  entriesFromToolbarActions,
  resolveToolbarPlacement,
  shouldUseSystemOverflow,
  truncateToolbarTitle,
  warnIfToolbarTitleTooLong,
  warnIfTooManyToolbarGroups,
} from './utils';

describe('Toolbar utils', () => {
  it('truncates long titles', () => {
    expect(truncateToolbarTitle('Quarterly Report Draft')).toBe('Quarterly Repo…');
  });

  it('warns when title exceeds 15 characters', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfToolbarTitleTooLong('This title is definitely too long');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns when there are too many groups', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfTooManyToolbarGroups(4);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('computes visible item count with overflow reserve', () => {
    expect(computeVisibleToolbarItemCount(200, [40, 40, 40, 40])).toBe(4);
    expect(computeVisibleToolbarItemCount(100, [40, 40, 40, 40])).toBeLessThan(4);
  });

  it('uses system overflow on macOS and iPadOS only', () => {
    expect(shouldUseSystemOverflow('macos')).toBe(true);
    expect(shouldUseSystemOverflow('ipados')).toBe(true);
    expect(shouldUseSystemOverflow('ios')).toBe(false);
  });

  it('defaults visionOS toolbars to the bottom edge', () => {
    expect(resolveToolbarPlacement('visionos')).toBe('bottom');
    expect(resolveToolbarPlacement('macos')).toBe('top');
  });

  it('converts toolbar actions to menu entries', () => {
    expect(
      entriesFromToolbarActions([{ id: 'share', label: 'Share', onSelect: () => undefined }]),
    ).toEqual([{ id: 'share', label: 'Share', onSelect: expect.any(Function) }]);
  });
});
