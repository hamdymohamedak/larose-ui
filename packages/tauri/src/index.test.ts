import { describe, expect, it } from 'vitest';
import { STANDARD_ACCELERATORS } from '@larose-ui/desktop-core';
import { buildTauriMenuFromMenuBar, toTauriMenuTemplate } from './index';

describe('tauri menu templates', () => {
  it('builds menu items with Tauri accelerators', () => {
    const items = toTauriMenuTemplate([
      {
        id: 'save',
        label: 'Save',
        accelerator: 'CommandOrControl+S',
      },
    ]);

    expect(items[0]?.accelerator).toBe('CommandOrControl+S');
  });

  it('maps menu bar entries', () => {
    const menu = buildTauriMenuFromMenuBar([
      {
        id: 'edit',
        title: 'Edit',
        entries: [{ id: 'undo', label: 'Undo', accelerator: STANDARD_ACCELERATORS.undo }],
      },
    ]);

    expect(menu[0]?.text).toBe('Edit');
    expect(menu[0]?.items?.[0]?.accelerator).toMatch(/\+Z$/i);
  });
});
