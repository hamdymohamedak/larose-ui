import type { ReactNode } from 'react';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

export interface ListSectionProps {
  header?: string;
  footer?: string;
  children: ReactNode;
}

export function ListSection({ header, footer, children }: ListSectionProps) {
  return (
    <section className={styles.section}>
      {header && <h3 className={styles.sectionHeader}>{header}</h3>}
      <ul className={styles.sectionBody}>{children}</ul>
      {footer && <p className={styles.sectionFooter}>{footer}</p>}
    </section>
  );
}
