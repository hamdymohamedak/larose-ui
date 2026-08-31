import type { Accelerator } from './types';
import { normalizeKey } from './keys';

/** Return a canonical copy of an accelerator for comparison and registry keys. */
export function normalizeAccelerator(accelerator: Accelerator): Accelerator {
  return {
    mod: accelerator.mod === true ? true : undefined,
    ctrl: accelerator.ctrl === true ? true : undefined,
    meta: accelerator.meta === true ? true : undefined,
    alt: accelerator.alt === true ? true : undefined,
    shift: accelerator.shift === true ? true : undefined,
    key: normalizeKey(accelerator.key),
  };
}

/** Validate that an accelerator has a usable key. */
export function isValidAccelerator(accelerator: Accelerator): boolean {
  return normalizeKey(accelerator.key).length > 0;
}

/** Stable string key for registry lookup and conflict detection. */
export function acceleratorToId(accelerator: Accelerator): string {
  const normalized = normalizeAccelerator(accelerator);
  const parts: string[] = [];
  if (normalized.ctrl) parts.push('ctrl');
  if (normalized.alt) parts.push('alt');
  if (normalized.shift) parts.push('shift');
  if (normalized.meta) parts.push('meta');
  if (normalized.mod) parts.push('mod');
  parts.push(normalized.key);
  return parts.join('+');
}
