import type { CSSProperties, ReactNode } from 'react';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

export interface ListSectionProps {
  header?: string;
  footer?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ListSection({ header, footer, children, className, style }: ListSectionProps) {
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')} style={style}>
      {header && <h3 className={styles.sectionHeader}>{header}</h3>}
      <ul className={styles.sectionBody}>{children}</ul>
      {footer && <p className={styles.sectionFooter}>{footer}</p>}
    </section>
  );
}
