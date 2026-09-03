import type { CSSProperties } from 'react';
import type { Size } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Spinner/Spinner.module.css';

export interface SpinnerProps {
  size?: Size;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Spinner({ size = 'md', label = 'Loading', className, style }: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, className].filter(Boolean).join(' ')}
      style={style}
      data-size={size}
      role="status"
      aria-label={label}
    >
      <span className={styles.circle} aria-hidden="true" />
    </span>
  );
}
