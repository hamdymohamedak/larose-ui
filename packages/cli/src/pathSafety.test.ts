import { describe, expect, it } from 'vitest';
import { resolveSafePath } from './pathSafety.js';

describe('resolveSafePath', () => {
  const root = '/project';

  it('allows paths within the project root', () => {
    expect(resolveSafePath(root, 'src/forms/Example.tsx')).toBe('/project/src/forms/Example.tsx');
  });

  it('rejects path traversal outside the project root', () => {
    expect(() => resolveSafePath(root, '../../../etc/passwd')).toThrow(
      /must stay within the project directory/,
    );
  });

  it('rejects absolute paths outside the project root', () => {
    expect(() => resolveSafePath(root, '/etc/passwd')).toThrow(
      /must stay within the project directory/,
    );
  });
});
