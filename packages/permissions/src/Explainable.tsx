import type { ReactNode } from 'react';

export type ExplainableVariant = 'disabled' | 'readonly' | 'forbidden' | 'unavailable';

export interface ExplainableProps {
  reason: string;
  variant?: ExplainableVariant;
  children: ReactNode;
}

export function Explainable({
  reason,
  variant = 'disabled',
  children,
}: ExplainableProps) {
  return (
    <span
      className="lr-explainable"
      data-variant={variant}
      title={reason}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.25rem' }}
    >
      {children}
      <span
        role="note"
        style={{
          fontSize: 'var(--lr-font-size-xs, 0.75rem)',
          color: 'var(--lr-color-text-muted, #64748b)',
          maxWidth: '16rem',
        }}
      >
        {reason}
      </span>
    </span>
  );
}
