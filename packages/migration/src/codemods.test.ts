import { describe, expect, it } from 'vitest';
import { applyCodemods } from './codemods';

describe('applyCodemods', () => {
  it('renames legacy token variables', () => {
    const result = applyCodemods('color: var(--ui-color-primary);');
    expect(result.changed).toBe(true);
    expect(result.content).toContain('--lr-color-primary');
  });

  it('splits LaRoseProvider import to runtime', () => {
    const source = "import { LaRoseProvider, Button } from '@larose-ui/react';";
    const result = applyCodemods(source);
    expect(result.changed).toBe(true);
    expect(result.content).toContain("@larose-ui/runtime-react");
    expect(result.content).toContain('Button');
  });

  it('moves useToast import to runtime toast subpath', () => {
    const source = "import { LaRoseProvider, useToast } from '@larose-ui/runtime-react';";
    const result = applyCodemods(source);
    expect(result.changed).toBe(true);
    expect(result.content).toContain("@larose-ui/runtime-react/toast");
    expect(result.content).toContain('LaRoseProvider');
  });
});
