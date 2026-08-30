import { describe, expect, it, vi } from 'vitest';
import {
  clampOrnamentWidth,
  ornamentsForEdge,
  resolveOrnamentVisibility,
  warnIfTooManyOrnaments,
} from './utils';

describe('Ornament utils', () => {
  it('hides ornament in automatic mode during immersive content', () => {
    expect(resolveOrnamentVisibility('automatic', true)).toBe(false);
    expect(resolveOrnamentVisibility('automatic', false)).toBe(true);
  });

  it('clamps ornament width to window width', () => {
    expect(clampOrnamentWidth(320, 400)).toBe(320);
    expect(clampOrnamentWidth(480, 320)).toBe(320);
  });

  it('filters ornaments by edge', () => {
    const bottom = ornamentsForEdge(
      [
        { id: 'a', content: null, edge: 'bottom' },
        { id: 'b', content: null, edge: 'top' },
      ],
      'bottom',
    );
    expect(bottom).toHaveLength(1);
    expect(bottom[0]?.id).toBe('a');
  });

  it('warns when too many ornaments are attached', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    warnIfTooManyOrnaments([
      { id: '1', content: null },
      { id: '2', content: null },
      { id: '3', content: null },
      { id: '4', content: null },
    ]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
