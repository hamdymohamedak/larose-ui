import type { MenuEntry } from '@larose-ui/primitives';
import { isMenuItem } from '@larose-ui/primitives';
import { resolveMenuShortcut } from '@larose-ui/primitives';
import type { HostOS } from '@larose-ui/runtime-core';
import { acceleratorToElectron, acceleratorToTauri } from './acceleratorNative';

export interface NativeMenuItem {
  id: string;
  label: string;
  type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
  enabled?: boolean;
  checked?: boolean;
  accelerator?: string;
  submenu?: NativeMenuItem[];
  click?: () => void;
}

export interface NativeMenuBarMenu {
  id: string;
  label: string;
  submenu: NativeMenuItem[];
}

export interface MapNativeMenuOptions {
  os?: HostOS;
  host?: 'electron' | 'tauri';
  /** Exclude hidden or disabled entries. Defaults to true. */
  excludeInactive?: boolean;
}

function hostOsToPlatform(os: HostOS): 'macos' | 'windows' | 'linux' {
  if (os === 'macos') return 'macos';
  if (os === 'windows') return 'windows';
  return 'linux';
}

function toNativeAccelerator(
  entry: Parameters<typeof resolveMenuShortcut>[0],
  options: MapNativeMenuOptions,
): string | undefined {
  const platform = hostOsToPlatform(options.os ?? 'unknown');
  const resolved = resolveMenuShortcut(entry, { platform });
  if (!resolved.accelerator) return undefined;

  const converter = options.host === 'tauri' ? acceleratorToTauri : acceleratorToElectron;
  return converter(resolved.accelerator, options.os);
}

function mapEntry(entry: MenuEntry, options: MapNativeMenuOptions): NativeMenuItem | null {
  if (entry.type === 'separator') {
    return { id: entry.id ?? `sep-${Math.random()}`, label: '', type: 'separator' };
  }

  if (entry.type === 'submenu') {
    if (options.excludeInactive !== false && (entry.hidden || entry.disabled)) return null;
    const submenu = mapMenuEntries(entry.items, options);
    if (submenu.length === 0) return null;
    return {
      id: entry.id,
      label: entry.label,
      type: 'submenu',
      enabled: !entry.disabled,
      submenu,
    };
  }

  if (!isMenuItem(entry)) return null;
  if (options.excludeInactive !== false && (entry.hidden || entry.disabled)) return null;

  return {
    id: entry.id,
    label: entry.label,
    type: entry.selected ? 'checkbox' : 'normal',
    checked: entry.selected,
    enabled: !entry.disabled,
    accelerator: toNativeAccelerator(entry, options),
    click: entry.onSelect,
  };
}

export function mapMenuEntries(
  entries: MenuEntry[],
  options: MapNativeMenuOptions = {},
): NativeMenuItem[] {
  const os = options.os ?? 'unknown';
  const normalized = { ...options, os };

  return entries
    .map((entry) => mapEntry(entry, normalized))
    .filter((item): item is NativeMenuItem => item !== null);
}

export interface NativeMenuBarInput {
  id: string;
  title: string;
  entries: MenuEntry[];
}

export function mapMenuBarToNative(
  menus: NativeMenuBarInput[],
  options: MapNativeMenuOptions = {},
): NativeMenuBarMenu[] {
  const os =
    options.os ??
    (typeof navigator !== 'undefined'
      ? resolveHostOsFromUserAgent(navigator.userAgent)
      : 'unknown');

  return menus.map((menu) => ({
    id: menu.id,
    label: menu.title,
    submenu: mapMenuEntries(menu.entries, { ...options, os }),
  }));
}

function resolveHostOsFromUserAgent(userAgent: string): HostOS {
  if (/Mac OS X|Macintosh/i.test(userAgent)) return 'macos';
  if (/Windows/i.test(userAgent)) return 'windows';
  if (/Linux/i.test(userAgent)) return 'linux';
  return 'unknown';
}
