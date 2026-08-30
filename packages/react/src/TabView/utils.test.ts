import { describe, expect, it, vi } from 'vitest';
import { MAX_TAB_VIEW_TABS } from './types';
import { warnIfTooManyTabs } from './utils';

describe('TabView utils', () => {
  it('warns when tab count exceeds HIG limit', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfTooManyTabs(MAX_TAB_VIEW_TABS + 1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
