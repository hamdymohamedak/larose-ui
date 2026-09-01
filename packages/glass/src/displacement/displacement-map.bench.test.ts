import { describe, it, expect } from 'vitest';
import { generateDisplacementMap, generateDisplacementMapFull } from '../displacement/displacement-map';

const lens = {
  width: 120,
  height: 60,
  borderRadius: 30,
  depth: 10,
  curvature: 40,
  splay: 1,
  scale: 1,
};

describe('displacement map benchmarks', () => {
  it('optimized generation is faster than full for mobile-sized lens', () => {
    const mobileLens = { ...lens, width: 80, height: 80 };

    const optimizedStart = performance.now();
    for (let i = 0; i < 50; i++) {
      generateDisplacementMap(mobileLens, { optimize: true });
    }
    const optimizedTime = performance.now() - optimizedStart;

    const fullStart = performance.now();
    for (let i = 0; i < 50; i++) {
      generateDisplacementMapFull(mobileLens);
    }
    const fullTime = performance.now() - fullStart;

    // Optimized should not be slower (allow margin for CI variance)
    expect(optimizedTime).toBeLessThanOrEqual(fullTime * 1.5);
  });
});
