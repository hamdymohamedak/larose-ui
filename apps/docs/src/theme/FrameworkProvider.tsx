import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DocsFramework } from '@/lib/frameworks';

const STORAGE_KEY = 'larose-docs-framework';

interface FrameworkContextValue {
  framework: DocsFramework;
  setFramework: (framework: DocsFramework) => void;
}

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

function readStoredFramework(): DocsFramework {
  if (typeof window === 'undefined') return 'react';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'vue' || stored === 'svelte' || stored === 'react') return stored;
  return 'react';
}

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [framework, setFrameworkState] = useState<DocsFramework>(readStoredFramework);

  const setFramework = useCallback((next: DocsFramework) => {
    setFrameworkState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ framework, setFramework }), [framework, setFramework]);

  return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
}

export function useDocsFramework(): FrameworkContextValue {
  const context = useContext(FrameworkContext);
  if (!context) {
    throw new Error('useDocsFramework must be used within FrameworkProvider');
  }
  return context;
}
