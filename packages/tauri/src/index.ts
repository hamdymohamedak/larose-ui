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

export interface BootstrapLaRoseTauriOptions {
  windowChrome?: WindowChromeOptions | false;
}

let bootstrapped = false;

/**
 * Register Tauri as the laRose host and optionally apply window chrome tokens.
 */
export function bootstrapLaRoseTauri(
  options: BootstrapLaRoseTauriOptions = {},
): HostEnvironment {
  if (!bootstrapped) {
    registerHost('tauri');
    bootstrapped = true;
  }

  if (options.windowChrome !== false) {
    applyWindowChromeTokens(options.windowChrome ?? {});
  }

  return detectHostEnvironment();
}

/** Tauri menu item shape (compatible with `@tauri-apps/api/menu`). */
export interface TauriMenuItemTemplate {
  id: string;
  text?: string;
  accelerator?: string;
  enabled?: boolean;
  checked?: boolean;
  items?: TauriMenuItemTemplate[];
  action?: () => void;
}

export function toTauriMenuTemplate(items: NativeMenuItem[]): TauriMenuItemTemplate[] {
  return items.map((item) => {
    if (item.type === 'separator') {
      return { id: item.id, text: '---' };
    }

    return {
      id: item.id,
      text: item.label,
      accelerator: item.accelerator,
      enabled: item.enabled,
      checked: item.checked,
      items: item.submenu ? toTauriMenuTemplate(item.submenu) : undefined,
      action: item.click,
    };
  });
}

export function buildTauriMenuFromMenuBar(menus: NativeMenuBarInput[]): TauriMenuItemTemplate[] {
  return mapMenuBarToNative(menus, { host: 'tauri' }).flatMap((menu) =>
    toTauriMenuTemplate([
      {
        id: menu.id,
        label: menu.label,
        type: 'submenu',
        submenu: menu.submenu,
      },
    ]),
  );
}

export type {
  NativeMenuBarInput,
  NativeMenuItem,
  WindowChromeOptions,
} from '@larose-ui/desktop-core';

export {
  acceleratorToTauri,
  mapMenuBarToNative,
  mapMenuEntries,
  STANDARD_ACCELERATORS,
  WINDOW_CHROME_STYLES,
} from '@larose-ui/desktop-core';
