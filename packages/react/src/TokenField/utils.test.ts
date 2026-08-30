import { describe, expect, it } from 'vitest';
import { filterTokenSuggestions, mergeUniqueTokens, tokenizeInput } from './utils';

describe('TokenField utils', () => {
  it('tokenizes comma-separated input', () => {
    expect(tokenizeInput('a, b, c', [',']).map((t) => t.label)).toEqual(['a', 'b', 'c']);
  });

  it('merges unique tokens', () => {
    expect(
      mergeUniqueTokens([{ id: '1', label: 'Ada' }], [{ id: '2', label: 'Ada' }, { id: '3', label: 'Bob' }]),
    ).toHaveLength(2);
  });

  it('filters suggestions', () => {
    expect(
      filterTokenSuggestions('ju', [
        { id: '1', label: 'Juan Chavez' },
        { id: '2', label: 'Ada Lovelace' },
      ]),
    ).toEqual([{ id: '1', label: 'Juan Chavez' }]);
  });
});
