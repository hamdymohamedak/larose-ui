import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LiveFramework } from '@/lib/live-playground/types';
import { LivePlaygroundFullscreen } from '@/components/LivePlaygroundFullscreen';

type DraftKey = `${string}:${LiveFramework}`;

interface OpenOptions {
  componentName: string;
  /** Optional drafts to seed into the session map (e.g. from the inline playground). */
  drafts?: Partial<Record<LiveFramework, string>>;
}

interface LiveFullscreenContextValue {
  isOpen: boolean;
  componentName: string | null;
  open: (options: OpenOptions) => void;
  close: () => void;
  setComponentName: (componentName: string) => void;
  getDraft: (componentName: string, framework: LiveFramework) => string | undefined;
  setDraft: (componentName: string, framework: LiveFramework, code: string) => void;
  clearDraft: (componentName: string, framework: LiveFramework) => void;
}

const LiveFullscreenContext = createContext<LiveFullscreenContextValue | null>(null);

function draftKey(componentName: string, framework: LiveFramework): DraftKey {
  return `${componentName}:${framework}`;
}

export function LiveFullscreenProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [componentName, setComponentNameState] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<DraftKey, string>>>({});

  const open = useCallback((options: OpenOptions) => {
    setComponentNameState(options.componentName);
    if (options.drafts) {
      setDrafts((current) => {
        const next = { ...current };
        for (const [framework, code] of Object.entries(options.drafts!) as Array<
          [LiveFramework, string]
        >) {
          if (typeof code === 'string') {
            next[draftKey(options.componentName, framework)] = code;
          }
        }
        return next;
      });
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setComponentName = useCallback((name: string) => {
    setComponentNameState(name);
  }, []);

  const getDraft = useCallback(
    (name: string, framework: LiveFramework) => drafts[draftKey(name, framework)],
    [drafts],
  );

  const setDraft = useCallback((name: string, framework: LiveFramework, code: string) => {
    setDrafts((current) => ({
      ...current,
      [draftKey(name, framework)]: code,
    }));
  }, []);

  const clearDraft = useCallback((name: string, framework: LiveFramework) => {
    setDrafts((current) => {
      const next = { ...current };
      delete next[draftKey(name, framework)];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('docs-live-fullscreen-open');
      return undefined;
    }

    document.body.classList.add('docs-live-fullscreen-open');

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('docs-live-fullscreen-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  const value = useMemo(
    () => ({
      isOpen,
      componentName,
      open,
      close,
      setComponentName,
      getDraft,
      setDraft,
      clearDraft,
    }),
    [
      isOpen,
      componentName,
      open,
      close,
      setComponentName,
      getDraft,
      setDraft,
      clearDraft,
    ],
  );

  return (
    <LiveFullscreenContext.Provider value={value}>
      {children}
      {isOpen && componentName ? <LivePlaygroundFullscreen /> : null}
    </LiveFullscreenContext.Provider>
  );
}

export function useLiveFullscreen(): LiveFullscreenContextValue {
  const context = useContext(LiveFullscreenContext);
  if (!context) {
    throw new Error('useLiveFullscreen must be used within LiveFullscreenProvider');
  }
  return context;
}
