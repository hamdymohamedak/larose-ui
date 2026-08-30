import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import type { MenuEntry, MenuItemConfig, MenuLayout, MenuPosition } from './types';
import {
  isMenuItem,
  isMenuSubmenu,
  prepareMenuEntries,
  resolveMenuPanelPosition,
  splitCompactAndList,
} from './utils';
import styles from './Menu.module.css';

export interface MenuProps {
  children?: ReactElement;
  entries: MenuEntry[];
  layout?: MenuLayout;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEntrySelect?: (entry: MenuItemConfig) => boolean | void;
  dimBackground?: boolean;
}

function MenuItemRow({
  item,
  onSelect,
}: {
  item: MenuItemConfig;
  onSelect: (entry: MenuItemConfig) => void;
}) {
  return (
    <button
      type="button"
      className={styles.item}
      role="menuitem"
      data-destructive={item.destructive ? 'true' : undefined}
      disabled={item.disabled}
      aria-checked={item.selected ? true : undefined}
      onClick={() => {
        if (item.disabled) return;
        item.onSelect?.();
        onSelect(item);
      }}
    >
      <span className={styles.checkmark} aria-hidden="true">
        {item.selected ? '✓' : ''}
      </span>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      <span className={styles.label}>{item.label}</span>
      {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
    </button>
  );
}

function MenuPanel({
  menuId,
  entries,
  layout,
  title,
  onSelect,
  onClose,
}: {
  menuId: string;
  entries: MenuEntry[];
  layout: MenuLayout;
  title?: string;
  onSelect: (entry: MenuItemConfig) => void;
  onClose: () => void;
}) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuSides, setSubmenuSides] = useState<Record<string, 'end' | 'start'>>({});
  const submenuTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { compact, list } = useMemo(() => splitCompactAndList(entries, layout), [entries, layout]);

  const resolveSubmenuSide = useCallback((submenuId: string) => {
    const trigger = submenuTriggerRefs.current[submenuId];
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const submenuWidth = 240;
    const gap = 8;
    const fitsEnd = rect.right + submenuWidth + gap <= window.innerWidth;
    const fitsStart = rect.left - submenuWidth - gap >= 0;
    const side: 'end' | 'start' = fitsEnd || !fitsStart ? 'end' : 'start';

    setSubmenuSides((current) =>
      current[submenuId] === side ? current : { ...current, [submenuId]: side },
    );
  }, []);

  const openSubmenu = useCallback(
    (submenuId: string) => {
      setActiveSubmenu(submenuId);
      requestAnimationFrame(() => resolveSubmenuSide(submenuId));
    },
    [resolveSubmenuSide],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      {title && <p className={styles.menuTitle}>{title}</p>}
      {compact.length > 0 && (
        <div className={styles.compactRow} role="group" aria-label="Primary actions">
          {compact.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.compactTile}
              data-layout={layout}
              disabled={item.disabled}
              aria-label={layout === 'small' ? item.label : undefined}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect?.();
                onSelect(item);
              }}
            >
              {item.icon && <span className={styles.compactIcon}>{item.icon}</span>}
              {layout === 'medium' && <span className={styles.compactLabel}>{item.label}</span>}
            </button>
          ))}
        </div>
      )}
      <ul className={styles.list}>
        {list.map((entry, index) => {
          if (entry.type === 'separator') {
            return <li key={entry.id ?? `sep-${index}`} className={styles.separator} role="separator" />;
          }

          if (isMenuSubmenu(entry)) {
            return (
              <li
                key={entry.id}
                className={styles.submenuWrap}
                data-active={activeSubmenu === entry.id ? 'true' : undefined}
              >
                <button
                  ref={(node) => {
                    submenuTriggerRefs.current[entry.id] = node;
                  }}
                  type="button"
                  className={styles.submenuTrigger}
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={activeSubmenu === entry.id}
                  disabled={entry.disabled}
                  onMouseEnter={() => openSubmenu(entry.id)}
                  onFocus={() => openSubmenu(entry.id)}
                >
                  <span className={styles.checkmark} aria-hidden="true" />
                  {entry.icon && <span className={styles.icon}>{entry.icon}</span>}
                  <span className={styles.label}>{entry.label}</span>
                  {entry.shortcut && <span className={styles.shortcut}>{entry.shortcut}</span>}
                  <span className={styles.submenuChevron} aria-hidden="true">
                    ›
                  </span>
                </button>
                {activeSubmenu === entry.id && (
                  <ul
                    className={styles.submenu}
                    role="menu"
                    aria-label={entry.label}
                    data-side={submenuSides[entry.id] === 'start' ? 'start' : 'end'}
                  >
                    {entry.items.map((item) => (
                      <li key={item.id}>
                        <MenuItemRow item={item} onSelect={onSelect} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          if (isMenuItem(entry)) {
            return (
              <li key={entry.id}>
                <MenuItemRow item={entry} onSelect={onSelect} />
              </li>
            );
          }

          return null;
        })}
      </ul>
    </>
  );
}

/**
 * General-purpose menu with small, medium, and large iOS/iPadOS layouts.
 * @see https://developer.apple.com/design/human-interface-guidelines/menus
 */
export function Menu({
  children,
  entries,
  layout = 'large',
  title,
  open,
  onOpenChange,
  onEntrySelect,
  dimBackground = true,
}: MenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0, placement: 'below' });
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const preparedEntries = useMemo(() => prepareMenuEntries(entries), [entries]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const estimateMenuHeight = useCallback(() => {
    return Math.min(420, 48 + preparedEntries.length * 36 + (layout !== 'large' ? 64 : 0));
  }, [layout, preparedEntries.length]);

  const estimateMenuWidth = useCallback(() => {
    return layout === 'large' ? 240 : 280;
  }, [layout]);

  const centerMenuOnViewport = useCallback(() => {
    const menuWidth = estimateMenuWidth();
    const menuHeight = estimateMenuHeight();
    setPosition({
      x: Math.max(16, (window.innerWidth - menuWidth) / 2),
      y: Math.max(16, (window.innerHeight - menuHeight) / 2),
      placement: 'below',
    });
  }, [estimateMenuHeight, estimateMenuWidth]);

  const openFromTrigger = useCallback(() => {
    const rect =
      triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    const menuWidth = estimateMenuWidth();
    const menuHeight = estimateMenuHeight();
    const resolved = resolveMenuPanelPosition(rect, menuWidth, menuHeight);
    setPosition(resolved);
    setOpen(true);
  }, [estimateMenuHeight, estimateMenuWidth, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      const shouldClose = onEntrySelect?.(entry) !== false;
      if (shouldClose) close();
    },
    [close, onEntrySelect],
  );

  useEffect(() => {
    if (!isOpen) return;

    if (!children) {
      centerMenuOnViewport();
      return;
    }

    if (open === undefined) return;

    const rect = triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    const menuWidth = estimateMenuWidth();
    const menuHeight = estimateMenuHeight();
    setPosition(resolveMenuPanelPosition(rect, menuWidth, menuHeight));
  }, [
    centerMenuOnViewport,
    children,
    estimateMenuHeight,
    estimateMenuWidth,
    isOpen,
    open,
  ]);

  const bindTrigger = (child: ReactElement<Record<string, unknown>>) =>
    cloneElement(child, {
      onClick: (event: React.MouseEvent<Element>) => {
        (child.props.onClick as ((event: React.MouseEvent<Element>) => void) | undefined)?.(event);
        openFromTrigger();
      },
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? menuId : undefined,
    });

  const menuPortal = (
    <ContextualMenuPortal
      open={isOpen}
      onClose={close}
      placement={position.placement === 'above' ? 'top' : 'bottom'}
      showBackdrop={dimBackground}
      backdropClassName={styles.menuBackdrop}
      surfaceId={menuId}
      surfaceClassName={styles.menu}
      surfaceRole="menu"
      aria-label="Menu"
      surfaceStyle={{ left: position.x, top: position.y }}
      onSurfaceClick={(event) => event.stopPropagation()}
    >
      <MenuPanel
        menuId={menuId}
        entries={preparedEntries}
        layout={layout}
        title={title}
        onSelect={handleSelect}
        onClose={close}
      />
    </ContextualMenuPortal>
  );

  if (!children) {
    return menuPortal;
  }

  if (!isValidElement(children)) {
    throw new Error('Menu expects a single React element child when used with a trigger.');
  }

  return (
    <>
      <span ref={triggerRef} className={styles.triggerWrap}>
        {bindTrigger(children as ReactElement<Record<string, unknown>>)}
      </span>
      {menuPortal}
    </>
  );
}

export type { MenuEntry, MenuItemConfig, MenuLayout, MenuSubmenuConfig } from './types';
export { prepareMenuEntries, splitCompactAndList, MAX_SUBMENU_ITEMS } from './utils';
