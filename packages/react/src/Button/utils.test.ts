import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import {
  formatButtonLabel,
  hasTextContent,
  resolveButtonShape,
  splitButtonChildren,
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

  it('resolves roundedRect shape for icon and text buttons', () => {
    expect(resolveButtonShape({ hasText: true, hasIcon: true })).toBe('roundedRect');
  });

  it('resolves capsule shape for text buttons', () => {
    expect(resolveButtonShape({ hasText: true, hasIcon: false })).toBe('capsule');
  });

  it('detects text content in labels', () => {
    expect(hasTextContent('Save')).toBe(true);
    expect(hasTextContent('  ')).toBe(false);
  });

  it('splits mixed text and inline icons from children', () => {
    const result = splitButtonChildren(['Start building', createElement('svg')]);
    expect(result.text).toBe('Start building');
    expect(result.inlineIcons).toHaveLength(1);
  });

  it('trims whitespace-only text nodes when splitting children', () => {
    const result = splitButtonChildren(['  Save  ']);
    expect(result.text).toBe('Save');
    expect(result.inlineIcons).toHaveLength(0);
  });
});
