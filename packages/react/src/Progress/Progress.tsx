import type { UIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Progress/Progress.module.css';

export type ProgressVariant = 'default' | 'success' | 'error';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  variant?: ProgressVariant;
  state?: UIState;
  showValue?: boolean;
}

export function Progress({
  value,
  max = 100,
  label,
  variant = 'default',
  state = 'idle',
  showValue = false,
}: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div className={styles.wrapper} data-state={state}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{percent}%</span>}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-label={label}
        data-variant={variant}
        data-state={state}
      >
        <div className={styles.bar} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
