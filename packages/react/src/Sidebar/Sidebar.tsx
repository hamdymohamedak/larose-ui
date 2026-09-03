import { useCallback, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { sanitizeNavigationUrl } from '@larose-ui/core';
import { SearchField, type SearchFieldProps } from '../SearchField/SearchField';
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';

function SidebarDisclosureChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={styles.disclosureChevron}
      data-expanded={expanded ? 'true' : 'false'}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 3.25 7.5 6 4.5 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  /** Override `--lr-sidebar-height` (default `100dvh`). */
  height?: string;
  /** Override `--lr-sidebar-max-height` (default `100dvh`). */
  maxHeight?: string;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

export function Sidebar({
  children,
  platform = 'macos',
  size = 'medium',
  hidden = false,
  glass = true,
  height,
  maxHeight,
  'aria-label': ariaLabel = 'Sidebar',
  className,
  style,
}: SidebarProps) {
  if (hidden) return null;

  const sidebarStyle = {
    ...style,
    ...(height ? { '--lr-sidebar-height': height } : undefined),
    ...(maxHeight ? { '--lr-sidebar-max-height': maxHeight } : undefined),
  } as CSSProperties;

  return (
    <aside
      className={[styles.sidebar, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      data-platform={platform}
      data-size={size}
      data-glass={glass ? 'true' : undefined}
      style={sidebarStyle}
    >
      {children}
    </aside>
  );
}

export interface SidebarHeaderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SidebarHeader({ children, className, style }: SidebarHeaderProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}

export type SidebarSearchProps = Omit<SearchFieldProps, 'placement'>;

export function SidebarSearch({ className, style, ...props }: SidebarSearchProps) {
  return (
    <div className={[styles.search, className].filter(Boolean).join(' ')} style={style}>
      <SearchField {...props} placement="sidebar-top" platform={props.platform ?? 'macos'} />
    </div>
  );
}

export interface SidebarNavProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function SidebarNav({
  children,
  className,
  style,
  'aria-label': ariaLabel = 'Sidebar navigation',
}: SidebarNavProps) {
  return (
    <nav className={[styles.nav, className].filter(Boolean).join(' ')} style={style} aria-label={ariaLabel}>
      {children}
    </nav>
  );
}

export interface SidebarGroupProps {
  label: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SidebarGroup({ label, children, className, style }: SidebarGroupProps) {
  return (
    <div className={className} style={style} role="group" aria-label={label}>
      <div className={styles.groupLabel}>{label}</div>
      {children}
    </div>
  );
}

export interface SidebarDisclosureSectionProps {
  label: string;
  defaultExpanded?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SidebarDisclosureSection({
  label,
  defaultExpanded = true,
  children,
  className,
  style,
}: SidebarDisclosureSectionProps) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const toggle = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  return (
    <div className={[styles.disclosureSection, className].filter(Boolean).join(' ')} style={style}>
      <button
        type="button"
        className={styles.disclosureTrigger}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={toggle}
      >
        <SidebarDisclosureChevron expanded={expanded} />
        <span className={styles.disclosureLabel}>{label}</span>
      </button>
      {expanded ? (
        <div id={panelId} className={styles.disclosureContent} role="group" aria-label={label}>
          {children}
        </div>
      ) : null}
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
  className?: string;
  style?: CSSProperties;
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
  className,
  style,
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
        <button type="button" className={[styles.item, className].filter(Boolean).join(' ')} style={style} data-state={state} disabled aria-current={active ? 'page' : undefined}>
          {content}
        </button>
      );
    }
    return (
      <a
        href={safeHref}
        className={[styles.item, className].filter(Boolean).join(' ')}
        style={style}
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
      className={[styles.item, className].filter(Boolean).join(' ')}
      style={style}
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
  className,
  style,
}: {
  hidden?: boolean;
  onToggle?: () => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      style={style}
      aria-pressed={!hidden}
      onClick={onToggle}
    >
      {hidden ? 'Show Sidebar' : 'Hide Sidebar'}
      <span className="sr-only">{label}</span>
    </button>
  );
}
