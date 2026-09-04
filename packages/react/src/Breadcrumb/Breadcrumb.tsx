import type { CSSProperties } from 'react';
import styles from '@larose-ui/styles/components/Breadcrumb/Breadcrumb.module.css';
import { sanitizeNavigationUrl } from '@larose-ui/core';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function Breadcrumb({
  items,
  className,
  style,
  'aria-label': ariaLabel = 'Breadcrumb',
}: BreadcrumbProps) {
  return (
    <nav
      className={[styles.nav, className].filter(Boolean).join(' ')}
      style={style}
      aria-label={ariaLabel}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? isLast;
          const safeHref = sanitizeNavigationUrl(item.href);

          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isCurrent ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : safeHref ? (
                <a href={safeHref} className={styles.link} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button type="button" className={styles.linkButton} onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span className={styles.current}>{item.label}</span>
              )}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
