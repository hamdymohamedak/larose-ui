import { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import { CopyButton } from '@/components/CopyButton';
import { useDocsTheme } from '@/theme/DocsThemeProvider';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
};

const PLAIN_LANGUAGES = new Set(['text', 'txt', 'plain', 'plaintext', 'diagram']);

function normalizeLanguage(language: string): string {
  const lower = language.toLowerCase();
  if (PLAIN_LANGUAGES.has(lower)) return 'plain';
  return LANGUAGE_ALIASES[lower] ?? lower;
}

const customLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    margin: 0,
    background: 'var(--lr-color-surface-muted)',
    border: '1px solid var(--lr-color-border)',
    borderRadius: 'var(--lr-radius-md)',
    fontSize: '0.8125rem',
    lineHeight: 1.6,
  },
};

const customDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    margin: 0,
    background: 'var(--lr-color-surface-muted)',
    border: '1px solid var(--lr-color-border)',
    borderRadius: 'var(--lr-radius-md)',
    fontSize: '0.8125rem',
    lineHeight: 1.6,
  },
};

export function CodeBlock({ code, language = 'tsx', title }: CodeBlockProps) {
  const { theme } = useDocsTheme();
  const style = useMemo(() => (theme === 'dark' ? customDark : customLight), [theme]);
  const normalized = normalizeLanguage(language);
  const content = code.trim();

  if (normalized === 'plain') {
    return (
      <figure className="docs-code-block">
        <div className="docs-code-toolbar">
          {title ? <figcaption className="docs-code-title">{title}</figcaption> : <span />}
          <CopyButton value={content} />
        </div>
        <pre className="docs-plain-code">
          <code>{content}</code>
        </pre>
      </figure>
    );
  }

  return (
    <figure className="docs-code-block">
      <div className="docs-code-toolbar">
        {title ? <figcaption className="docs-code-title">{title}</figcaption> : <span />}
        <CopyButton value={content} />
      </div>
      <SyntaxHighlighter
        language={normalized}
        style={style}
        customStyle={{ margin: 0, padding: '1rem 1.125rem' }}
        showLineNumbers={content.split('\n').length > 1}
        wrapLongLines
      >
        {content}
      </SyntaxHighlighter>
    </figure>
  );
}
