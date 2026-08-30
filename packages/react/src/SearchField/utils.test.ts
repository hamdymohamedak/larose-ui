import { describe, expect, it } from 'vitest';
import { filterSuggestions, resolveSearchFieldPlacement } from './utils';

describe('SearchField utils', () => {
  it('filters suggestions by query', () => {
    expect(filterSuggestions('des', ['Design', 'Develop', 'Deploy'])).toEqual(['Design']);
  });

  it('defaults macOS placement to toolbar trailing', () => {
    expect(resolveSearchFieldPlacement('macos')).toBe('toolbar-trailing');
  });

  it('defaults iOS placement to inline', () => {
    expect(resolveSearchFieldPlacement('ios')).toBe('inline');
  });
});
