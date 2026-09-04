import { describe, it, expect } from 'vitest';
import { splitLiquidGlassLayoutStyle } from './splitLayoutStyle';

describe('splitLiquidGlassLayoutStyle', () => {
  it('moves flex, grid, and padding onto the inner content wrapper', () => {
    const { shell, content } = splitLiquidGlassLayoutStyle({
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      padding: 16,
      marginTop: 8,
      color: 'white',
    });

    expect(content).toEqual({
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      padding: 16,
    });
    expect(shell).toEqual({
      marginTop: 8,
      color: 'white',
    });
  });
});
