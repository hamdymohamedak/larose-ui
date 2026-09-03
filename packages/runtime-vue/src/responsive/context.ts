import { inject, provide, type InjectionKey, type Ref, ref, onMounted, onUnmounted } from 'vue';
import {
  buildResponsiveSnapshot,
  defaultBreakpoints,
  detectTouchCapability,
  getViewportWidth,
  type BreakpointConfig,
  type ResponsiveSnapshot,
} from '@larose-ui/runtime-core';

export const RESPONSIVE_KEY: InjectionKey<Ref<ResponsiveSnapshot>> = Symbol('larose-responsive');

const fallback = (): ResponsiveSnapshot =>
  buildResponsiveSnapshot(1024, defaultBreakpoints, false);

export function provideResponsive(breakpoints: BreakpointConfig = defaultBreakpoints): Ref<ResponsiveSnapshot> {
  const state = ref(
    buildResponsiveSnapshot(getViewportWidth(), breakpoints, detectTouchCapability()),
  );

  let onResize: (() => void) | undefined;

  onMounted(() => {
    if (typeof window === 'undefined') return;
    onResize = () => {
      state.value = buildResponsiveSnapshot(
        window.innerWidth,
        breakpoints,
        detectTouchCapability(),
      );
    };
    window.addEventListener('resize', onResize);
    onResize();
  });

  onUnmounted(() => {
    if (onResize && typeof window !== 'undefined') {
      window.removeEventListener('resize', onResize);
    }
  });

  provide(RESPONSIVE_KEY, state);
  return state;
}

export function useBreakpoint(): ResponsiveSnapshot {
  return (inject(RESPONSIVE_KEY, null) ?? ref(fallback())).value;
}
