import type { ReactNode } from 'react';
import { sanitizeNavigationUrl } from '@larose-ui/core';
import { SearchField, type SearchFieldProps } from '../SearchField/SearchField';
import { DisclosureGroup } from '../Disclosure/DisclosureGroup';
import styles from './Sidebar.module.css';

export type SidebarPlatform = 'ios' | 'ipados' | 'macos' | 'visionos';
export type SidebarSize = 'small' | 'medium' | 'large';

export interface SidebarProps {
  children: ReactNode;
  platform?: SidebarPlatform;
  size?: SidebarSize;
  hidden?: boolean;
  onHiddenChange?: (hidden: boolean) => void;
  /** Allow content to extend beneath the sidebar (Liquid Glass). */
  glass?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function Sidebar({
  children,
  platform = 'macos',
  size = 'medium',
  hidden = false,
  glass = true,
  'aria-label': ariaLabel = 'Sidebar',
  className,
}: SidebarProps) {
  if (hidden) return null;

  return (
    <aside
      className={[styles.sidebar, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      data-platform={platform}
      data-size={size}
      data-glass={glass ? 'true' : undefined}
    >
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

export type SidebarSearchProps = Omit<SearchFieldProps, 'placement'>;

export function SidebarSearch(props: SidebarSearchProps) {
  return (
    <div className={styles.search}>
      <SearchField {...props} placement="sidebar-top" platform={props.platform ?? 'macos'} />
    </div>
  );
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

export interface SidebarDisclosureSectionProps {
  label: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export function SidebarDisclosureSection({
  label,
  defaultExpanded = true,
  children,
}: SidebarDisclosureSectionProps) {
  return (
    <div className={styles.disclosureSection}>
      <DisclosureGroup label={label} defaultExpanded={defaultExpanded}>
        <div className={styles.disclosureContent}>{children}</div>
      </DisclosureGroup>
    </div>
  );
}

export interface SidebarItemProps {
  children: ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: number | '!';
  /** Fixed accent color for special icons (e.g. VIP in Mail). Use sparingly. */
  accentColor?: string;
  onClick?: () => void;
}

export function SidebarItem({
  children,
  href,
  active = false,
  disabled = false,
  icon,
  badge,
  accentColor,
  onClick,
}: SidebarItemProps) {
  const state = disabled ? 'disabled' : active ? 'active' : 'inactive';
  const content = (
    <>
      {icon && (
        <span className={styles.itemIcon} style={accentColor ? { color: accentColor } : undefined}>
          {icon}
        </span>
      )}
      <span className={styles.itemLabel}>{children}</span>
      {badge !== undefined && (
        <span className={styles.itemBadge} aria-label={typeof badge === 'number' ? `${badge} items` : 'Important'}>
          {badge === '!' ? '!' : badge}
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    const safeHref = sanitizeNavigationUrl(href);
    if (!safeHref) {
      return (
        <button type="button" className={styles.item} data-state={state} disabled aria-current={active ? 'page' : undefined}>
          {content}
        </button>
      );
    }
    return (
      <a
        href={safeHref}
        className={styles.item}
        data-state={state}
        aria-current={active ? 'page' : undefined}
      >
        {content}
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
      {content}
    </button>
  );
}

export function SidebarToggle({
  hidden,
  onToggle,
  label = 'Toggle sidebar',
}: {
  hidden?: boolean;
  onToggle?: () => void;
  label?: string;
}) {
  return (
    <button type="button" className={styles.toggle} aria-pressed={!hidden} onClick={onToggle}>
      {hidden ? 'Show Sidebar' : 'Hide Sidebar'}
      <span className="sr-only">{label}</span>
    </button>
  );
}
