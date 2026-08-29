import { describe, expect, it } from 'vitest';
import { applyCodemods } from './codemods';

describe('applyCodemods', () => {
  it('renames legacy token variables', () => {
    const result = applyCodemods('color: var(--ui-color-primary);');
    expect(result.changed).toBe(true);
    expect(result.content).toContain('--lr-color-primary');
  });

  it('splits LaRoseProvider import to runtime', () => {
    const source = "import { LaRoseProvider, Button } from '@larose/react';";
    const result = applyCodemods(source);
    expect(result.changed).toBe(true);
    expect(result.content).toContain("@larose/runtime");
    expect(result.content).toContain('Button');
  });
});
