import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { Size, UIState, Variant } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { Spinner } from '../Spinner/Spinner';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      state,
      loading = false,
      error = null,
      disabled,
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const uiState = resolveUIState({ state, loading, error, disabled });
    const isDisabled =
      disabled || uiState === 'loading' || uiState === 'disabled';

    return (
      <button
        ref={ref}
        type="button"
        className={[styles.button, className].filter(Boolean).join(' ')}
        data-variant={variant}
        data-size={size}
        data-state={uiState}
        disabled={isDisabled}
        aria-busy={uiState === 'loading'}
        aria-disabled={isDisabled}
        {...props}
      >
        {uiState === 'loading' && (
          <span className={styles.spinner} aria-hidden="true">
            <Spinner size="sm" />
          </span>
        )}
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span className={styles.content}>{children}</span>
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        {uiState === 'error' && error && (
          <span className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
