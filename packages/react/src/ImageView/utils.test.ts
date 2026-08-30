import { describe, expect, it } from 'vitest';
import { nextFrameIndex, sequenceInterval } from './utils';

describe('ImageView utils', () => {
  it('cycles frame indices', () => {
    expect(nextFrameIndex(0, 3)).toBe(1);
    expect(nextFrameIndex(2, 3)).toBe(0);
  });

  it('defaults animation interval', () => {
    expect(sequenceInterval()).toBe(120);
    expect(sequenceInterval({ frames: ['a.png'], intervalMs: 250 })).toBe(250);
  });
});
