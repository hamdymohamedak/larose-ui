import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Menu } from '../Menu/Menu';
import { prepareMenuEntries } from '../Menu/utils';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import {
  BackChevronIcon,
  CloseIcon,
  DocumentMenuIcon,
  OverflowIcon,
  SearchIcon,
} from './icons';
import type { ToolbarPlatform, ToolbarProps, ToolbarSectionProps, ToolbarItemProps, ToolbarGroupProps, ToolbarTitleProps, ToolbarSearchProps, ToolbarMoreButtonProps, ToolbarDocumentMenuProps, ToolbarProminentButtonProps, ToolbarBackButtonProps, ToolbarCloseButtonProps } from './types';
import {
  computeVisibleToolbarItemCount,
  entriesFromToolbarActions,
  resolveToolbarPlacement,
  shouldUseSystemOverflow,
  truncateToolbarTitle,
  warnIfToolbarTitleTooLong,
  warnIfTooManyToolbarGroups,
} from './utils';
import styles from './Toolbar.module.css';

const ToolbarPlatformContext = createContext<ToolbarPlatform>('macos');

function useToolbarPlatform(): ToolbarPlatform {
  return useContext(ToolbarPlatformContext);
}

function ToolbarFixedSpace() {
  return <span className={styles.fixedSpace} aria-hidden="true" />;
}

function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  const platform = useToolbarPlatform();
  return (
    <div className={[styles.group, className].filter(Boolean).join(' ')} data-platform={platform} role="group">
      {children}
    </div>
  );
}

function ToolbarTitle({ children, large = false, className }: ToolbarTitleProps) {
  useEffect(() => {
    warnIfToolbarTitleTooLong(children);
  }, [children]);

  return (
    <span
      className={[styles.title, large ? styles.titleLarge : undefined, className].filter(Boolean).join(' ')}
      title={children}
    >
      {truncateToolbarTitle(children, large ? 40 : 15)}
    </span>
  );
}

function ToolbarItem({
  label,
  icon,
  showLabel = false,
  prominent = false,
  disabled = false,
  onClick,
  className,
}: ToolbarItemProps) {
  const platform = useToolbarPlatform();

  if (prominent) {
    return (
      <ToolbarProminentButton onClick={onClick} disabled={disabled} className={className}>
        {label}
      </ToolbarProminentButton>
    );
  }

  return (
    <button
      type="button"
      className={[styles.item, className].filter(Boolean).join(' ')}
      data-platform={platform}
      data-show-label={showLabel ? 'true' : undefined}
      aria-label={showLabel ? undefined : label}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className={styles.itemIcon}>{icon}</span>}
      {showLabel && <span>{label}</span>}
    </button>
  );
}

function ToolbarBackButton({ onClick, disabled, companionLabel }: ToolbarBackButtonProps) {
  const platform = useToolbarPlatform();
  const showCompanion = platform === 'visionos' && companionLabel;

  return (
    <button
      type="button"
      className={styles.item}
      data-platform={platform}
      aria-label="Back"
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.itemIcon}>
        <BackChevronIcon />
      </span>
      {showCompanion && <span className={styles.companion}>{companionLabel}</span>}
    </button>
  );
}

function ToolbarCloseButton({ onClick, disabled }: ToolbarCloseButtonProps) {
  const platform = useToolbarPlatform();
  return (
    <button
      type="button"
      className={styles.item}
      data-platform={platform}
      aria-label="Close"
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.itemIcon}>
        <CloseIcon />
      </span>
    </button>
  );
}

