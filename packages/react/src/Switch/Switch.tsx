import { useCallback, type ButtonHTMLAttributes } from 'react';
import type { Size } from '@larose/core';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  hint?: string;
  switchSize?: Size;
}

export function Switch({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  hint,
  disabled,
  switchSize = 'md',
  className,
  id,
  ...props
}: SwitchProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : defaultChecked ?? false;

  const handleClick = useCallback(() => {
    if (disabled) return;
    const next = isControlled ? !checked : !isOn;
    onCheckedChange?.(next);
  }, [checked, disabled, isControlled, isOn, onCheckedChange]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <button
          id={inputId}
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-label={label}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className={[styles.track, className].filter(Boolean).join(' ')}
          data-size={switchSize}
          data-state={isOn ? 'on' : 'off'}
          disabled={disabled}
          onClick={handleClick}
          {...props}
        >
          <span className={styles.thumb} aria-hidden="true" />
        </button>
        <span className={styles.label}>{label}</span>
      </div>
      {hint && (
        <span className={styles.hint} id={`${inputId}-hint`}>
          {hint}
        </span>
      )}
    </div>
  );
}
