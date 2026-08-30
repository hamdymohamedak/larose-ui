import { describe, expect, it } from 'vitest';
import {
  formatButtonLabel,
  hasTextContent,
  resolveButtonShape,
} from './utils';

describe('Button utils', () => {
  it('appends ellipsis when a button opens another view', () => {
    expect(formatButtonLabel('Edit', true)).toBe('Edit…');
    expect(formatButtonLabel('Edit…', true)).toBe('Edit…');
  });

  it('resolves circle shape for icon-only buttons', () => {
    expect(
      resolveButtonShape({ hasText: false, hasIcon: true, iconOnly: true }),
    ).toBe('circle');
  });

  it('resolves capsule shape for text buttons', () => {
    expect(resolveButtonShape({ hasText: true, hasIcon: false })).toBe('capsule');
  });

  it('detects text content in labels', () => {
    expect(hasTextContent('Save')).toBe(true);
    expect(hasTextContent('  ')).toBe(false);
  });
});
