import { describe, expect, it } from 'vitest';
import { formatRating, getInitials } from './utils';

describe('Lockup utils', () => {
  it('derives initials', () => {
    expect(getInitials('Sara Ali')).toBe('SA');
    expect(getInitials('Omar')).toBe('OM');
  });

  it('formats ratings', () => {
    expect(formatRating(4.5)).toBe('4.5 / 5');
  });
});
