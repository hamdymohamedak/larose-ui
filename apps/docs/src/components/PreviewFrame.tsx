import type { ReactNode } from 'react';

export interface PreviewFrameProps {
  title?: string;
  children: ReactNode;
  /** block = full-width column layout for tables, charts, and shells */
  layout?: 'inline' | 'block';
}

export function PreviewFrame({ title = 'Preview', children, layout = 'inline' }: PreviewFrameProps) {
  return (
    <section aria-label={title} className="docs-preview-frame">
      <div className="docs-preview-frame__title">{title}</div>
      <div className={`docs-preview-frame__body docs-preview-frame__body--${layout}`}>{children}</div>
    </section>
  );
}
