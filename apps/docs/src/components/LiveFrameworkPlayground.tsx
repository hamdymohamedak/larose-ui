import { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button, Typography } from '@larose-ui/react';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { PreviewHost } from '@/lib/live-playground/PreviewHost';
import { compileLiveSource } from '@/lib/live-playground/compile';
import type { CompileResult, LiveFramework } from '@/lib/live-playground/types';
import {
  getPlaygroundSeed,
  type PlaygroundSeedEntry,
} from '@/data/playgroundSeeds.generated';
import { frameworkLanguage, type DocsFramework } from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';
import { useDocsTheme } from '@/theme/DocsThemeProvider';

const DEBOUNCE_MS = 280;

interface LiveFrameworkPlaygroundProps {
  componentName: string;
  supported?: DocsFramework[];
  seeds?: PlaygroundSeedEntry;
}

function editorExtensions(framework: LiveFramework) {
  if (framework === 'react') {
    return [javascript({ jsx: true, typescript: true })];
  }
  // Vue SFC + Svelte are HTML-like for highlighting
  return [html()];
}

function resolveFramework(
  preferred: DocsFramework,
  supported: DocsFramework[],
): LiveFramework {
  if (supported.includes(preferred)) return preferred;
  return (supported[0] ?? 'react') as LiveFramework;
}

export function LiveFrameworkPlayground({
  componentName,
  supported = ['react', 'vue', 'svelte'],
  seeds: seedsProp,
}: LiveFrameworkPlaygroundProps) {
  const { framework: preferred } = useDocsFramework();
  const { theme } = useDocsTheme();
  const framework = resolveFramework(preferred, supported);

  const seeds = seedsProp ?? getPlaygroundSeed(componentName) ?? { react: '' };

  const defaultCode = seeds[framework] ?? seeds.react ?? '';

  const [codeByFramework, setCodeByFramework] = useState<Partial<Record<LiveFramework, string>>>(
    {},
  );

  // Reset per-component draft when navigating between components
  useEffect(() => {
    setCodeByFramework({});
  }, [componentName]);

  const code = codeByFramework[framework] ?? defaultCode;

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

  return (
    <section id="playground" className="docs-playground docs-live-playground docs-sb-playground">
      <div className="docs-live-playground__toolbar">
        <FrameworkSelector supported={supported} compact />
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setCodeByFramework((current) => ({
              ...current,
              [framework]: defaultCode,
            }))
          }
        >
          Reset
        </Button>
      </div>

      <div className="docs-live-playground__grid">
        <div className="docs-live-playground__editor">
          <div className="docs-code-toolbar">
            <Typography as="h3" role="title">
              {framework === 'react' ? 'App.tsx' : framework === 'vue' ? 'App.vue' : 'App.svelte'}
            </Typography>
            <span className="docs-code-title">{frameworkLanguage(framework)}</span>
          </div>
          <CodeMirror
            value={code}
            height="320px"
            theme={theme === 'dark' ? oneDark : undefined}
            extensions={editorExtensions(framework)}
            basicSetup={{ lineNumbers: true, foldGutter: true }}
            onChange={(value) =>
              setCodeByFramework((current) => ({
                ...current,
                [framework]: value,
              }))
            }
          />
        </div>

        <div className="docs-live-playground__preview">
          <div className="docs-code-toolbar">
            <Typography as="h3" role="title">
              Live preview
            </Typography>
            <span className="docs-code-title">{framework}</span>
          </div>
          <div className="docs-live-playground__canvas">
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
    </section>
  );
}
