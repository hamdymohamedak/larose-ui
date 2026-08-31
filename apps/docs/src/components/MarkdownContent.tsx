import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/components/CodeBlock';

export interface MarkdownContentProps {
  source: string;
}

function isRelativeGuideLink(href: string): string | null {
  if (href.startsWith('http') || href.startsWith('/')) return null;
  const fileName = href.split('/').pop()?.replace(/\.md$/i, '').toLowerCase() ?? '';
  const guideRoutes: Record<string, string> = {
    runtime_2: '/docs/guides/runtime',
    runtime: '/docs/guides/runtime',
    architecture: '/docs/guides/architecture',
    customization: '/docs/guides/customization',
    motion_system: '/docs/guides/motion',
    migration: '/docs/guides/migration',
    observability_2: '/docs/guides/observability',
    devtools_2: '/docs/guides/devtools',
    ai_runtime: '/docs/guides/ai',
    roadmap: '/docs/guides/roadmap',
    refined_design_language: '/docs/guides/design-language',
  };
  return guideRoutes[fileName] ?? null;
}

export function MarkdownContent({ source }: MarkdownContentProps) {
  if (!source.trim()) {
    return (
      <article className="docs-content">
        <p>Guide content is unavailable.</p>
      </article>
    );
  }

  return (
    <article className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          a: ({ href = '', children }) => {
            if (href.startsWith('/')) {
              return <Link to={href}>{children}</Link>;
            }
            const guidePath = isRelativeGuideLink(href);
            if (guidePath) {
              return <Link to={guidePath}>{children}</Link>;
            }
            return (
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {children}
              </a>
            );
          },
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const text = String(children).replace(/\n$/, '');
            const match = /language-([\w-]+)/.exec(className ?? '');
            if (match) {
              return <CodeBlock code={text} language={match[1]} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="docs-table-wrap">
              <table>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
