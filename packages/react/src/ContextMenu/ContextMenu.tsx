import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import type { ContextMenuEntry, ContextMenuItemConfig, ContextMenuPosition } from './types';
import {
  canShowDisabledItem,
  isItem,
  isSubmenu,
  LONG_PRESS_MS,
  prepareContextMenuEntries,
  resolveMenuPosition,
  warnIfTooManyGroups,
} from './utils';
import styles from './ContextMenu.module.css';

export interface ContextMenuProps {
  children: ReactElement;
  entries: ContextMenuEntry[];
  title?: string;
  preview?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEntrySelect?: (entry: ContextMenuItemConfig) => void;
  /** Enable long-press / touch-and-hold in addition to secondary click. */
  longPress?: boolean;
  dimBackground?: boolean;
}

function ContextMenuPanel({
  menuId: _menuId,
  title,
  preview,
  entries,
  onSelect,
}: {
  menuId: string;
  title?: string;
  preview?: ReactNode;
  entries: ContextMenuEntry[];
  onSelect: (entry: ContextMenuItemConfig) => void;
}) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <>
      {title && <p className={styles.title}>{title}</p>}
      {preview && <div className={styles.preview}>{preview}</div>}
      <ul className={styles.list}>
        {entries.map((entry, index) => {
          if (entry.type === 'separator') {
            return <li key={entry.id ?? `sep-${index}`} className={styles.separator} role="separator" />;
          }

          if (isSubmenu(entry)) {
            return (
              <li key={entry.id} className={styles.submenuWrap}>
                <button
                  type="button"
                  className={styles.submenuTrigger}
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={activeSubmenu === entry.id}
                  onMouseEnter={() => setActiveSubmenu(entry.id)}
                  onFocus={() => setActiveSubmenu(entry.id)}
                >
                  <span className={styles.label}>{entry.label}</span>
                  <span className={styles.submenuChevron} aria-hidden="true">
                    ›
                  </span>
                </button>
                {activeSubmenu === entry.id && (
                  <ul className={styles.submenu} role="menu" aria-label={entry.label}>
                    {entry.items.map((item) => (
                      <li key={item.id}>
                        <ContextMenuItemRow item={item} onSelect={onSelect} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          if (isItem(entry)) {
            return (
              <li key={entry.id}>
                <ContextMenuItemRow item={entry} onSelect={onSelect} />
              </li>
            );
          }

          return null;
        })}
      </ul>
    </>
  );
}

function ContextMenuItemRow({
  item,
  onSelect,
}: {
  item: ContextMenuItemConfig;
  onSelect: (entry: ContextMenuItemConfig) => void;
}) {
  const disabled = Boolean(item.disabled && canShowDisabledItem(item));

  return (
    <button
      type="button"
      className={styles.item}
      role="menuitem"
      data-destructive={item.destructive ? 'true' : undefined}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        item.onSelect?.();
        onSelect(item);
      }}
    >
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      <span className={styles.label}>{item.label}</span>
    </button>
  );
}

/**
 * Context menu for contextual commands on views and content.
 * @see https://developer.apple.com/design/human-interface-guidelines/context-menus
 */
export function ContextMenu({
  children,
  entries,
  title,
  preview,
  open,
  onOpenChange,
  onEntrySelect,
  longPress = true,
  dimBackground = true,
}: ContextMenuProps) {
  const menuId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0, placement: 'below' });
  const longPressTimer = useRef<number | null>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const preparedEntries = useMemo(() => prepareContextMenuEntries(entries), [entries]);

  useEffect(() => {
    warnIfTooManyGroups(preparedEntries);
  }, [preparedEntries]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const openAt = useCallback(
    (clientX: number, clientY: number) => {
      const menuWidth = 240;
      const menuHeight = Math.min(360, 48 + preparedEntries.length * 36 + (preview ? 120 : 0));
      const resolved = resolveMenuPosition(
        clientX,
        clientY,
        menuWidth,
        menuHeight,
        window.innerWidth,
        window.innerHeight,
      );
      setPosition(resolved);
      setOpen(true);
    },
    [preparedEntries.length, preview, setOpen],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (entry: ContextMenuItemConfig) => {
      onEntrySelect?.(entry);
      close();
    },
    [close, onEntrySelect],
  );

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const bindTrigger = (child: ReactElement<Record<string, unknown>>) =>
    cloneElement(child, {
      onContextMenu: (event: ReactMouseEvent<Element>) => {
        (child.props.onContextMenu as ((event: ReactMouseEvent<Element>) => void) | undefined)?.(event);
        event.preventDefault();
        openAt(event.clientX, event.clientY);
      },
      onPointerDown: (event: React.PointerEvent<Element>) => {
        (child.props.onPointerDown as ((event: React.PointerEvent<Element>) => void) | undefined)?.(event);
        if (!longPress || event.pointerType === 'mouse') return;
        clearLongPress();
        longPressTimer.current = window.setTimeout(() => {
          openAt(event.clientX, event.clientY);
        }, LONG_PRESS_MS);
      },
      onPointerUp: (event: React.PointerEvent<Element>) => {
        (child.props.onPointerUp as ((event: React.PointerEvent<Element>) => void) | undefined)?.(event);
        clearLongPress();
      },
      onPointerCancel: (event: React.PointerEvent<Element>) => {
        (child.props.onPointerCancel as ((event: React.PointerEvent<Element>) => void) | undefined)?.(event);
        clearLongPress();
      },
      onPointerLeave: (event: React.PointerEvent<Element>) => {
        (child.props.onPointerLeave as ((event: React.PointerEvent<Element>) => void) | undefined)?.(event);
        clearLongPress();
      },
    });

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen]);

  if (!isValidElement(children)) {
    throw new Error('ContextMenu expects a single React element child.');
  }

  return (
    <>
      <span className={styles.triggerWrap}>{bindTrigger(children as ReactElement<Record<string, unknown>>)}</span>
      <ContextualMenuPortal
        open={isOpen}
        onClose={close}
        placement={position.placement === 'above' ? 'top' : 'bottom'}
        showBackdrop={dimBackground}
        backdropClassName={styles.menuBackdrop}
        surfaceId={menuId}
        surfaceClassName={styles.menu}
        surfaceRole="menu"
        aria-label={title ?? 'Context menu'}
        surfaceStyle={{ left: position.x, top: position.y }}
        onSurfaceClick={(event) => event.stopPropagation()}
      >
        <ContextMenuPanel
          menuId={menuId}
          title={title}
          preview={preview}
          entries={preparedEntries}
          onSelect={handleSelect}
        />
      </ContextualMenuPortal>
    </>
  );
}

export type { ContextMenuEntry, ContextMenuItemConfig } from './types';
export {
  formatContextMenuTitle,
  prepareContextMenuEntries,
  MAX_CONTEXT_MENU_GROUPS,
} from './utils';
