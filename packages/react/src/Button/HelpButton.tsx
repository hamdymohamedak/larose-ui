import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from '@larose-ui/styles/components/Button/Button.module.css';

export interface HelpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Brief phrase explaining what help covers (macOS / visionOS tooltip). */
  helpTopic?: string;
}

/**
 * Circular help button — one per window, lower corner of dialogs/settings.
 * @see https://developer.apple.com/design/human-interface-guidelines/buttons
 */
export const HelpButton = forwardRef<HTMLButtonElement, HelpButtonProps>(
  ({ helpTopic, className, 'aria-label': ariaLabel = 'Help', ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        type="button"
        className={[styles.helpButton, className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
        {...props}
      >
        ?
      </button>
    );

    if (helpTopic) {
      return <Tooltip content={helpTopic}>{button}</Tooltip>;
    }

    return button;
  },
);

HelpButton.displayName = 'HelpButton';
