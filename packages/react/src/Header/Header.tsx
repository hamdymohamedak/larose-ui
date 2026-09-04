import type { CSSProperties, ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Header/Header.module.css';

export interface HeaderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Header({ children, className, style }: HeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </header>
  );
}

export interface HeaderTitleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function HeaderTitle({ children, className, style }: HeaderTitleProps) {
  return (
    <h1 className={[styles.title, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </h1>
  );
}

export interface HeaderBrandProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function HeaderBrand({ children, className, style }: HeaderBrandProps) {
  return (
    <div className={[styles.brand, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}

export interface HeaderActionsProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function HeaderActions({ children, className, style }: HeaderActionsProps) {
  return (
    <div className={[styles.actions, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}
