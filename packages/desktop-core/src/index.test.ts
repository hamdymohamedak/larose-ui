import { describe, expect, it } from 'vitest';
import { STANDARD_ACCELERATORS } from '@larose-ui/core';
import {
  acceleratorToElectron,
  acceleratorToTauri,
  mapMenuEntries,
  registerHost,
  readRegisteredHost,
  clearRegisteredHost,
} from './index';

describe('acceleratorToElectron', () => {
  it('maps mod+s to CmdOrCtrl on Windows', () => {
    expect(acceleratorToElectron(STANDARD_ACCELERATORS.save, 'windows')).toBe('CmdOrCtrl+S');
  });

  it('maps mod+s to Command on macOS', () => {
    expect(acceleratorToElectron(STANDARD_ACCELERATORS.save, 'macos')).toBe('Command+S');
  });
});

describe('acceleratorToTauri', () => {
  it('maps mod+k to CommandOrControl on Linux', () => {
    expect(acceleratorToTauri(STANDARD_ACCELERATORS.commandPalette, 'linux')).toBe(
      'CommandOrControl+K',
    );
  });
});

describe('mapMenuEntries', () => {
  it('skips hidden items by default', () => {
    const items = mapMenuEntries(
      [
        { id: 'visible', label: 'Save', accelerator: STANDARD_ACCELERATORS.save },
        { id: 'hidden', label: 'Hidden', hidden: true },
      ],
      { host: 'electron', os: 'macos' },
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.id).toBe('visible');
    expect(items[0]?.accelerator).toBe('Command+S');
  });
});

describe('registerHost', () => {
  it('sets and reads the host flag', () => {
    clearRegisteredHost();
    registerHost('electron');
    expect(readRegisteredHost()).toBe('electron');
    clearRegisteredHost();
  });
});
