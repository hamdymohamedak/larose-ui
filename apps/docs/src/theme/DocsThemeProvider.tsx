import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeMode } from '@larose-ui/core';
import { LaRoseProvider } from '@larose-ui/runtime';
import { applyResolvedTheme } from '@larose-ui/tokens';
import { resolveTheme } from '@larose-ui/themes';
import { DOCS_SURFACE_MUTED, getDocsThemeConfig } from './docsThemeConfig';

const STORAGE_KEY = 'larose-docs-theme';
const DOCS_DENSITY = 'comfortable' as const;

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

  const themeConfig = useMemo(() => getDocsThemeConfig(theme), [theme]);

  const resolved = useMemo(
    () =>
      resolveTheme({
        theme: themeConfig,
        density: DOCS_DENSITY,
        mode: theme,
      }),
    [themeConfig, theme],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.docsTheme = theme;
    root.style.colorScheme = theme;

    applyResolvedTheme(root, {
      mode: resolved.mode,
      density: resolved.density,
      tokenOverrides: resolved.tokenOverrides,
      brandColors: resolved.brandColors,
      componentTokenOverrides: resolved.componentTokenOverrides,
      presetId: resolved.preset,
    });

    root.style.setProperty('--lr-color-surface-muted', DOCS_SURFACE_MUTED[theme]);

    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, resolved]);

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
      <LaRoseProvider theme={theme} density={DOCS_DENSITY} themeConfig={themeConfig}>
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
