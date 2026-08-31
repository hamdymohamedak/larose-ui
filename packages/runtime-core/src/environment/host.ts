export type HostPlatform = 'web' | 'electron' | 'tauri' | 'capacitor';

export type HostOS = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown';

export interface HostCapabilities {
  nativeMenus: boolean;
  globalShortcuts: boolean;
  windowControls: boolean;
  vibrancy: boolean;
}

export interface HostEnvironment {
  platform: HostPlatform;
  os: HostOS;
  capabilities: HostCapabilities;
}

const WEB_CAPABILITIES: HostCapabilities = {
  nativeMenus: false,
  globalShortcuts: false,
  windowControls: false,
  vibrancy: false,
};

const DESKTOP_CAPABILITIES: HostCapabilities = {
  nativeMenus: true,
  globalShortcuts: true,
  windowControls: true,
  vibrancy: true,
};

function detectHostOS(userAgent: string): HostOS {
  if (/Mac OS X|Macintosh/i.test(userAgent)) return 'macos';
  if (/Windows/i.test(userAgent)) return 'windows';
  if (/Linux/i.test(userAgent)) return 'linux';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return 'unknown';
}

function readGlobalFlag(name: string): boolean {
  if (typeof globalThis === 'undefined') return false;
  return Boolean((globalThis as Record<string, unknown>)[name]);
}

/**
 * Detect the host environment for capability-based desktop integration.
 * Electron/Tauri hosts should set `globalThis.__LAROSE_HOST__` before boot.
 */
export function detectHostEnvironment(userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''): HostEnvironment {
  const explicit = readGlobalFlag('__LAROSE_HOST__') as HostPlatform | false;
  if (explicit === 'electron' || explicit === 'tauri' || explicit === 'capacitor') {
    return {
      platform: explicit,
      os: detectHostOS(userAgent),
      capabilities: DESKTOP_CAPABILITIES,
    };
  }

  return {
    platform: 'web',
    os: detectHostOS(userAgent),
    capabilities: WEB_CAPABILITIES,
  };
}

export function capabilitiesForPlatform(platform: HostPlatform): HostCapabilities {
  return platform === 'web' ? WEB_CAPABILITIES : DESKTOP_CAPABILITIES;
}
