import { describe, expect, it } from 'vitest';
import { resolvePickerChrome } from './chrome';

describe('resolvePickerChrome', () => {
  it('keeps string style as appearance', () => {
    expect(resolvePickerChrome(undefined, 'compact', 'wheels')).toEqual({
      appearance: 'compact',
      css: undefined,
    });
  });

  it('treats object style as CSS and uses appearance or fallback', () => {
    const css = { width: 200 };
    expect(resolvePickerChrome('wheels', css, 'compact')).toEqual({
      appearance: 'wheels',
      css,
    });
    expect(resolvePickerChrome(undefined, css, 'wheels')).toEqual({
      appearance: 'wheels',
      css,
    });
  });
});
