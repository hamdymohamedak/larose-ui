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

/** Normalize common aliases / file extensions → Prism language ids. */
const LANGUAGE_ALIASES: Record<string, string> = {
  // JS / TS family
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  mjs: 'javascript',
  cjs: 'javascript',
  cts: 'typescript',
  mts: 'typescript',
  // Shell
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  fish: 'bash',
  console: 'bash',
  terminal: 'bash',
  // Markup / SFC — Prism has no vue/svelte grammars; markup colors tags + embedded script/style
  vue: 'markup',
  svelte: 'markup',
  svx: 'markup',
  astro: 'markup',
  html: 'markup',
  htm: 'markup',
  svg: 'markup',
  xml: 'markup',
  xhtml: 'markup',
  mdx: 'jsx',
  // Data / config
  yml: 'yaml',
  'yaml-frontmatter': 'yaml',
  conf: 'ini',
  env: 'ini',
  dotenv: 'ini',
  properties: 'ini',
  // Styles
  styl: 'stylus',
  // Containers / infra
  dockerfile: 'docker',
  containerfile: 'docker',
  // Docs
  md: 'markdown',
  mdown: 'markdown',
  // Misc
  plaintext: 'text',
  plain: 'text',
  txt: 'text',
  text: 'text',
  diagram: 'text',
  output: 'text',
  // C family shortcuts
  'c++': 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
  'f#': 'fsharp',
  fs: 'fsharp',
  'objective-c': 'objectivec',
  objc: 'objectivec',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  kt: 'kotlin',
  kts: 'kotlin',
  golang: 'go',
  ps1: 'powershell',
  psm1: 'powershell',
  tf: 'hcl',
  terraform: 'hcl',
  gql: 'graphql',
  proto: 'protobuf',
  makefile: 'makefile',
  make: 'makefile',
  cmake: 'cmake',
};

const PLAIN_LANGUAGES = new Set(['text', 'txt', 'plain', 'plaintext', 'diagram', 'output']);

const SUPPORTED = new Set<string>(
  ((SyntaxHighlighter as { supportedLanguages?: string[] }).supportedLanguages ?? []).map((l) =>
    l.toLowerCase(),
  ),
);

/**
 * Resolve any fence / extension / alias to a Prism language that actually highlights.
 * Unknown languages fall back by family so future fences still get color.
 */
export function resolveHighlightLanguage(language: string, code = ''): string {
  const raw = language.trim().toLowerCase().replace(/^\./, '');
  if (!raw || PLAIN_LANGUAGES.has(raw)) return 'text';

  const aliased = LANGUAGE_ALIASES[raw] ?? raw;
  if (aliased === 'text' || PLAIN_LANGUAGES.has(aliased)) return 'text';
  if (SUPPORTED.size === 0 || SUPPORTED.has(aliased)) return aliased;

  // Extension / name heuristics when Prism doesn't know the id
  if (/\.(vue|svelte|astro|html?|svg|xml)$/i.test(raw) || /^(vue|svelte|astro|html|svg|xml)/.test(raw)) {
    return pickSupported('markup', 'xml', 'html');
  }
  if (/\.(tsx|jsx)$/i.test(raw)) return pickSupported('tsx', 'jsx', 'typescript', 'javascript');
  if (/\.(ts|mts|cts)$/i.test(raw)) return pickSupported('typescript', 'javascript');
  if (/\.(js|mjs|cjs)$/i.test(raw)) return pickSupported('javascript', 'typescript');
  if (/\.(css|scss|sass|less)$/i.test(raw)) return pickSupported(raw.replace('.', ''), 'css');
  if (/\.(json|jsonc|json5)$/i.test(raw)) return pickSupported('json', 'javascript');
  if (/\.(ya?ml)$/i.test(raw)) return pickSupported('yaml');
  if (/\.(md|mdx)$/i.test(raw)) return pickSupported('markdown', 'markup');
  if (/\.(sh|bash|zsh)$/i.test(raw)) return pickSupported('bash', 'shell-session');

  // Content sniffing for unlabeled / exotic fences
  const sample = code.trimStart().slice(0, 240);
  if (/^</.test(sample) || /<(script|template|style|div|html|svg)\b/i.test(sample)) {
    return pickSupported('markup', 'jsx', 'tsx');
  }
  if (/^(import|export|const|let|function|type|interface)\b/.test(sample)) {
    return pickSupported('typescript', 'javascript', 'tsx');
  }
  if (/^(package|fn |let mut|use )/m.test(sample)) return pickSupported('rust');
  if (/^(def |class |from |import )\b/.test(sample)) return pickSupported('python');

  // Last resort: still color as JS rather than flat grey
  return pickSupported('javascript', 'typescript', 'markup', 'text');
}

function pickSupported(...candidates: string[]): string {
  for (const candidate of candidates) {
    if (SUPPORTED.size === 0 || SUPPORTED.has(candidate) || candidate === 'text') return candidate;
  }
  return 'text';
}

function normalizeLanguage(language: string): string {
  return resolveHighlightLanguage(language);
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
  const content = code.trim();
  const normalized = resolveHighlightLanguage(language, content);

  if (normalized === 'text') {
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

// Keep old name available for callers/tests
export { normalizeLanguage };
