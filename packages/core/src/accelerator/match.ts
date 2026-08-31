import type { Accelerator, AcceleratorMatchOptions, AcceleratorPlatform } from './types';
import { normalizeEventKey } from './keys';
import { normalizeAccelerator } from './normalize';

/** Detect platform from navigator when available; defaults to `'macos'`. */
export function detectPlatform(): AcceleratorPlatform {
  if (typeof navigator === 'undefined') return 'macos';
  const platform = navigator.platform?.toLowerCase() ?? '';
  const userAgent = navigator.userAgent?.toLowerCase() ?? '';

  if (platform.includes('mac') || userAgent.includes('mac')) return 'macos';
  if (platform.includes('win') || userAgent.includes('win')) return 'windows';
  return 'linux';
}

/** Resolve whether the primary `mod` modifier is pressed for the given platform. */
export function isModPressed(event: KeyboardEvent, platform: AcceleratorPlatform): boolean {
  return platform === 'macos' ? event.metaKey : event.ctrlKey;
}

/** Resolve expected modifier state for an accelerator on a given platform. */
export function resolveModRequirement(
  accelerator: Accelerator,
  platform: AcceleratorPlatform,
): { meta: boolean; ctrl: boolean } {
  const normalized = normalizeAccelerator(accelerator);
  let meta = normalized.meta === true;
  let ctrl = normalized.ctrl === true;

  if (normalized.mod) {
    if (platform === 'macos') {
      meta = true;
    } else {
      ctrl = true;
    }
  }

  return { meta, ctrl };
}

/**
 * Determine whether a keyboard event matches an accelerator definition.
 * Matching is platform-aware and never compares visual shortcut strings.
 */
export function matchKeyboardEvent(
  event: KeyboardEvent,
  accelerator: Accelerator,
  options: AcceleratorMatchOptions = {},
): boolean {
  const platform = options.platform ?? detectPlatform();
  const normalized = normalizeAccelerator(accelerator);
  const eventKey = normalizeEventKey(event);

  if (eventKey !== normalized.key) return false;

  const { meta, ctrl } = resolveModRequirement(normalized, platform);

  if (meta !== event.metaKey) return false;
  if (ctrl !== event.ctrlKey) return false;
  if ((normalized.alt === true) !== event.altKey) return false;
  if ((normalized.shift === true) !== event.shiftKey) return false;

  // When mod is used without explicit meta/ctrl, ensure the non-mod primary
  // modifier is not accidentally matched (e.g. Ctrl on macOS for mod shortcuts).
  if (normalized.mod && !normalized.meta && !normalized.ctrl) {
    if (platform === 'macos' && event.ctrlKey && !normalized.ctrl) return false;
    if (platform !== 'macos' && event.metaKey && !normalized.meta) return false;
  }

  return true;
}
