import { describe, expect, it } from 'vitest';
import { STANDARD_ACCELERATORS } from '@larose-ui/desktop-core';
import { buildElectronMenuFromMenuBar, toElectronMenuTemplate } from './index';

describe('electron menu templates', () => {
  it('builds nested submenu templates', () => {
    const template = buildElectronMenuFromMenuBar([
      {
        id: 'file',
        title: 'File',
        entries: [
          { id: 'save', label: 'Save', accelerator: STANDARD_ACCELERATORS.save },
          { type: 'separator', id: 'sep' },
          { id: 'quit', label: 'Quit', accelerator: STANDARD_ACCELERATORS.quit },
        ],
      },
    ]);

    expect(template).toHaveLength(1);
    expect(template[0]?.label).toBe('File');
    expect(template[0]?.submenu?.[0]?.accelerator).toMatch(/\+S$/);
  });

  it('maps separators without labels', () => {
    const items = toElectronMenuTemplate([
      { id: 'sep', label: '', type: 'separator' },
    ]);
    expect(items[0]?.type).toBe('separator');
    expect(items[0]?.label).toBeUndefined();
  });
});
