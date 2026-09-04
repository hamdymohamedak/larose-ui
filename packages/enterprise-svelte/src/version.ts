import { getContext } from 'svelte';
import type { VersionInfo } from '@larose-ui/core';

export const VERSION_CONTEXT = 'larose-version';

export function getVersion(): VersionInfo {
  const ctx = getContext<VersionInfo | undefined>(VERSION_CONTEXT);
  if (!ctx) throw new Error('getVersion must be used within VersionProvider');
  return ctx;
}

export function getOptionalVersion(): VersionInfo | null {
  return getContext<VersionInfo | undefined>(VERSION_CONTEXT) ?? null;
}

export function notifySessionExpired(code = 401): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('larose:session-expired', { detail: { code } }));
  }
}
