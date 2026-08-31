import type { ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Header/Header.module.css';

export interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export function Header({ children, className }: HeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(' ')}>
      {children}
    </header>
  );
}

export interface HeaderTitleProps {
  children: ReactNode;
}

export function HeaderTitle({ children }: HeaderTitleProps) {
  return <h1 className={styles.title}>{children}</h1>;
}

export interface HeaderBrandProps {
  children: ReactNode;
}

export function HeaderBrand({ children }: HeaderBrandProps) {
  return <div className={styles.brand}>{children}</div>;
}

export interface HeaderActionsProps {
  children: ReactNode;
}

export function HeaderActions({ children }: HeaderActionsProps) {
  return <div className={styles.actions}>{children}</div>;
}
