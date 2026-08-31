import {
  applyWindowChromeTokens,
  detectHostEnvironment,
  mapMenuBarToNative,
  registerHost,
  type NativeMenuBarInput,
  type NativeMenuItem,
  type WindowChromeOptions,
} from '@larose-ui/desktop-core';
import type { HostEnvironment } from '@larose-ui/runtime-core';

export interface BootstrapLaRoseElectronOptions {
  windowChrome?: WindowChromeOptions | false;
}

let bootstrapped = false;

/**
 * Register Electron as the laRose host and optionally apply window chrome tokens.
 * Call from the renderer before mounting React (or use `LaRoseElectronRoot`).
 */
export function bootstrapLaRoseElectron(
  options: BootstrapLaRoseElectronOptions = {},
): HostEnvironment {
  if (!bootstrapped) {
    registerHost('electron');
    bootstrapped = true;
  }

  if (options.windowChrome !== false) {
    applyWindowChromeTokens(options.windowChrome ?? {});
  }

  return detectHostEnvironment();
}

/** Electron-compatible menu template (matches MenuItemConstructorOptions shape). */
export interface ElectronMenuItemTemplate {
  label?: string;
  type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
  accelerator?: string;
  enabled?: boolean;
  checked?: boolean;
  submenu?: ElectronMenuItemTemplate[];
  click?: () => void;
}

export function toElectronMenuTemplate(items: NativeMenuItem[]): ElectronMenuItemTemplate[] {
  return items.map((item) => ({
    label: item.type === 'separator' ? undefined : item.label,
    type: item.type ?? 'normal',
    accelerator: item.accelerator,
    enabled: item.enabled,
    checked: item.checked,
    submenu: item.submenu ? toElectronMenuTemplate(item.submenu) : undefined,
    click: item.click,
  }));
}

export function buildElectronMenuFromMenuBar(
  menus: NativeMenuBarInput[],
): ElectronMenuItemTemplate[] {
  return mapMenuBarToNative(menus, { host: 'electron' }).map((menu) => ({
    label: menu.label,
    submenu: toElectronMenuTemplate(menu.submenu),
  }));
}

export type {
  NativeMenuBarInput,
  NativeMenuItem,
  WindowChromeOptions,
} from '@larose-ui/desktop-core';

export {
  acceleratorToElectron,
  mapMenuBarToNative,
  mapMenuEntries,
  STANDARD_ACCELERATORS,
  WINDOW_CHROME_STYLES,
} from '@larose-ui/desktop-core';
