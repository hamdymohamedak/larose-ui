import { describe, expect, it, vi } from 'vitest';
import { formatTabBarBadge, warnIfTooManyTabs } from './utils';

describe('TabBar utils', () => {
  it('formats badge counts', () => {
    expect(formatTabBarBadge(3)).toBe('3');
    expect(formatTabBarBadge(120)).toBe('99+');
    expect(formatTabBarBadge('!')).toBe('!');
  });

  it('warns when there are too many tabs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfTooManyTabs(6);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
