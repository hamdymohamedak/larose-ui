import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  'aria-label'?: string;
}

export function Breadcrumb({ items, 'aria-label': ariaLabel = 'Breadcrumb' }: BreadcrumbProps) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current ?? isLast;

          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isCurrent ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className={styles.link} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className={styles.linkButton} onClick={item.onClick}>
                  {item.label}
                </button>
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
