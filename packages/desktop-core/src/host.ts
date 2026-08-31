import type { HostPlatform } from '@larose-ui/runtime-core';

const HOST_FLAG = '__LAROSE_HOST__';

/**
 * Register the desktop host platform before laRose runtime boot.
 * Electron/Tauri preload scripts should call this before rendering.
 */
export function registerHost(platform: HostPlatform): void {
  if (typeof globalThis === 'undefined') return;
  (globalThis as Record<string, unknown>)[HOST_FLAG] = platform;
}

export function readRegisteredHost(): HostPlatform | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  const value = (globalThis as Record<string, unknown>)[HOST_FLAG];
  if (value === 'electron' || value === 'tauri' || value === 'capacitor' || value === 'web') {
    return value;
  }
  return undefined;
}

export function clearRegisteredHost(): void {
  if (typeof globalThis === 'undefined') return;
  delete (globalThis as Record<string, unknown>)[HOST_FLAG];
}
