import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import { LONG_PRESS_MS } from '../ContextMenu/utils';
import type { QuickActionIconPlacement, QuickActionItem } from './types';
import {
  estimateQuickActionMenuHeight,
  prepareQuickActions,
  resolveQuickActionMenuPosition,
} from './utils';
import styles from '@larose-ui/styles/components/QuickActions/QuickActions.module.css';

export interface HomeScreenQuickActionsProps {
  appName: string;
  icon: ReactNode;
  actions: QuickActionItem[];
  /** Icon appears on leading or trailing edge depending on Home Screen position. */
  iconPlacement?: QuickActionIconPlacement;
  includeSystemActions?: boolean;
  systemActions?: QuickActionItem[];
  onActionSelect?: (action: QuickActionItem) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function QuickActionRow({
  action,
  iconPlacement,
  onSelect,
}: {
  action: QuickActionItem;
  iconPlacement: QuickActionIconPlacement;
  onSelect: (action: QuickActionItem) => void;
}) {
  return (
    <button
      type="button"
      className={styles.row}
      role="menuitem"
      data-icon-placement={iconPlacement}
      data-destructive={action.destructive ? 'true' : undefined}
      disabled={action.disabled}
      onClick={() => {
        if (action.disabled) return;
        action.onSelect?.();
        onSelect(action);
      }}
    >
      {action.icon && <span className={styles.rowIcon}>{action.icon}</span>}
      <span className={styles.textBlock}>
        <span className={styles.title}>{action.label}</span>
        {action.subtitle && <span className={styles.subtitle}>{action.subtitle}</span>}
      </span>
    </button>
  );
}

/**
 * iOS/iPadOS Home Screen quick actions — touch and hold an app icon for high-value tasks.
 * @see https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions
 */
export function HomeScreenQuickActions({
  appName,
  icon,
  actions,
  iconPlacement = 'leading',
  includeSystemActions = true,
  systemActions,
  onActionSelect,
  open,
  onOpenChange,
}: HomeScreenQuickActionsProps) {
  const menuId = useId();
  const iconRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<number | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const preparedActions = useMemo(
    () => prepareQuickActions(actions, { includeSystemActions, systemActions }),
    [actions, includeSystemActions, systemActions],
  );

  const appActions = useMemo(
    () => preparedActions.filter((action) => !action.system),
    [preparedActions],
  );
  const systemGroup = useMemo(
    () => preparedActions.filter((action) => action.system),
    [preparedActions],
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
    const menuWidth = 260;
    const menuHeight = estimateQuickActionMenuHeight(preparedActions.length);
    setPosition(resolveQuickActionMenuPosition(rect, menuWidth, menuHeight));
    setOpen(true);
  }, [preparedActions.length, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleSelect = useCallback(
    (action: QuickActionItem) => {
      onActionSelect?.(action);
      close();
    },
    [close, onActionSelect],
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
    <div className={styles.quickActionsWrap}>
      <div
        ref={iconRef}
        className={styles.appIcon}
        role="button"
        tabIndex={0}
        aria-label={appName}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse') return;
          clearLongPress();
          longPressTimer.current = window.setTimeout(openAboveIcon, LONG_PRESS_MS);
        }}
        onPointerUp={clearLongPress}
        onPointerCancel={clearLongPress}
        onPointerLeave={clearLongPress}
        onContextMenu={(event) => {
          event.preventDefault();
          openAboveIcon();
        }}
      >
        {icon}
      </div>
      <span className={styles.hint}>Touch and hold for quick actions</span>
      <ContextualMenuPortal
        open={isOpen}
        onClose={close}
        placement="top"
        backdropClassName={styles.menuBackdrop}
        surfaceId={menuId}
        surfaceClassName={styles.menu}
        surfaceRole="menu"
        aria-label={`${appName} quick actions`}
        surfaceStyle={{ left: position.x, top: position.y }}
        onSurfaceClick={(event) => event.stopPropagation()}
      >
        <ul className={styles.list}>
          {appActions.map((action) => (
            <li key={action.id}>
              <QuickActionRow
                action={action}
                iconPlacement={iconPlacement}
                onSelect={handleSelect}
              />
            </li>
          ))}
          {systemGroup.length > 0 && (
            <li className={styles.systemGroup} role="presentation">
              <ul className={styles.list}>
                {systemGroup.map((action) => (
                  <li key={action.id}>
                    <QuickActionRow
                      action={action}
                      iconPlacement={iconPlacement}
                      onSelect={handleSelect}
                    />
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </ContextualMenuPortal>
    </div>
  );
}
