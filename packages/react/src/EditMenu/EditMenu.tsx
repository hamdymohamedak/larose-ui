import {
  cloneElement,
  Fragment,
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
  type CSSProperties,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import { mergeStyles } from '../shared/styleProps';
import type {
  EditMenuContext,
  EditMenuInputMode,
  EditMenuItemConfig,
  EditMenuPosition,
  EditMenuResolvedAction,
  EditMenuVariant,
  StandardEditActionId,
} from './types';
import {
  buildEditMenuActions,
  canExpandCompactMenu,
  compactVisibleCount,
  filterVisibleEditMenuActions,
  LONG_PRESS_MS,
  resolveEditMenuPosition,
  resolveEditMenuVariant,
} from './utils';
import styles from '@larose-ui/styles/components/EditMenu/EditMenu.module.css';

export interface EditMenuProps {
  children: ReactElement;
  context: EditMenuContext;
  /** Custom commands listed near related system-provided ones. */
  customActions?: EditMenuItemConfig[];
  /** Include standard Cut, Copy, Paste, etc. Defaults to true. */
  includeStandardActions?: boolean;
  variant?: EditMenuVariant;
  inputMode?: EditMenuInputMode;
  placement?: 'above' | 'below' | 'auto';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (actionId: string) => void;
  onStandardAction?: (actionId: StandardEditActionId) => void;
  /** Touch-and-hold / long-press to reveal compact edit menu. */
  longPress?: boolean;
  dimBackground?: boolean;
  className?: string;
  style?: CSSProperties;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" width="0.75rem" height="0.75rem" aria-hidden="true">
      <path d="M4 2.5 8 6l-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditMenuPointer({ placement }: { placement: EditMenuPosition['placement'] }) {
  return (
    <span
      className={styles.pointer}
      aria-hidden="true"
      data-placement={placement}
      style={{ ['--lr-edit-menu-pointer-offset' as string]: 'var(--lr-edit-menu-pointer-x)' }}
    />
  );
}

function CompactEditMenuContent({
  actions,
  menuId,
  onSelect,
  onExpand,
  canExpand,
}: {
  actions: EditMenuResolvedAction[];
  menuId: string;
  onSelect: (action: EditMenuResolvedAction) => void;
  onExpand: () => void;
  canExpand: boolean;
}) {
  const visible = actions.slice(0, compactVisibleCount(actions.length));

  return (
    <div id={menuId} className={styles.compactBar}>
        {visible.map((action, index) => (
          <span key={action.id} style={{ display: 'contents' }}>
            {index > 0 && <span className={styles.compactDivider} aria-hidden="true" />}
            <button
              type="button"
              className={styles.compactItem}
              role="button"
              data-destructive={action.destructive ? 'true' : undefined}
              disabled={action.disabled}
              onClick={() => onSelect(action)}
            >
              {action.label}
            </button>
          </span>
        ))}
        {canExpand && (
          <>
            <span className={styles.compactDivider} aria-hidden="true" />
            <button
              type="button"
              className={styles.expandButton}
              aria-label="More edit actions"
              aria-haspopup="menu"
              onClick={onExpand}
            >
              <ChevronIcon />
            </button>
          </>
        )}
      </div>
  );
}

function ContextEditMenuContent({
  actions,
  menuId,
  onSelect,
}: {
  actions: EditMenuResolvedAction[];
  menuId: string;
  onSelect: (action: EditMenuResolvedAction) => void;
}) {
  return (
    <div
      id={menuId}
      className={styles.contextMenu}
      role="menu"
      aria-label="Edit menu"
      style={{ position: 'relative' }}
    >
        <ul className={styles.list}>
          {actions.map((action, index) => {
            const prev = actions[index - 1];
            const showSeparator =
              index > 0 && (prev?.group ?? 'other') !== (action.group ?? 'other');
            return (
              <Fragment key={action.id}>
                {showSeparator && <li className={styles.separator} role="separator" />}
                <li>
                  <button
                    type="button"
                    className={styles.contextItem}
                    role="menuitem"
                    data-destructive={action.destructive ? 'true' : undefined}
                    disabled={action.disabled}
                    onClick={() => onSelect(action)}
                  >
                    {action.icon && <span className={styles.icon}>{action.icon}</span>}
                    <span className={styles.label}>{action.label}</span>
                  </button>
                </li>
              </Fragment>
            );
          })}
        </ul>
      </div>
  );
}

/**
 * Edit menu for changing selected content — compact horizontal bar or vertical context menu.
 * @see https://developer.apple.com/design/human-interface-guidelines/edit-menus
 */
export function EditMenu({
  children,
  context,
  customActions = [],
  includeStandardActions = true,
  variant = 'auto',
  inputMode = 'auto',
  placement = 'auto',
  open,
  onOpenChange,
  onAction,
  onStandardAction,
  longPress = true,
  dimBackground = true,
  className,
  style,
}: EditMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [resolvedVariant, setResolvedVariant] = useState<'compact' | 'context'>(() =>
    resolveEditMenuVariant(variant, inputMode, 'mouse'),
  );
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState<EditMenuPosition>({
    x: 100,
    y: 100,
    placement: 'below',
    pointerOffset: 110,
  });
  const longPressTimer = useRef<number | null>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const actions = useMemo(
    () =>
      filterVisibleEditMenuActions(
        buildEditMenuActions(context, customActions, {
          includeStandard: includeStandardActions,
          onStandardAction,
        }),
      ),
    [context, customActions, includeStandardActions, onStandardAction],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (!next) setExpanded(false);
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const measureAndOpen = useCallback(
    (pointerType: string, anchorRect?: DOMRect) => {
      const resolved = resolveEditMenuVariant(variant, inputMode, pointerType);
      setResolvedVariant(expanded ? 'context' : resolved);

      const rect =
        anchorRect ??
        triggerRef.current?.getBoundingClientRect() ??
        new DOMRect(window.innerWidth / 2 - 40, window.innerHeight / 2, 80, 24);

      const menuWidth = resolved === 'compact' && !expanded ? Math.min(320, actions.length * 72 + 48) : 220;
      const menuHeight = resolved === 'compact' && !expanded ? 40 : Math.min(360, actions.length * 36 + 16);
      setPosition(resolveEditMenuPosition(rect, menuWidth, menuHeight, placement));
      setOpen(true);
    },
    [actions.length, expanded, inputMode, placement, setOpen, variant],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (action: EditMenuResolvedAction) => {
      action.onSelect?.();
      onAction?.(action.id);
      close();
    },
    [close, onAction],
  );

  const handleExpand = useCallback(() => {
    setExpanded(true);
    setResolvedVariant('context');
    const rect =
      triggerRef.current?.getBoundingClientRect() ??
      new DOMRect(position.x, position.y, 80, 24);
    setPosition(resolveEditMenuPosition(rect, 220, Math.min(360, actions.length * 36 + 16), placement));
  }, [actions.length, placement, position.x, position.y]);

  useEffect(() => {
    if (!isOpen || variant === 'auto') return;
    setResolvedVariant(variant);
    const rect =
      triggerRef.current?.getBoundingClientRect() ?? new DOMRect(100, 100, 160, 32);
    const menuWidth = variant === 'compact' ? Math.min(320, actions.length * 72 + 48) : 220;
    const menuHeight = variant === 'compact' ? 40 : Math.min(360, actions.length * 36 + 16);
    setPosition(resolveEditMenuPosition(rect, menuWidth, menuHeight, placement));
  }, [actions.length, isOpen, placement, variant]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen]);

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
        measureAndOpen('mouse', new DOMRect(event.clientX, event.clientY, 1, 1));
      },
      onDoubleClick: (event: React.MouseEvent<Element>) => {
        (child.props.onDoubleClick as ((event: React.MouseEvent<Element>) => void) | undefined)?.(event);
        measureAndOpen('touch', (event.currentTarget as HTMLElement).getBoundingClientRect());
      },
      onPointerDown: (event: React.PointerEvent<Element>) => {
        (child.props.onPointerDown as ((event: React.PointerEvent<Element>) => void) | undefined)?.(event);
        if (!longPress || event.pointerType === 'mouse') return;
        clearLongPress();
        longPressTimer.current = window.setTimeout(() => {
          measureAndOpen(event.pointerType, (event.currentTarget as HTMLElement).getBoundingClientRect());
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

  if (!isValidElement(children)) {
    throw new Error('EditMenu expects a single React element child.');
  }

  const showCompact = resolvedVariant === 'compact' && !expanded;
  const motionPlacement = position.placement === 'above' ? 'top' : 'bottom';

  return (
    <>
      <span ref={triggerRef} className={[styles.triggerWrap, className].filter(Boolean).join(' ')} style={style}>
        {bindTrigger(children as ReactElement<Record<string, unknown>>)}
      </span>
      <ContextualMenuPortal
        open={isOpen && actions.length > 0}
        onClose={close}
        placement={motionPlacement}
        showBackdrop={dimBackground}
        backdropClassName={styles.menuBackdrop}
        surfaceClassName={showCompact ? styles.compactWrap : styles.contextWrap}
        surfaceRole={showCompact ? 'toolbar' : undefined}
        aria-label="Edit menu"
        data-placement={position.placement}
        surfaceStyle={mergeStyles(
          {
            left: position.x,
            top: position.y,
            ['--lr-edit-menu-pointer-x' as string]: `${position.pointerOffset}px`,
          },
          style,
        )}
      >
        <EditMenuPointer placement={position.placement} />
        {showCompact ? (
          <CompactEditMenuContent
            menuId={menuId}
            actions={actions}
            onSelect={handleSelect}
            onExpand={handleExpand}
            canExpand={canExpandCompactMenu(actions.length)}
          />
        ) : (
          <ContextEditMenuContent menuId={menuId} actions={actions} onSelect={handleSelect} />
        )}
      </ContextualMenuPortal>
    </>
  );
}

/** Read-only selectable text region for edit menu demos. */
export function EditMenuSelection({
  children,
  selected = false,
  className,
  ...rest
}: {
  children: ReactNode;
  selected?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={[styles.selectionPreview, className].filter(Boolean).join(' ')}
      data-selected={selected ? 'true' : undefined}
    >
      {children}
    </div>
  );
}

export type {
  EditMenuContext,
  EditMenuItemConfig,
  EditMenuVariant,
  EditMenuInputMode,
  EditMenuContentType,
  StandardEditActionId,
} from './types';
export {
  buildEditMenuActions,
  resolveEditMenuPosition,
  resolveEditMenuVariant,
  isStandardActionAvailable,
  filterVisibleEditMenuActions,
} from './utils';