function ToolbarSearch({
  value,
  placeholder = 'Search',
  onChange,
  'aria-label': ariaLabel = 'Search',
  className,
}: ToolbarSearchProps) {
  return (
    <label className={[styles.searchWrap, className].filter(Boolean).join(' ')}>
      <SearchIcon />
      <input
        type="search"
        className={styles.searchInput}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}

function ToolbarProminentButton({
  children,
  onClick,
  disabled,
  className,
}: ToolbarProminentButtonProps) {
  return (
    <button
      type="button"
      className={[styles.prominent, className].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarMoreButton({
  entries,
  'aria-label': ariaLabel = 'More',
  onAction,
  disabled,
}: ToolbarMoreButtonProps) {
  const prepared = useMemo(() => prepareMenuEntries(entries), [entries]);

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      onAction?.(entry.id);
    },
    [onAction],
  );

  return (
    <div className={styles.moreWrap}>
      <Menu entries={prepared} layout="large" dimBackground={false} onEntrySelect={handleSelect}>
        <button type="button" aria-label={ariaLabel} disabled={disabled}>
          <OverflowIcon />
        </button>
      </Menu>
    </div>
  );
}

function ToolbarDocumentMenu({
  entries,
  label = 'Document',
  onAction,
  disabled,
}: ToolbarDocumentMenuProps) {
  const prepared = useMemo(() => prepareMenuEntries(entries), [entries]);

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      onAction?.(entry.id);
    },
    [onAction],
  );

  return (
    <Menu entries={prepared} layout="large" dimBackground={false} onEntrySelect={handleSelect}>
      <button
        type="button"
        className={styles.item}
        aria-label={label}
        disabled={disabled}
      >
        <span className={styles.itemIcon}>
          <DocumentMenuIcon />
        </span>
      </button>
    </Menu>
  );
}

function ToolbarOverflowMenu({
  entries,
  'aria-label': ariaLabel = 'More toolbar items',
}: {
  entries: MenuEntry[];
  'aria-label'?: string;
}) {
  const prepared = useMemo(() => prepareMenuEntries(entries), [entries]);

  return (
    <div className={styles.moreWrap}>
      <Menu entries={prepared} layout="large" dimBackground={false}>
        <button type="button" aria-label={ariaLabel}>
          <OverflowIcon />
        </button>
      </Menu>
    </div>
  );
}

function isToolbarItemElement(child: ReactNode): child is ReactElement<ToolbarItemProps> {
  return isValidElement(child) && child.type === ToolbarItem;
}

