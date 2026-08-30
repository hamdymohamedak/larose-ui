import type { ElementType, ReactNode } from 'react';
import type { TypographyRole } from '@larose-ui/core';
import styles from './Typography.module.css';

const defaultElement: Record<TypographyRole, ElementType> = {
  display: 'h1',
  largeTitle: 'h1',
  title: 'h2',
  headline: 'h3',
  body: 'p',
  callout: 'p',
  subheadline: 'p',
  footnote: 'small',
  caption: 'span',
};

export interface TypographyProps {
  role?: TypographyRole;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

export function Typography({
  role = 'body',
  as,
  children,
  className,
  muted = false,
}: TypographyProps) {
  const Component = as ?? defaultElement[role];

  return (
    <Component
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-lr-type={role}
      data-muted={muted ? 'true' : undefined}
    >
      {children}
    </Component>
  );
}
