import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeMode } from '@larose-ui/react';
import { LaRoseProvider } from '@larose-ui/react';

const STORAGE_KEY = 'larose-docs-theme';

interface DocsThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const DocsThemeContext = createContext<DocsThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

export function DocsThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.dataset.docsTheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current: ThemeMode) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return (
    <DocsThemeContext.Provider value={value}>
      <LaRoseProvider theme={theme} density="comfortable">
        {children}
      </LaRoseProvider>
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme(): DocsThemeContextValue {
  const context = useContext(DocsThemeContext);
  if (!context) {
    throw new Error('useDocsTheme must be used within DocsThemeProvider');
  }
  return context;
}