function ToolbarSection({ placement, collapsible = placement === 'center', children, className }: ToolbarSectionProps) {
  const platform = useToolbarPlatform();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const childArray = useMemo(() => Children.toArray(children), [children]);

  const collapsibleItems = useMemo(
    () =>
      childArray.filter(
        (child) =>
          isToolbarItemElement(child) && (child.props.collapsible ?? collapsible),
      ) as ReactElement<ToolbarItemProps>[],
    [childArray, collapsible],
  );

  const staticChildren = useMemo(
    () =>
      childArray.filter(
        (child) =>
          !isToolbarItemElement(child) || !(child.props.collapsible ?? collapsible),
      ),
    [childArray, collapsible],
  );

  useLayoutEffect(() => {
    if (!collapsible || !shouldUseSystemOverflow(platform ?? 'macos')) {
      setVisibleCount(null);
      return;
    }

    const measure = () => {
      const container = containerRef.current;
      const measureRow = measureRef.current;
      if (!container || !measureRow) return;

      const itemNodes = Array.from(measureRow.children) as HTMLElement[];
      const widths = itemNodes.map((node) => node.getBoundingClientRect().width);
      const nextVisible = computeVisibleToolbarItemCount(container.clientWidth, widths);
      setVisibleCount(nextVisible);
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      setVisibleCount(collapsibleItems.length);
      return;
    }

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [collapsible, platform, collapsibleItems.length]);

  const overflowEntries = useMemo(() => {
    if (visibleCount === null || visibleCount >= collapsibleItems.length) return [];
    return entriesFromToolbarActions(
      collapsibleItems.slice(visibleCount).map((child) => ({
        id: child.props.id ?? child.props.label,
        label: child.props.label,
        icon: child.props.icon,
        disabled: child.props.disabled,
        onSelect: child.props.onClick,
      })),
    );
  }, [collapsibleItems, visibleCount]);

  const sectionClass =
    placement === 'leading'
      ? styles.leading
      : placement === 'center'
        ? styles.center
        : styles.trailing;

  const renderedCollapsible = collapsibleItems.map((child, index) => {
    const hidden =
      visibleCount !== null &&
      shouldUseSystemOverflow(platform ?? 'macos') &&
      index >= visibleCount;

    return cloneElement(child, {
      key: child.props.id ?? child.props.label,
      className: [child.props.className, hidden ? styles.collapsed : undefined].filter(Boolean).join(' ') || undefined,
    });
  });

  return (
    <div className={[sectionClass, className].filter(Boolean).join(' ')} ref={containerRef}>
      {collapsible && shouldUseSystemOverflow(platform ?? 'macos') && (
        <div className={styles.measureRow} ref={measureRef} aria-hidden="true">
          {collapsibleItems.map((child) =>
            cloneElement(child, { key: `measure-${child.props.label}` }),
          )}
        </div>
      )}
      <div className={placement === 'center' ? styles.centerInner : undefined}>
        {staticChildren}
        {renderedCollapsible}
        {overflowEntries.length > 0 && <ToolbarOverflowMenu entries={overflowEntries} />}
      </div>
    </div>
  );
}

/**
 * Toolbar — navigation, titles, search, and frequent actions along an edge of the view.
 * @see https://developer.apple.com/design/human-interface-guidelines/toolbars
 */
export function Toolbar({
  title,
  platform = 'macos',
  largeTitle = false,
  placement,
  hidden = false,
  className,
  children,
  'aria-label': ariaLabel,
}: ToolbarProps) {
  useEffect(() => {
    if (title) warnIfToolbarTitleTooLong(title);
  }, [title]);

  useEffect(() => {
    const groups = Children.toArray(children).filter(
      (child) => isValidElement(child) && child.type === ToolbarGroup,
    );
    warnIfTooManyToolbarGroups(groups.length);
  }, [children]);

  const resolvedPlacement = resolveToolbarPlacement(platform, placement);

  return (
    <ToolbarPlatformContext.Provider value={platform}>
      <div
        role="toolbar"
        aria-label={ariaLabel ?? (title ? `${title} toolbar` : 'Toolbar')}
        className={[styles.toolbar, className].filter(Boolean).join(' ')}
        data-platform={platform}
        data-placement={resolvedPlacement}
        data-large-title={largeTitle ? 'true' : undefined}
        data-hidden={hidden ? 'true' : undefined}
      >
        {title && !children && (
          <ToolbarSection placement="leading">
            <ToolbarTitle large={largeTitle}>{title}</ToolbarTitle>
          </ToolbarSection>
        )}
        {children}
      </div>
    </ToolbarPlatformContext.Provider>
  );
}

Toolbar.Leading = function ToolbarLeading(props: Omit<ToolbarSectionProps, 'placement'>) {
  return <ToolbarSection {...props} placement="leading" collapsible={false} />;
};

Toolbar.Center = function ToolbarCenter(props: Omit<ToolbarSectionProps, 'placement'>) {
  return <ToolbarSection {...props} placement="center" collapsible />;
};

Toolbar.Trailing = function ToolbarTrailing(props: Omit<ToolbarSectionProps, 'placement'>) {
  return <ToolbarSection {...props} placement="trailing" collapsible={false} />;
};

Toolbar.Item = ToolbarItem;
Toolbar.Group = ToolbarGroup;
Toolbar.Title = ToolbarTitle;
Toolbar.Back = ToolbarBackButton;
Toolbar.Close = ToolbarCloseButton;
Toolbar.Search = ToolbarSearch;
Toolbar.More = ToolbarMoreButton;
Toolbar.DocumentMenu = ToolbarDocumentMenu;
Toolbar.Prominent = ToolbarProminentButton;
Toolbar.Spacer = ToolbarFixedSpace;

export {
  ToolbarItem,
  ToolbarGroup,
  ToolbarTitle,
  ToolbarBackButton,
  ToolbarCloseButton,
  ToolbarSearch,
  ToolbarMoreButton,
  ToolbarDocumentMenu,
  ToolbarProminentButton,
  ToolbarFixedSpace,
  ToolbarSection,
};

export type {
  ToolbarProps,
  ToolbarItemProps,
  ToolbarGroupProps,
  ToolbarTitleProps,
  ToolbarSearchProps,
  ToolbarMoreButtonProps,
  ToolbarDocumentMenuProps,
  ToolbarProminentButtonProps,
  ToolbarBackButtonProps,
  ToolbarCloseButtonProps,
  ToolbarSectionProps,
} from './types';
