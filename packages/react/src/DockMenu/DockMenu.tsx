import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import { mergeStyles } from '../shared/styleProps';
import type { ContextMenuEntry, ContextMenuItemConfig } from '../ContextMenu/types';
import { canShowDisabledItem, isItem } from '../ContextMenu/utils';
import type { DockMenuPosition, DockWindow } from './types';
import { buildDockMenuEntries, resolveDockMenuPosition } from './utils';
import styles from '@larose-ui/styles/components/DockMenu/DockMenu.module.css';

export interface DockMenuProps {
  appName: string;
  icon: ReactNode;
  /** Whether the app is currently running (shows window list + running actions). */
  isRunning?: boolean;
  openWindows?: DockWindow[];
  /** High-value actions when the app is running (e.g. New Window, Get New Mail). */
  runningEntries?: ContextMenuEntry[];
  /** Actions when the app is not running (e.g. Open). */
  closedEntries?: ContextMenuEntry[];
  onWindowSelect?: (window: DockWindow) => void;
  onEntrySelect?: (entry: ContextMenuItemConfig) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

function DockMenuItemRow({
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
 * macOS Dock menu — secondary-click an app icon for open windows and high-value actions.
 * @see https://developer.apple.com/design/human-interface-guidelines/dock-menus
 */
export function DockMenu({
  appName,
  icon,
  isRunning = true,
  openWindows = [],
  runningEntries = [],
  closedEntries = [],
  onWindowSelect,
  onEntrySelect,
  open,
  onOpenChange,
  className,
  style,
}: DockMenuProps) {
  const menuId = useId();
  const iconRef = useRef<HTMLButtonElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState<DockMenuPosition>({ x: 0, y: 0 });
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const preparedEntries = useMemo(
    () =>
      buildDockMenuEntries({
        isRunning,
        openWindows,
        runningEntries,
        closedEntries,
        onWindowSelect,
      }),
    [isRunning, openWindows, runningEntries, closedEntries, onWindowSelect],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const openAboveIcon = useCallback(() => {
    const rect = iconRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 240;
    const menuHeight = Math.min(360, 16 + preparedEntries.length * 36);
    setPosition(resolveDockMenuPosition(rect, menuWidth, menuHeight));
    setOpen(true);
  }, [preparedEntries.length, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (entry: ContextMenuItemConfig) => {
      onEntrySelect?.(entry);
      close();
    },
    [close, onEntrySelect],
  );

  const handleContextMenu = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      openAboveIcon();
    },
    [openAboveIcon],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen]);

  return (
    <>
      <button
        ref={iconRef}
        type="button"
        className={[styles.iconButton, className].filter(Boolean).join(' ')}
        style={style}
        aria-label={appName}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        data-running={isRunning ? 'true' : undefined}
        data-active={isOpen ? 'true' : undefined}
        onContextMenu={handleContextMenu}
      >
        <span className={styles.iconImage}>{icon}</span>
      </button>
      <ContextualMenuPortal
        open={isOpen}
        onClose={close}
        placement="top"
        backdropClassName={styles.menuBackdrop}
        surfaceId={menuId}
        surfaceClassName={styles.menu}
        surfaceRole="menu"
        aria-label={`${appName} Dock menu`}
        surfaceStyle={mergeStyles({ left: position.x, top: position.y }, style)}
        onSurfaceClick={(event) => event.stopPropagation()}
      >
        <ul className={styles.list}>
          {preparedEntries.map((entry, index) => {
            if (entry.type === 'separator') {
              return <li key={entry.id ?? `sep-${index}`} className={styles.separator} role="separator" />;
            }
            if (isItem(entry)) {
              return (
                <li key={entry.id}>
                  <DockMenuItemRow item={entry} onSelect={handleSelect} />
                </li>
              );
            }
            return null;
          })}
        </ul>
      </ContextualMenuPortal>
    </>
  );
}

export interface DockBarProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

/** Visual dock strip for grouping app icons in demos. */
export function DockBar({
  children,
  className,
  style,
  'aria-label': ariaLabel = 'Dock',
}: DockBarProps) {
  return (
    <div
      className={[styles.dockBar, className].filter(Boolean).join(' ')}
      style={style}
      role="toolbar"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

export type { DockMenuEntry, DockWindow, QuickActionItem } from './types';
export { buildDockMenuEntries, resolveDockMenuPosition, quickActionsToEntries } from './utils';
