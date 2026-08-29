import type { Size } from '@larose/core';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: Size;
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading' }: SpinnerProps) {
  return (
    <span
      className={styles.spinner}
      data-size={size}
      role="status"
      aria-label={label}
    >
      <span className={styles.circle} aria-hidden="true" />
    </span>
  );
}
