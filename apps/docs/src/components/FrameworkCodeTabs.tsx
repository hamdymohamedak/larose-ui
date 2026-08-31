import { useMemo } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import {
  frameworkLanguage,
  getSupportedFrameworks,
  type DocsFramework,
} from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';

export interface FrameworkCodeSnippet {
  react: string;
  vue?: string;
  svelte?: string;
}

interface FrameworkCodeTabsProps {
  snippets: FrameworkCodeSnippet;
  /** When set, only show tabs for these frameworks (defaults to all present in snippets). */
  componentName?: string;
  title?: string;
  showSelector?: boolean;
}

function resolveActiveFramework(
  preferred: DocsFramework,
  supported: DocsFramework[],
  snippets: FrameworkCodeSnippet,
): DocsFramework {
  if (supported.includes(preferred) && snippets[preferred]) return preferred;
  if (snippets.react) return 'react';
  return supported[0] ?? 'react';
}

export function FrameworkCodeTabs({
  snippets,
  componentName,
  title,
  showSelector = true,
}: FrameworkCodeTabsProps) {
  const { framework } = useDocsFramework();

  const supported = useMemo(
    () => (componentName ? getSupportedFrameworks(componentName) : (['react', 'vue', 'svelte'] as const)),
    [componentName],
  );

  const active = resolveActiveFramework(framework, [...supported], snippets);
  const code = snippets[active] ?? snippets.react;
  const language = code.trimStart().startsWith('pnpm') || code.trimStart().startsWith('npm')
    ? 'bash'
    : frameworkLanguage(active);

  return (
    <div className="docs-framework-code">
      {showSelector ? (
        <div className="docs-framework-code__toolbar">
          {title ? <span className="docs-code-title">{title}</span> : <span />}
          <FrameworkSelector supported={[...supported]} compact />
        </div>
      ) : null}
      <CodeBlock code={code} language={language} title={showSelector ? undefined : title} />
      {componentName && supported.length === 1 ? (
        <p className="docs-framework-note">
          Vue and Svelte bindings for <strong>{componentName}</strong> are coming soon. API parity
          stories live in Storybook under <strong>Parity / Components</strong>.
        </p>
      ) : null}
    </div>
  );
}
