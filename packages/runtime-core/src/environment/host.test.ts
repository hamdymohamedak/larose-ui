import { describe, expect, it } from 'vitest';
import { capabilitiesForPlatform, detectHostEnvironment } from './host';

describe('host environment', () => {
  it('defaults to web capabilities', () => {
    const host = detectHostEnvironment('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
    expect(host.platform).toBe('web');
    expect(host.os).toBe('macos');
    expect(host.capabilities.nativeMenus).toBe(false);
  });

  it('exposes desktop capabilities for native hosts', () => {
    const caps = capabilitiesForPlatform('electron');
    expect(caps.nativeMenus).toBe(true);
    expect(caps.globalShortcuts).toBe(true);
  });
});
