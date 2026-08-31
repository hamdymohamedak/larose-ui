import { useCallback, useState, type ButtonHTMLAttributes } from 'react';
import type { Size } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Switch/Switch.module.css';

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
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
  const isOn = isControlled ? checked : uncontrolledChecked;

  const handleClick = useCallback(() => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) {
      setUncontrolledChecked(next);
    }
    onCheckedChange?.(next);
  }, [disabled, isControlled, isOn, onCheckedChange]);

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
