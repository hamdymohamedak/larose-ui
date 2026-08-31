import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Dialog } from '../Dialog/Dialog';
import { LONG_PRESS_MS } from '../ContextMenu/utils';
import { Menu } from '../Menu/Menu';
import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import {
  defaultDestructiveConfirmation,
  warnIfTooFewPullDownItems,
} from './utils';
import styles from '@larose-ui/styles/components/PullDownButton/PullDownButton.module.css';

export type PullDownEntry = MenuEntry;

export type PullDownButtonVariant = 'default' | 'more';

export interface PullDownDestructiveConfirmation {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface PullDownButtonProps {
  /** Button label (required unless variant is "more"). */
  label?: string;
  entries: PullDownEntry[];
  variant?: PullDownButtonVariant;
  /** Optional menu title — use only when it adds meaning. */
  menuTitle?: string;
  onAction?: (entry: MenuItemConfig) => void;
  destructiveConfirmation?: PullDownDestructiveConfirmation;
  disabled?: boolean;
  /** Safari-style touch-and-hold to reveal the menu. */
  longPress?: boolean;
  icon?: ReactNode;
}

function ChevronDown() {
  return (
    <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className={styles.moreIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="19" cy="12" r="1.75" />
    </svg>
  );
}

/**
 * Pull-down button — menu of commands related to the button’s action.
 * @see https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons
 */
export function PullDownButton({
  label,
  entries,
  variant = 'default',
  menuTitle,
  onAction,
  destructiveConfirmation,
  disabled = false,
  longPress = false,
  icon,
}: PullDownButtonProps) {
  const longPressTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDestructive, setPendingDestructive] = useState<MenuItemConfig | null>(null);

  const preparedEntries = useMemo(
    () =>
      entries.map((entry) => {
        if (entry.type === 'separator' || entry.type === 'submenu') return entry;
        return { ...entry, selected: undefined };
      }),
    [entries],
  );

  useEffect(() => {
    warnIfTooFewPullDownItems(preparedEntries);
  }, [preparedEntries]);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleSelect = useCallback(
    (entry: MenuItemConfig) => {
      if (entry.destructive) {
        setPendingDestructive(entry);
        setOpen(false);
        return false;
      }
      entry.onSelect?.();
      onAction?.(entry);
      return true;
    },
    [onAction],
  );

  const confirmDestructive = useCallback(() => {
    if (!pendingDestructive) return;
    pendingDestructive.onSelect?.();
    onAction?.(pendingDestructive);
    setPendingDestructive(null);
    setOpen(false);
  }, [onAction, pendingDestructive]);

  const cancelDestructive = useCallback(() => {
    setPendingDestructive(null);
  }, []);

  const destructiveCopy = pendingDestructive
    ? {
        ...defaultDestructiveConfirmation(pendingDestructive.label),
        ...destructiveConfirmation,
        confirmLabel:
          destructiveConfirmation?.confirmLabel ?? pendingDestructive.label,
      }
    : null;

  const triggerLabel = variant === 'more' ? label ?? 'More' : label ?? 'Menu';

  const trigger = (
    <button
      type="button"
      className={[
        styles.trigger,
        variant === 'more' ? styles.moreTrigger : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      aria-label={variant === 'more' ? triggerLabel : undefined}
      onPointerDown={(event) => {
        if (!longPress || event.pointerType === 'mouse') return;
        clearLongPress();
        longPressTimer.current = window.setTimeout(() => setOpen(true), LONG_PRESS_MS);
      }}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
    >
      {variant === 'more' ? (
        <MoreIcon />
      ) : (
        <>
          {icon}
          <span className={styles.label}>{triggerLabel}</span>
          <ChevronDown />
        </>
      )}
    </button>
  );

  return (
    <>
      <Menu
        entries={preparedEntries}
        title={menuTitle}
        open={open}
        onOpenChange={setOpen}
        onEntrySelect={handleSelect}
      >
        {trigger as ReactElement}
      </Menu>
      {destructiveCopy && (
        <Dialog
          open={Boolean(pendingDestructive)}
          onClose={cancelDestructive}
          title={destructiveCopy.title}
          description={destructiveCopy.description}
          confirmLabel={destructiveCopy.confirmLabel}
          cancelLabel={destructiveConfirmation?.cancelLabel ?? 'Cancel'}
          variant="destructive"
          onConfirm={confirmDestructive}
        />
      )}
    </>
  );
}

/** Notes-style More pull-down button. */
export function MorePullDownButton(
  props: Omit<PullDownButtonProps, 'variant' | 'label'> & { 'aria-label'?: string },
) {
  return (
    <PullDownButton
      {...props}
      variant="more"
      label={props['aria-label'] ?? 'More'}
    />
  );
}

export type { PullDownEntry as PullDownMenuEntry };
export {
  countPullDownActions,
  warnIfTooFewPullDownItems,
  defaultDestructiveConfirmation,
  MIN_PULLDOWN_ITEMS,
} from './utils';
