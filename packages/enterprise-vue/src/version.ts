import { inject, unref, type InjectionKey, type ComputedRef } from 'vue';
import type { VersionInfo } from '@larose-ui/core';

export const VERSION_KEY: InjectionKey<ComputedRef<VersionInfo>> = Symbol('larose-version');

export function useVersion(): VersionInfo {
  const ctx = inject(VERSION_KEY, null);
  if (!ctx) throw new Error('useVersion must be used within VersionProvider');
  return unref(ctx);
}

export function useOptionalVersion(): VersionInfo | null {
  const ctx = inject(VERSION_KEY, null);
  return ctx ? unref(ctx) : null;
}

export function notifySessionExpired(code = 401): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('larose:session-expired', { detail: { code } }));
  }
}
