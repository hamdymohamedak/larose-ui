import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  buildResponsiveSnapshot,
  defaultBreakpoints,
  detectTouchCapability,
  getViewportWidth,
  type Breakpoint,
  type BreakpointConfig,
  type ResponsiveSnapshot,
} from '@larose-ui/runtime-core';

export type { Breakpoint, BreakpointConfig };

export type ResponsiveContextValue = ResponsiveSnapshot;

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

export { defaultBreakpoints };

export interface ResponsiveProviderProps {
  breakpoints?: BreakpointConfig;
  children: ReactNode;
}

export function ResponsiveProvider({
  breakpoints = defaultBreakpoints,
  children,
}: ResponsiveProviderProps) {
  const [state, setState] = useState<ResponsiveContextValue>(() =>
    buildResponsiveSnapshot(
      getViewportWidth(),
      breakpoints,
      detectTouchCapability(),
    ),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      setState(
        buildResponsiveSnapshot(
          window.innerWidth,
          breakpoints,
          detectTouchCapability(),
        ),
      );
    };

    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoints]);

  return (
    <ResponsiveContext.Provider value={state}>{children}</ResponsiveContext.Provider>
  );
}
