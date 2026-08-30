import { describe, expect, it } from 'vitest';
import {
  buildEditMenuActions,
  canExpandCompactMenu,
  isStandardActionAvailable,
  orderEditMenuActions,
  resolveEditMenuPosition,
  resolveEditMenuVariant,
} from './utils';

describe('EditMenu utils', () => {
  it('resolves compact variant for touch input', () => {
    expect(resolveEditMenuVariant('auto', 'auto', 'touch')).toBe('compact');
    expect(resolveEditMenuVariant('auto', 'auto', 'mouse')).toBe('context');
  });

  it('hides copy when nothing is selected and copy is not allowed', () => {
    expect(
      isStandardActionAvailable('copy', { hasSelection: false, canPaste: false }),
    ).toBe(false);
    expect(
      isStandardActionAvailable('copy', {
        hasSelection: false,
        canPaste: false,
        allowsCopy: true,
      }),
    ).toBe(true);
  });

  it('builds clipboard actions when selection exists', () => {
    const actions = buildEditMenuActions({
      hasSelection: true,
      canPaste: true,
      isEditable: true,
      contentType: 'text',
    });
    expect(actions.map((a) => a.id)).toEqual(
      expect.arrayContaining(['cut', 'copy', 'paste', 'translate', 'lookUp', 'delete']),
    );
    expect(actions.find((a) => a.id === 'select')).toBeUndefined();
  });

  it('orders custom format commands after clipboard group', () => {
    const ordered = orderEditMenuActions([
      { id: 'bold', label: 'Bold', group: 'format' },
      { id: 'copy', label: 'Copy', group: 'clipboard', standard: true },
      { id: 'paste', label: 'Paste', group: 'clipboard', standard: true },
    ]);
    expect(ordered.map((a) => a.id)).toEqual(['copy', 'paste', 'bold']);
  });

  it('positions menu above or below anchor', () => {
    const below = resolveEditMenuPosition(new DOMRect(100, 100, 80, 24), 200, 40, 'below', 800, 1024);
    expect(below.placement).toBe('below');
    expect(below.y).toBeGreaterThan(100);

    const above = resolveEditMenuPosition(new DOMRect(100, 600, 80, 24), 200, 40, 'above', 800, 1024);
    expect(above.placement).toBe('above');
    expect(above.y).toBeLessThan(600);
  });

  it('detects when compact menu can expand', () => {
    expect(canExpandCompactMenu(3)).toBe(false);
    expect(canExpandCompactMenu(6)).toBe(true);
  });
});
