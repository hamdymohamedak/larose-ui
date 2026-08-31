import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ContextualMenuPortal } from '../Motion/OverlayPortal';
import type { PopUpCustomOption, PopUpOption } from './types';
import {
  buildPopUpMenuEntries,
  resolveDefaultValue,
  resolvePopUpLabel,
} from './utils';
import styles from '@larose-ui/styles/components/PopUpButton/PopUpButton.module.css';

export interface PopUpButtonProps {
  /** Introductory label describing the control (Calendar-style). */
  label?: string;
  options: PopUpOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  customOption?: PopUpCustomOption;
  /** Optional explanatory text below the control. */
  explanatoryText?: string;
  disabled?: boolean;
  id?: string;
}

function ChevronDown() {
  return (
    <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Pop-up button — flat list of mutually exclusive options in a menu.
 * @see https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons
 */
export function PopUpButton({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  customOption,
  explanatoryText,
  disabled = false,
  id,
}: PopUpButtonProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [internalValue, setInternalValue] = useState(
    () => resolveDefaultValue(options, defaultValue) ?? '',
  );
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const menuEntries = useMemo(
    () => buildPopUpMenuEntries(options, currentValue, customOption),
    [currentValue, customOption, options],
  );

  const displayLabel = resolvePopUpLabel(options, currentValue, placeholder);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const openMenu = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ x: rect.left, y: rect.bottom + 4 });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleSelect = useCallback(
    (entryId: string) => {
      if (customOption && entryId === customOption.value) {
        customOption.onSelect?.();
      }
      setValue(entryId);
      close();
    },
    [close, customOption, setValue],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, open]);

  const triggerId = id ?? `popup-${menuId}`;

  return (
    <div className={styles.wrap}>
      {(label || explanatoryText) && (
        <div className={styles.labelRow}>
          {label && (
            <label className={styles.fieldLabel} htmlFor={triggerId}>
              {label}
            </label>
          )}
          {explanatoryText && !open && (
            <p className={styles.explanatory}>{explanatoryText}</p>
          )}
        </div>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close() : openMenu())}
      >
        <span className={styles.triggerLabel}>{displayLabel}</span>
        <ChevronDown />
      </button>
      <ContextualMenuPortal
        open={open}
        onClose={close}
        placement="bottom"
        backdropClassName={styles.menuBackdrop}
        surfaceId={menuId}
        surfaceClassName={styles.menuPanel}
        surfaceRole="listbox"
        aria-label={label ?? 'Options'}
        surfaceStyle={{ left: position.x, top: position.y }}
        onSurfaceClick={(event) => event.stopPropagation()}
      >
        <ul className={styles.list}>
          {menuEntries.map((entry, index) => {
            if (entry.type === 'separator') {
              return (
                <li key={entry.id ?? `sep-${index}`} className={styles.separator} role="separator" />
              );
            }
            if (entry.type === 'submenu') return null;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  className={styles.item}
                  role="option"
                  aria-selected={entry.selected ? true : undefined}
                  disabled={entry.disabled}
                  onClick={() => handleSelect(entry.id)}
                >
                  <span className={styles.checkmark} aria-hidden="true">
                    {entry.selected ? '✓' : ''}
                  </span>
                  <span className={styles.itemLabel}>{entry.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {explanatoryText && open && (
          <p className={styles.explanatory} style={{ padding: '0.5rem 0.75rem 0.25rem' }}>
            {explanatoryText}
          </p>
        )}
      </ContextualMenuPortal>
    </div>
  );
}

export type { PopUpOption, PopUpCustomOption } from './types';
export {
  resolvePopUpLabel,
  resolveDefaultValue,
  buildPopUpMenuEntries,
} from './utils';
