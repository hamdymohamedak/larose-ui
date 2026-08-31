export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export const defaultBreakpoints: BreakpointConfig = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  wide: 1280,
};

export interface ResponsiveSnapshot {
  breakpoint: Breakpoint;
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
}

export function resolveBreakpoint(width: number, config: BreakpointConfig = defaultBreakpoints): Breakpoint {
  if (width >= config.wide) return 'wide';
  if (width >= config.desktop) return 'desktop';
  if (width >= config.tablet) return 'tablet';
  return 'mobile';
}

export function buildResponsiveSnapshot(
  width: number,
  config: BreakpointConfig = defaultBreakpoints,
  isTouch = false,
): ResponsiveSnapshot {
  const breakpoint = resolveBreakpoint(width, config);
  return {
    width,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    isTouch,
  };
}

export function detectTouchCapability(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getViewportWidth(fallback = 1024): number {
  if (typeof window === 'undefined') return fallback;
  return window.innerWidth;
}
