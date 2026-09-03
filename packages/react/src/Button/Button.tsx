import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { ButtonRole, Size, UIState, Variant } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { useComponentDefaults } from '../theme/useComponentDefaults';
import { Spinner } from '../Spinner/Spinner';
import { Tooltip } from '../Tooltip/Tooltip';
import type { ButtonShape } from './types';
import {
  formatButtonLabel,
  resolveButtonShape,
  splitButtonChildren,
} from './utils';
import styles from '@larose-ui/styles/components/Button/Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Apple HIG semantic role — affects appearance in alerts and sheets. */
  buttonRole?: ButtonRole;
  /** Capsule (default), circle (icon-only), or roundedRect (vertical stacks). */
  shape?: ButtonShape;
  state?: UIState;
  loading?: boolean;
  /** Alternative label shown while loading (Apple HIG activity indicator pattern). */
  loadingLabel?: string;
  error?: string | null;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** macOS: append trailing ellipsis when the button opens another view. */
  opensAnotherView?: boolean;
  /** macOS flexible-height push button for multi-line content. */
  flexible?: boolean;
  iconOnly?: boolean;
  /** watchOS-style full-width primary actions. */
  fullWidth?: boolean;
  /** macOS / visionOS hover tooltip. */
  tooltip?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((incomingProps, ref) => {
  const {
    variant = 'primary',
    size = 'md',
    buttonRole = 'normal',
    shape,
    state,
    loading = false,
    loadingLabel,
    error = null,
    disabled,
    leftIcon,
    rightIcon,
    opensAnotherView = false,
    flexible = false,
    iconOnly = false,
    fullWidth = false,
    tooltip,
    children,
    className,
    style,
    ...props
  } = useComponentDefaults('Button', incomingProps);
    const uiState = resolveUIState({ state, loading, error, disabled });
    const isDisabled =
      disabled || uiState === 'loading' || uiState === 'disabled';
    const isLoading = uiState === 'loading';
    const { text: childText, inlineIcons } = splitButtonChildren(children);
    const hasText = childText !== null;
    const hasLayoutIcon = Boolean(leftIcon || rightIcon);
    const resolvedShape = resolveButtonShape({
      shape,
      iconOnly,
      hasText: hasText && !isLoading,
      hasIcon: hasLayoutIcon,
    });

    let label: ReactNode = childText;
    if (isLoading && loadingLabel) {
      label = loadingLabel;
    } else if (childText) {
      label = formatButtonLabel(childText, opensAnotherView);
    }

    const resolvedVariant =
      buttonRole === 'primary' && variant !== 'destructive' ? 'primary' : variant;

    const button = (
      <button
        ref={ref}
        type="button"
        className={[styles.button, className].filter(Boolean).join(' ')}
        style={style}
        data-variant={resolvedVariant}
        data-size={size}
        data-shape={resolvedShape}
        data-role={buttonRole !== 'normal' ? buttonRole : undefined}
        data-state={uiState}
        data-flexible={flexible ? 'true' : undefined}
        data-full-width={fullWidth ? 'true' : undefined}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true">
            <Spinner size="sm" />
          </span>
        )}
        {!isLoading && leftIcon && (
          <span className={styles.icon}>{leftIcon}</span>
        )}
        {(hasText || isLoading) && (
          <span className={styles.content}>{label}</span>
        )}
        {!isLoading &&
          inlineIcons.map((icon, index) => (
            <span key={index} className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          ))}
        {!isLoading && rightIcon && (
          <span className={styles.icon}>{rightIcon}</span>
        )}
        {uiState === 'error' && error && (
          <span className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </button>
    );

    if (tooltip && !isDisabled) {
      return <Tooltip content={tooltip}>{button}</Tooltip>;
    }

    return button;
});

Button.displayName = 'Button';
