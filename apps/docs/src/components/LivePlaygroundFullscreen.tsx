import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { vue } from '@codemirror/lang-vue';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button, Typography } from '@larose-ui/react';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { PreviewHost } from '@/lib/live-playground/PreviewHost';
import { compileLiveSource } from '@/lib/live-playground/compile';
import type { CompileResult, LiveFramework } from '@/lib/live-playground/types';
import { getPlaygroundSeed } from '@/data/playgroundSeeds.generated';
import { docsComponents } from '@/data/catalog.generated';
import {
  frameworkLanguage,
  getSupportedFrameworks,
  type DocsFramework,
} from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';
import { useDocsTheme } from '@/theme/DocsThemeProvider';
import { useLiveFullscreen } from '@/theme/LiveFullscreenProvider';

const DEBOUNCE_MS = 280;

function editorExtensions(framework: LiveFramework) {
  if (framework === 'react') {
    return [javascript({ jsx: true, typescript: true })];
  }
  if (framework === 'vue') {
    return [vue()];
  }
  return [html()];
}

function resolveFramework(
  preferred: DocsFramework,
  supported: DocsFramework[],
): LiveFramework {
  if (supported.includes(preferred)) return preferred;
  return (supported[0] ?? 'react') as LiveFramework;
}

function sourceFileLabel(framework: LiveFramework): string {
  if (framework === 'react') return 'App.jsx';
  if (framework === 'vue') return 'App.vue';
  return 'App.svelte';
}

function componentsByCategory() {
  const groups = new Map<string, typeof docsComponents>();
  for (const entry of docsComponents) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export function LivePlaygroundFullscreen() {
  const navigate = useNavigate();
  const { theme } = useDocsTheme();
  const { framework: preferred } = useDocsFramework();
  const {
    componentName,
    close,
    setComponentName,
    getDraft,
    setDraft,
    clearDraft,
  } = useLiveFullscreen();

  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(true);

  const name = componentName ?? '';
  const supported = getSupportedFrameworks(name);
  const framework = resolveFramework(preferred, supported);
  const seeds = getPlaygroundSeed(name) ?? { react: '' };
  const defaultCode = seeds[framework] ?? seeds.react ?? '';
  const code = getDraft(name, framework) ?? defaultCode;

  const [debouncedCode, setDebouncedCode] = useState(code);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedCode(code), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [code]);

  const result: CompileResult | null = useMemo(() => {
    if (!debouncedCode.trim()) {
      return { ok: false, framework, error: 'Empty demo source.' };
    }
    return compileLiveSource(framework, debouncedCode);
  }, [debouncedCode, framework]);

  const error = result && !result.ok ? result.error : null;

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return componentsByCategory()
      .map(([category, items]) => ({
        category,
        items: q
          ? items.filter(
              (item) =>
                item.name.toLowerCase().includes(q) ||
                item.id.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q),
            )
          : items,
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const selectComponent = (entry: (typeof docsComponents)[number]) => {
    setComponentName(entry.name);
    navigate(`/docs/components/${entry.id}`);
  };

  const overlay = (
    <div
      className="docs-live-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} live preview fullscreen`}
    >
      <header className="docs-live-fullscreen__toolbar">
        <div className="docs-live-fullscreen__toolbar-start">
          <Button variant="ghost" size="sm" onClick={close}>
            Exit fullscreen
          </Button>
          <Typography as="h2" role="title" className="docs-live-fullscreen__title">
            {name}
          </Typography>
        </div>
        <div className="docs-live-fullscreen__toolbar-end">
          <FrameworkSelector supported={supported} compact />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearDraft(name, framework);
            }}
          >
            Reset
          </Button>
          <Button
            variant={editorOpen ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setEditorOpen((open) => !open)}
          >
            {editorOpen ? 'Hide code' : 'Edit code'}
          </Button>
        </div>
      </header>

      <div className="docs-live-fullscreen__body">
        <aside className="docs-live-fullscreen__picker" aria-label="Components">
          <input
            type="search"
            className="docs-live-fullscreen__search"
            placeholder="Search components…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search components"
          />
          <div className="docs-live-fullscreen__picker-list">
            {grouped.map(({ category, items }) => (
              <div key={category} className="docs-live-fullscreen__picker-group">
                <div className="docs-live-fullscreen__picker-category">{category}</div>
                {items.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={
                      entry.name === name
                        ? 'docs-live-fullscreen__picker-item docs-live-fullscreen__picker-item--active'
                        : 'docs-live-fullscreen__picker-item'
                    }
                    onClick={() => selectComponent(entry)}
                  >
                    {entry.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <div className="docs-live-fullscreen__preview">
          <div className="docs-live-fullscreen__canvas">
            {error ? (
              <pre className="docs-live-playground__error" role="alert">
                {error}
              </pre>
            ) : (
              <PreviewHost framework={framework} result={result} />
            )}
          </div>
        </div>
      </div>

      {editorOpen ? (
        <div className="docs-live-fullscreen__editor-panel">
          <div className="docs-code-toolbar docs-live-fullscreen__editor-toolbar">
            <Typography as="h3" role="title">
              {sourceFileLabel(framework)}
            </Typography>
            <span className="docs-code-title">{frameworkLanguage(framework)}</span>
          </div>
          <div className="docs-live-fullscreen__editor-body">
            <CodeMirror
              value={code}
              height="100%"
              theme={theme === 'dark' ? oneDark : undefined}
              extensions={editorExtensions(framework)}
              basicSetup={{ lineNumbers: true, foldGutter: true }}
              onChange={(value) => setDraft(name, framework, value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  return createPortal(overlay, document.body);
}
