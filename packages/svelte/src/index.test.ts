import { describe, expect, it } from 'vitest';
import { resolveButtonShape, formatButtonLabel } from './lib/button/utils';
import { fieldIdFromLabel } from './lib/data-entry/utils';

describe('button utils', () => {
  it('formats labels with ellipsis', () => {
    expect(formatButtonLabel('Open', true)).toBe('Open…');
  });

  it('resolves circle shape for icon-only', () => {
    expect(
      resolveButtonShape({ iconOnly: true, hasText: false, hasIcon: true }),
    ).toBe('circle');
  });
});

describe('data-entry utils', () => {
  it('creates field ids from labels', () => {
    expect(fieldIdFromLabel('Email Address')).toBe('email-address');
  });
});
