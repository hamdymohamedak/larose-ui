import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

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

export interface ResponsiveContextValue {
  breakpoint: Breakpoint;
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextValue>({
  breakpoint: 'desktop',
  width: 1024,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouch: false,
});

export function useBreakpoint(): ResponsiveContextValue {
  return useContext(ResponsiveContext);
}

function resolveBreakpoint(width: number, config: BreakpointConfig): Breakpoint {
  if (width >= config.wide) return 'wide';
  if (width >= config.desktop) return 'desktop';
  if (width >= config.tablet) return 'tablet';
  return 'mobile';
}

export interface ResponsiveProviderProps {
  breakpoints?: BreakpointConfig;
  children: ReactNode;
}

export function ResponsiveProvider({
  breakpoints = defaultBreakpoints,
  children,
}: ResponsiveProviderProps) {
  const [state, setState] = useState<ResponsiveContextValue>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const breakpoint = resolveBreakpoint(width, breakpoints);
    return {
      width,
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
      isTouch:
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      const width = window.innerWidth;
      const breakpoint = resolveBreakpoint(width, breakpoints);
      setState({
        width,
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    };

    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoints]);

  return (
    <ResponsiveContext.Provider value={state}>{children}</ResponsiveContext.Provider>
  );
}
