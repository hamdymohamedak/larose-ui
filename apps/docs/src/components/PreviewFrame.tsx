import type { ReactNode } from 'react';

export interface PreviewFrameProps {
  title?: string;
  children: ReactNode;
  /** block = full-width column layout for tables, charts, and shells */
  layout?: 'inline' | 'block';
}

export function PreviewFrame({ title = 'Preview', children, layout = 'inline' }: PreviewFrameProps) {
  return (
    <section
      aria-label={title}
      style={{
        margin: '1.5rem 0',
        padding: '1.25rem',
        borderRadius: 'var(--lr-radius-lg)',
        border: '1px solid var(--lr-color-border)',
        background: 'var(--lr-color-surface)',
        boxShadow: 'var(--lr-shadow-sm)',
      }}
    >
      <div
        style={{
          marginBottom: '0.875rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--lr-color-text-muted)',
        }}
      >
        {title}
      </div>
      <div
        style={
          layout === 'block'
            ? { display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }
            : { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }
        }
      >
        {children}
      </div>
    </section>
  );
}
