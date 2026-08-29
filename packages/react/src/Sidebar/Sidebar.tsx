import type { ReactNode } from 'react';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
}

export function Sidebar({
  children,
  'aria-label': ariaLabel = 'Sidebar',
  className,
}: SidebarProps) {
  return (
    <aside className={[styles.sidebar, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      {children}
    </aside>
  );
}

export interface SidebarHeaderProps {
  children: ReactNode;
}

export function SidebarHeader({ children }: SidebarHeaderProps) {
  return <div className={styles.header}>{children}</div>;
}

export interface SidebarNavProps {
  children: ReactNode;
  'aria-label'?: string;
}

export function SidebarNav({ children, 'aria-label': ariaLabel = 'Sidebar navigation' }: SidebarNavProps) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      {children}
    </nav>
  );
}

export interface SidebarGroupProps {
  label: string;
  children: ReactNode;
}

export function SidebarGroup({ label, children }: SidebarGroupProps) {
  return (
    <div role="group" aria-label={label}>
      <div className={styles.groupLabel}>{label}</div>
      {children}
    </div>
  );
}

export interface SidebarItemProps {
  children: ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  children,
  href,
  active = false,
  disabled = false,
  onClick,
}: SidebarItemProps) {
  const state = disabled ? 'disabled' : active ? 'active' : 'inactive';

  if (href && !disabled) {
    return (
      <a href={href} className={styles.item} data-state={state} aria-current={active ? 'page' : undefined}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={styles.item}
      data-state={state}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
