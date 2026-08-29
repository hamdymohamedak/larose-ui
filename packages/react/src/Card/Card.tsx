import type { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  title,
  description,
  children,
  footer,
  padding = 'md',
}: CardProps) {
  return (
    <article className={styles.card} data-padding={padding}>
      {(title || description) && (
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </header>
      )}
      {children && <div className={styles.body}>{children}</div>}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
}
