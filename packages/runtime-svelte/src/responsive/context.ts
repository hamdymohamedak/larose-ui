import { getContext, setContext } from 'svelte';
import { writable, type Readable } from 'svelte/store';
import {
  buildResponsiveSnapshot,
  defaultBreakpoints,
  detectTouchCapability,
  getViewportWidth,
  type BreakpointConfig,
  type ResponsiveSnapshot,
} from '@larose-ui/runtime-core';

export const RESPONSIVE_CONTEXT = 'larose-responsive';

export function createResponsiveStore(
  breakpoints: BreakpointConfig = defaultBreakpoints,
): Readable<ResponsiveSnapshot> & { destroy: () => void } {
  const store = writable(
    buildResponsiveSnapshot(getViewportWidth(), breakpoints, detectTouchCapability()),
  );

  let onResize: (() => void) | undefined;
  if (typeof window !== 'undefined') {
    onResize = () => {
      store.set(
        buildResponsiveSnapshot(window.innerWidth, breakpoints, detectTouchCapability()),
      );
    };
    window.addEventListener('resize', onResize);
    onResize();
  }

  return {
    subscribe: store.subscribe,
    destroy() {
      if (onResize && typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
      }
    },
  };
}

export function setResponsiveContext(store: Readable<ResponsiveSnapshot>): void {
  setContext(RESPONSIVE_CONTEXT, store);
}

export function getBreakpoint(): ResponsiveSnapshot {
  try {
    const store = getContext<Readable<ResponsiveSnapshot> | undefined>(RESPONSIVE_CONTEXT);
    if (!store) {
      return buildResponsiveSnapshot(1024, defaultBreakpoints, false);
    }
    let value = buildResponsiveSnapshot(1024, defaultBreakpoints, false);
    const unsub = store.subscribe((v) => {
      value = v;
    });
    unsub();
    return value;
  } catch {
    return buildResponsiveSnapshot(1024, defaultBreakpoints, false);
  }
}
