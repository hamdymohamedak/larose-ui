import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from '@larose-ui/styles/components/Button/Button.module.css';

export interface SquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Symbol or icon — square buttons use icons, not text labels. */
  icon: ReactNode;
  tooltip?: string;
  /** Toggle or pop-up behavior is handled by the parent; appearance only. */
  pressed?: boolean;
}

/**
 * Small square button for in-view actions (add/remove rows, etc.).
 * @see https://developer.apple.com/design/human-interface-guidelines/buttons
 */
export const SquareButton = forwardRef<HTMLButtonElement, SquareButtonProps>(
  ({ icon, tooltip, pressed = false, className, 'aria-label': ariaLabel, ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        type="button"
        className={[styles.squareButton, className].filter(Boolean).join(' ')}
        data-pressed={pressed ? 'true' : undefined}
        aria-label={ariaLabel}
        aria-pressed={pressed ? 'true' : undefined}
        {...props}
      >
        <span className={styles.squareButtonIcon}>{icon}</span>
      </button>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{button}</Tooltip>;
    }

    return button;
  },
);

SquareButton.displayName = 'SquareButton';
