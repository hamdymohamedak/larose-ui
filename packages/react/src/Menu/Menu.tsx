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
import { createPortal } from 'react-dom';
import { usePresence } from '../Motion/usePresence';
import motionStyles from '../Motion/motion.module.css';
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
  position,
  onSelect,
  onClose,
}: {
  menuId: string;
  entries: MenuEntry[];
  layout: MenuLayout;
  title?: string;
  position: MenuPosition;
  onSelect: (entry: MenuItemConfig) => void;
  onClose: () => void;
}) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { compact, list } = useMemo(() => splitCompactAndList(entries, layout), [entries, layout]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      id={menuId}
      className={styles.menu}
      role="menu"
      aria-label="Menu"
      style={{ left: position.x, top: position.y }}
      onClick={(event) => event.stopPropagation()}
    >
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
              <li key={entry.id} className={styles.submenuWrap}>
                <button
                  type="button"
                  className={styles.submenuTrigger}
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={activeSubmenu === entry.id}
                  disabled={entry.disabled}
                  onMouseEnter={() => setActiveSubmenu(entry.id)}
                  onFocus={() => setActiveSubmenu(entry.id)}
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
                  <ul className={styles.submenu} role="menu" aria-label={entry.label}>
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
    </div>
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

  const openFromTrigger = useCallback(() => {
    const rect =
      triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    const menuWidth = layout === 'large' ? 240 : 280;
    const menuHeight = Math.min(420, 48 + preparedEntries.length * 36 + (layout !== 'large' ? 64 : 0));
    const resolved = resolveMenuPanelPosition(rect, menuWidth, menuHeight);
    setPosition(resolved);
    setOpen(true);
  }, [layout, preparedEntries.length, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      const shouldClose = onEntrySelect?.(entry) !== false;
      if (shouldClose) close();
    },
    [close, onEntrySelect],
  );

  useEffect(() => {
    if (!isOpen || !children || open === undefined) return;
    const rect = triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 120, 32);
    const menuWidth = layout === 'large' ? 240 : 280;
    const menuHeight = Math.min(420, 48 + preparedEntries.length * 36 + (layout !== 'large' ? 64 : 0));
    setPosition(resolveMenuPanelPosition(rect, menuWidth, menuHeight));
  }, [children, isOpen, layout, open, preparedEntries.length]);

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

  const { shouldRender } = usePresence({ present: isOpen });

  const panel = (
    <MenuOverlay open={isOpen} placement={position.placement === 'above' ? 'top' : 'bottom'}>
      {dimBackground && <div className={styles.menuBackdrop} role="presentation" onClick={close} />}
      <MenuPanel
        menuId={menuId}
        entries={preparedEntries}
        layout={layout}
        title={title}
        position={position}
        onSelect={handleSelect}
        onClose={close}
      />
    </MenuOverlay>
  );

  if (!children) {
    return shouldRender ? createPortal(panel, document.body) : null;
  }

  if (!isValidElement(children)) {
    throw new Error('Menu expects a single React element child when used with a trigger.');
  }

  return (
    <>
      <span ref={triggerRef} className={styles.triggerWrap}>
        {bindTrigger(children as ReactElement<Record<string, unknown>>)}
      </span>
      {shouldRender && createPortal(panel, document.body)}
    </>
  );
}

function MenuOverlay({
  open,
  placement,
  children,
}: {
  open: boolean;
  placement: 'top' | 'bottom';
  children: React.ReactNode;
}) {
  const { phase, shouldRender, onAnimationEnd } = usePresence({ present: open });
  if (!shouldRender) return null;

  const motionClass =
    phase === 'entering' || phase === 'exiting'
      ? motionStyles[`popover-${phase}` as keyof typeof motionStyles]
      : undefined;

  return (
    <div data-presence={phase} data-side={placement} onAnimationEnd={onAnimationEnd}>
      <div className={motionClass} data-presence={phase} data-side={placement}>
        {children}
      </div>
    </div>
  );
}

export type { MenuEntry, MenuItemConfig, MenuLayout, MenuSubmenuConfig } from './types';
export { prepareMenuEntries, splitCompactAndList, MAX_SUBMENU_ITEMS } from './utils';
